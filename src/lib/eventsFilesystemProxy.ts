import { Event, EventsRegistry } from "../types"

/**
 * Asynchronously creates a proxy for the events file.
 *
 * The proxy here constructs a fake interactions tree and populates it with
 * the files it contains, and intercepts save requests and transmits them to the
 * file.
 *
 * @param events - The events object to store the events in.
 *
 * @returns A Proxy that wraps the provided events object; old references
 * to the events object should point to the Proxy if they want edit events
 * to be transmitted.
 */
export function createEventsFileProxy(
  eventsRegistry: EventsRegistry
): EventsRegistry {
  console.log("Creating events dir proxy")
  window.fileReadWrite.readEventsFile.singleResponse((eventsFile) => {
    // Construct and bind this event's children
    console.log("Received events file read")
    // Parse the events file to what is hopefully a valid events registry
    // structure - TODO verify this
    const eventsRegistryOnFile = <EventsRegistry>JSON.parse(eventsFile)
    // TODO Input validation
    eventsRegistry._meta = eventsRegistryOnFile._meta
    eventsRegistry.events = eventsRegistryOnFile.events
    // Assigning each property individually so as not to overwrite the
    // object reference - might be a better way of doing this
  })
  window.fileReadWrite.readEventsFile.send()
  return new Proxy(eventsRegistry, {
    set(events, eventId: string, event: Event) {
      console.log("Applying update to event", JSON.stringify(eventId))
      window.fileReadWrite.writeEventsFile.singleResponse(() => {
        console.log("Backup successful for", JSON.stringify(eventId))
      })
      // Make a backup of the old file
      window.fileReadWrite.writeEventsFile.send(JSON.stringify(event, null, 2))
      // Make the actual changes to the object
      return Reflect.set(events, eventId, event)
    },
  })
}
