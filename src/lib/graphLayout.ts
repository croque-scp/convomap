/* eslint-disable @typescript-eslint/no-non-null-assertion */

import ELK, { ElkExtendedEdge, ElkNode } from "elkjs/lib/elk.bundled"
import { Interaction } from "types"
import { getOptionId } from "./identifier"

type Point = { x: number; y: number }
type Dimensions = { height: number; width: number }
export type Edge = Point[]
type Node = Point & Dimensions & { id: string }
export type GraphLayout = Dimensions & { edges: Edge[]; nodes: Node[] }

/**
 * Creates a directed graph to visually represent an interaction tree.
 *
 * @param interactions - The list of interactions to render.
 * @param dimensions - An object containing the dimensions of each node to
 * render. Keys of the object are the IDs of each node, and there must be
 * an entry for every node.
 */
export async function createInteractionGraph(
  interactions: Interaction[],
  dimensions: Record<string, Dimensions>
): Promise<GraphLayout> {
  const elk = new ELK()

  const elkChildren: ElkNode[] = []
  const elkEdges: { source: string; target: string }[] = []

  // Iterate through interactions to render them
  interactions.forEach((interaction) => {
    const iDims = dimensions[interaction.id]
    if (!iDims) throw new Error(`Missing dimensions for ${interaction.id}`)
    elkChildren.push({ id: interaction.id, ...iDims })
    if (interaction.fallbackTargetInteraction) {
      // Connect this interaction and its fallback, if any
      elkEdges.push({
        source: interaction.id,
        target: interaction.fallbackTargetInteraction,
      })
    }
    // Also iterate the options
    interaction.options?.forEach((option) => {
      const optionId = getOptionId(interaction, option)
      const oDims = dimensions[optionId]
      if (!oDims) throw new Error(`Missing dimensions for ${optionId}`)
      elkChildren.push({ id: optionId, ...oDims })
      // Connect this option and its parent interaction
      elkEdges.push({ source: interaction.id, target: optionId })
      // Connect this option and its target interaction
      // The target interaction can be Conditional, which must be resolved
      // TODO Resolve conditional target interaction
      if (typeof option.targetInteraction === "string") {
        elkEdges.push({ source: optionId, target: option.targetInteraction })
      }
    })
  })

  // Generate the graph
  const graph = await elk.layout({
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      // Network simplex strategy looks cleaner for dialogue tree
      "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
      // Combine arrows between nodes to single multi-arrow
      "elk.layered.mergeEdges": "true",
      // Increase spacing between node layers
      "elk.layered.spacing.nodeNodeBetweenLayers": "30", // Below arrow
      "elk.layered.spacing.edgeNodeBetweenLayers": "30", // Above arrow
      // Increase spacing between nodes in same layer
      "elk.spacing.nodeNode": "40",
    },
    children: elkChildren,
    edges: elkEdges.map((edge, index) => {
      return {
        id: `e${index}`,
        sources: [edge.source],
        targets: [edge.target],
      }
    }),
  })

  // Extract nodes
  const nodes = graph.children!.map((node) => {
    return {
      id: node.id,
      x: node.x!,
      y: node.y!,
      height: node.height!,
      width: node.width!,
    }
  })

  // Extract edges
  const edges = (<ElkExtendedEdge[]>graph.edges).map((edge) => {
    const section = edge.sections[0]
    return [section.startPoint, ...(section.bendPoints ?? []), section.endPoint]
  })

  // Extract the graph itself
  const height = graph.height!
  const width = graph.width!

  return {
    height,
    width,
    edges,
    nodes,
  }
}

/**
 * Represents a point as numeric coords joined with a comma.
 *
 * @param point - The point to transform.
 */
export function pointToCoords(point: Point): string {
  return `${point.x}, ${point.y}`
}
