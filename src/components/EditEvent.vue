<template>
  <div class="event-wrapper">
    <FieldText
      :value="event.id"
      label="ID"
      @update-value="(value) => update((e) => (e.id = value))"
    ></FieldText>
    <FieldText
      :value="event.summary"
      label="Summary"
      @update-value="(value) => update((e) => (e.summary = value))"
    ></FieldText>
    <div v-if="interactionsLayout" class="canvas">
      <div
        class="tree"
        :style="{
          height: `${interactionsLayout.height}px`,
          width: `${interactionsLayout.width}px`,
        }"
      >
        <!-- Arrows between nodes -->
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker
              id="arrowhead"
              orient="auto"
              markerWidth="2"
              markerHeight="4"
              refX="0.1"
              refY="2"
            >
              <path d="M0,0 V4 L2,2 Z" />
            </marker>
          </defs>
          <ArrowConnector
            v-for="(edge, index) in interactionsLayout.edges"
            :key="index"
            :points="edge"
          ></ArrowConnector>
        </svg>
        <div
          v-for="(interaction, interactionIndex) in event.interactions"
          :key="interaction.id"
          class="interaction-wrapper"
        >
          <!-- Each interaction is represented as a node -->
          <EditInteraction
            :interaction="interaction"
            class="interaction"
            :style="getInteractionLayoutStyle(interaction)"
            @update-value="
              (i) => update((e) => (e.interactions[interactionIndex] = i))
            "
          ></EditInteraction>
          <!-- Each option is also represented as a node -->
          <EditOption
            v-for="(option, optionIndex) in interaction.options"
            :key="optionIndex"
            class="option"
            :style="getInteractionLayoutStyle(interaction, option)"
          ></EditOption>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watchEffect } from "vue"
import { Event, Interaction, Option } from "../types"
import EditInteraction from "./EditInteraction.vue"
import EditOption from "./EditOption.vue"
import FieldText from "./FieldText.vue"
import { createInteractionGraph, GraphLayout } from "../lib/graphLayout"
import { getOptionId } from "../lib/identifier"
import ArrowConnector from "./ArrowConnector.vue"

export default defineComponent({
  name: "EditEvent",
  components: {
    FieldText,
    EditInteraction,
    EditOption,
    ArrowConnector,
  },
  props: {
    eventId: {
      type: String,
      required: true,
    },
    event: {
      type: Object as PropType<Event>,
      required: true,
    },
  },
  emits: ["updateValue"],
  setup(props) {
    let interactionsLayout = ref<GraphLayout | null>(null)
    watchEffect(() => {
      void createInteractionGraph(props.event.interactions).then(
        (graphLayout) => (interactionsLayout.value = graphLayout)
      )
    })
    return { interactionsLayout }
  },
  methods: {
    /**
     * Updates the currently-displayed event.
     *
     * @param change - The change to make to the event.
     */
    update(change: (event: Event) => void) {
      change(this.event)
      this.$emit("updateValue", this.event)
    },
    /**
     * Retrieves the style for a given node from the interactions layout.
     *
     * @param interaction - The interaction to retrieve the style for.
     * @param option - If provided, then the option to retrieve the style
     * for, assuming it is contained within the interaction.
     */
    getInteractionLayoutStyle(
      interaction: Interaction,
      option?: Option
    ): {
      height: string
      width: string
      top: string
      left: string
    } {
      const searchId = option
        ? getOptionId(interaction, option)
        : interaction.id
      const node = this.interactionsLayout?.nodes.find(
        (node) => node.id === searchId
      )
      // TODO Height and width should not be needed
      const style = node
        ? {
            height: `${node.height}px`,
            width: `${node.width}px`,
            left: `${node.x}px`,
            top: `${node.y}px`,
          }
        : { height: "0px", width: "0px", left: "0px", top: "0px" }
      return style
    },
  },
})
</script>

<style lang="scss">
.canvas {
  --canvas-bg: hsl(0, 0%, 99%);
  --canvas-line: hsl(200, 50%, 90%);
  --canvas-line-width: 1px;
  border: calc(var(--canvas-line-width) * 2) solid var(--canvas-line);
  background-image: linear-gradient(
      to bottom,
      var(--canvas-line) var(--canvas-line-width),
      transparent 0
    ),
    linear-gradient(
      to right,
      var(--canvas-line) var(--canvas-line-width),
      var(--canvas-bg) 0
    );
  background-size: 1rem 1rem;
  background-attachment: local;
  overflow: scroll;
  // Limit the canvas to be the width of the window minus its parent's
  // horizontal margins - height is already limited by flex
  max-width: calc(100vw - 0);
  min-width: calc(100%);

  .tree {
    position: relative;

    svg {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}

.interaction,
.option {
  position: absolute;
  box-sizing: border-box;
  margin: 0 !important; // Override scoped style on FieldGroup
}

.event-wrapper {
  display: flex;
  flex-direction: column;

  p {
    margin: 0.5rem;
  }

  .canvas {
    flex-grow: 1;
  }
}
</style>
