<template>
  <FieldGroup :name="`Event: ${eventId}`" class="event-wrapper">
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
    <div class="canvas">
      <EditInteraction
        v-for="(interaction, index) in event.interactions"
        :key="interaction.id"
        :interaction="interaction"
        class="interaction"
        :style="getInteractionLayoutStyle(interaction.id)"
        @update-value="(i) => update((e) => (e.interactions[index] = i))"
      ></EditInteraction>
      <!-- TODO Height and width should not be needed in the above -->
      <!-- TODO Button for add new interaction -->
    </div>
  </FieldGroup>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import FieldGroup from "./FieldGroup.vue"
import { Event, InteractionId } from "../types"
import EditInteraction from "./EditInteraction.vue"
import FieldText from "./FieldText.vue"
import { createInteractionGraph, GraphLayout } from "../lib/graphLayout"

export default defineComponent({
  name: "EditEvent",
  components: {
    FieldText,
    EditInteraction,
    FieldGroup,
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
  computed: {
    interactionsLayout(): GraphLayout {
      const layout = createInteractionGraph(this.event.interactions)
      console.log(layout)
      return layout
    },
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
     * @param id - The ID of the interaction.
     */
    getInteractionLayoutStyle(
      interactionId: InteractionId
    ): {
      height: string
      width: string
      top: string
      left: string
    } {
      const node = this.interactionsLayout.nodes.find(
        (node) => node.id === interactionId
      )
      const style = !node
        ? { height: "0px", width: "0px", left: "0px", top: "0px" }
        : {
            height: `${node.height}px`,
            width: `${node.width}px`,
            left: `${node.x}px`,
            top: `${node.y}px`,
          }
      console.log(style)
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
  position: relative;
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
  padding: 1rem; // TODO Remove this when graph has its own padding
  border: calc(var(--canvas-line-width) * 2) solid var(--canvas-line);
  overflow: scroll;
}

.interaction {
  position: absolute;
}

.event-wrapper {
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 1;
  }
}
</style>
