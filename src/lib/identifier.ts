import { Event, EventsRegistry, Interaction, Option } from "../types"

/**
 * From an events registry, returns the event with the given id. Throws an error
 * if no matching event is found.
 *
 * @param eventsRegistry - The list of events to be searched.
 * @param eventId - The id of the wanted event, equivalent to the path of
 * its file.
 */
export function getEvent(
  eventsRegistry: EventsRegistry,
  eventId: string
): Event {
  console.log("Getting event with id", JSON.stringify(eventId))
  const matchingEvent = eventsRegistry.events.find(
    (event) => (event.id = eventId)
  )
  if (!matchingEvent) {
    throw new Error(`No events match the id ${JSON.stringify(eventId)}`)
  }
  return matchingEvent
}

/**
 * In an events registry, sets the event with the given ID to a new value.
 * If no such event exists in the registry, it is created.
 *
 * The old event ID and the ID of the new event do not need to be
 * identical, but this should only happen in the case where the ID of an
 * event is being changed.
 *
 * @param eventsRegistry - The events registry to modify.
 * @param eventId - The ID of the new event.
 * @param newEvent - The new event with which to replace the old one (or a
 * new event to add).
 */
export function setEvent(
  eventsRegistry: EventsRegistry,
  eventId: string,
  newEvent: Event
): void {
  console.log(
    "Saving event with id",
    JSON.stringify(newEvent.id),
    "over",
    JSON.stringify(eventId)
  )
  const matchingEventIndex = eventsRegistry.events.findIndex(
    (event) => event.id === eventId
  )
  if (matchingEventIndex === -1) {
    eventsRegistry.events.push(newEvent)
    return
  }
  eventsRegistry.events[matchingEventIndex] = newEvent
}

/**
 * Constructs the pseudo-ID for an option in an interaction.
 *
 * Fails if the interaction does not contain the option.
 *
 * @param interaction - The interaction that contains this option.
 * @param option - The option.
 */
export function getOptionId(interaction: Interaction, option: Option): string {
  const optionIndex = interaction.options?.indexOf(option)
  if (typeof optionIndex !== "number") {
    throw new Error(
      `Option with text ${JSON.stringify(
        option.text
      )} was not found in interaction with id ${JSON.stringify(interaction.id)}`
    )
  }
  return `${interaction.id}-option-${optionIndex}`
}
