import dagre from "dagre"
import { Interaction } from "types"
import { getOptionId } from "./identifier"

type Point = { x: number; y: number }
type Dimensions = { height: number; width: number }
type Edge = Point[]
type Node = Point & Dimensions & { id: string }
export type GraphLayout = Dimensions & { edges: Edge[]; nodes: Node[] }

/**
 * Creates a directed graph to visually represent an interaction tree.
 *
 * @param interactions - The list of interactions to render.
 */
export function createInteractionGraph(
  interactions: Interaction[]
): GraphLayout {
  const graph = new dagre.graphlib.Graph()
  graph.setGraph({})

  // No labels on this graph
  graph.setDefaultEdgeLabel(() => ({}))
  graph.setDefaultNodeLabel(() => ({}))

  // Iterate through interactions to render them
  interactions.forEach((interaction) => {
    // Just use a default width and height for now
    // TODO Get width and height from HTML
    graph.setNode(interaction.id, { width: 300, height: 300 })
    if (interaction.fallbackTargetInteraction) {
      // Connect this interaction and its fallback, if any
      graph.setEdge(interaction.id, interaction.fallbackTargetInteraction)
    }
    // Also iterate the options
    interaction.options?.forEach((option) => {
      const optionId = getOptionId(interaction, option)
      graph.setNode(optionId, {
        width: 300,
        height: 100,
      })
      // Connect this option and its parent interaction
      graph.setEdge(interaction.id, optionId)
      // Connect this option and its target interaction
      // The target interaction can be Conditional, which must be resolved
      // TODO Resolve conditional target interaction
      if (typeof option.targetInteraction === "string") {
        graph.setEdge(optionId, option.targetInteraction)
      }
    })
  })

  // Generate the graph
  dagre.layout(graph)

  // Extract nodes
  const nodes = graph.nodes().map((nodeId) => {
    const node = graph.node(nodeId)
    // The coords of each node are at their centre, but for CSS positioning
    // I want the coords of the top-right corner
    node.x = node.x - node.width / 2
    node.y = node.y - node.height / 2
    return { ...node, id: nodeId }
  })

  // Extract edges
  const edges = graph.edges().map((edgeId) => {
    const edge = graph.edge(edgeId)
    return edge.points
  })

  // Extract the graph itself
  // The graph has been calculated, so assert that it has the properties we
  // want
  const graphInfo = <Dimensions>graph.graph()
  const height = graphInfo.height
  const width = graphInfo.width

  return {
    height,
    width,
    edges,
    nodes,
  }
}
