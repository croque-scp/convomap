<template>
  <ul>
    <li v-for="event in events" :key="event.id">
      <button
        :disabled="selectedEventId === event.id"
        @click="$emit('event-select', event.id)"
      >
        {{ event.id }}
      </button>
      {{ event.interactions.length }} interactions
      <!-- TODO Create new sub-event -->
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { Event } from "../types"

export default defineComponent({
  name: "EditEventSelect",
  props: {
    events: {
      type: Object as PropType<Event[]>,
      required: true,
    },
    selectedEventId: {
      type: String as PropType<string | null>,
      required: true,
    },
  },
  emits: ["event-select"],
})
</script>

<style lang="scss"></style>
