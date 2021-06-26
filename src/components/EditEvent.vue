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
      <template
        v-for="(interaction, interactionIndex) in event.interactions"
        :key="interaction.id"
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
      </template>
    </div>
  </FieldGroup>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import FieldGroup from "./FieldGroup.vue"
import { Event, Interaction, Option } from "../types"
import EditInteraction from "./EditInteraction.vue"
import EditOption from "./EditOption.vue"
import FieldText from "./FieldText.vue"
import { createInteractionGraph, GraphLayout } from "../lib/graphLayout"
import { getOptionId } from "../lib/identifier"

export default defineComponent({
  name: "EditEvent",
  components: {
    FieldText,
    FieldGroup,
    EditInteraction,
    EditOption,
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
      const node = this.interactionsLayout.nodes.find(
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
  background-attachment: local;
  padding: 1rem; // TODO Remove this when graph has its own padding
  border: calc(var(--canvas-line-width) * 2) solid var(--canvas-line);
  overflow: scroll;
}

.interaction,
.option {
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
