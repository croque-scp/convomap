<template>
  <main>
    <header>
      <h1>Event Editor</h1>
      <p>Changes made to events are automatically saved.</p>
      <p>Pick the event to edit:</p>
      <EditEventSelect
        :events="eventsRegistry.events"
        :selected-event-id="selectedEventId"
        @event-select="changeSelectedEvent"
      ></EditEventSelect>
    </header>
    <EditEvent
      v-if="selectedEventId !== null && activeEvent !== null"
      :event="activeEvent"
      :event-id="selectedEventId"
      class="edit-event"
      @update-value="update"
    ></EditEvent>
  </main>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import EditEventSelect from "./EditEventSelect.vue"
import EditEvent from "./EditEvent.vue"
import { Event, EventsRegistry } from "../types"
import { getEvent, setEvent } from "../lib/identifier"
import { createEventsFileProxy } from "../lib/eventsFilesystemProxy"

export default defineComponent({
  name: "Editor",
  components: {
    EditEvent,
    EditEventSelect,
  },
  setup() {
    console.log("Initialising events")
    let eventsRegistry: EventsRegistry = reactive({
      _meta: {
        _convomap: "Made with Convomap https://github.com/croque-scp/convomap",
      },
      events: [],
    })
    eventsRegistry = createEventsFileProxy(eventsRegistry)
    return { eventsRegistry }
  },
  data() {
    return {
      selectedEventId: <string | null>null,
    }
  },
  computed: {
    activeEvent(): Event | null {
      // If the current ID is null, just don't do anything for now
      if (this.selectedEventId === null) return null
      return getEvent(this.eventsRegistry, this.selectedEventId)
    },
  },
  methods: {
    /**
     * Changes the displayed event of the event editor component.
     *
     * @param eventId - The identifier of the new event to be selected.
     */
    changeSelectedEvent(eventId: string) {
      console.log("Changing selected event to", JSON.stringify(eventId))
      this.selectedEventId = eventId
    },
    /**
     * Updates the currently-displayed event.
     *
     * @param newEvent - The new event object to replace the existing one.
     */
    update(newEvent: Event) {
      console.log(
        "Updating event with id",
        JSON.stringify(this.selectedEventId),
        "with",
        JSON.stringify(newEvent.id)
      )
      if (this.selectedEventId === null) return
      setEvent(this.eventsRegistry, this.selectedEventId, newEvent)
    },
  },
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}

main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;

  .edit-event {
    flex-grow: 1;
    overflow: hidden;
  }
}
</style>
