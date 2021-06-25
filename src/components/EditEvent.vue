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
        @update-value="(i) => update((e) => (e.interactions[index] = i))"
      ></EditInteraction>
      <!-- TODO Button for add new interaction -->
    </div>
  </FieldGroup>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import FieldGroup from "./FieldGroup.vue"
import { Event } from "../types"
import EditInteraction from "./EditInteraction.vue"
import FieldText from "./FieldText.vue"

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
  },
})
</script>

<style lang="scss">
.canvas {
  --canvas-bg: hsl(0, 0%, 99%);
  --canvas-line: hsl(200, 50%, 90%);
  --canvas-line-width: 1px;
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

.event-wrapper {
  display: flex;
  flex-direction: column;

  .canvas {
    flex-grow: 1;
  }
}
</style>
