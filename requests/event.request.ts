import { Status, TDefaultFieldFilter } from "@/types/index.types";

import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import createDirectusClient from "@/lib/directus";
import { Event, Section } from "@/types/schema/Event.schema";
import { createItem, readItem, readItems, readMe, updateItem } from "@directus/sdk";

export const createEvent = async (event: Partial<Omit<Event, "id" | "rsvp"> & { rsvp?: string }>) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(createItem(Collections.EVENTS, event))) as unknown as Event;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const getEvents = async (props: Partial<TDefaultFieldFilter<Event>> = { fields: ["*", "guests.*", "guests.guests_id.*"], filter: { status: { _neq: "archived" } } }) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItems(Collections.EVENTS, props))) as unknown as Event[];

    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const getMyEvents = async (props: Partial<TDefaultFieldFilter<Event>> = { fields: ["*", "guests.*", "guests.guests_id.*"], filter: { status: { _neq: "archived" } } }) => {
  try {
    const client = createDirectusClient();
    const me = await client.request(readMe({ fields: ["id"] }));
    const response = (await client.request(readItems(Collections.EVENTS, { ...props, filter: { ...props.filter, user_created: { _eq: me.id } } }))) as unknown as Event[];

    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const getEventById = async (id: Event["id"], props: Partial<TDefaultFieldFilter<Event>> = { fields: ["*", "rsvp.*", "guests.guests_id.*", "sections.sections_id.*"] }) => {
  try {
    const client = createDirectusClient();

    const response = (await client.request(
      readItem(Collections.EVENTS, id, { ...props, filter: { ...props.filter, sections: { sections_id: { status: { _neq: Status.Enum.archived } } } } })
    )) as unknown as Event;

    console.log("🚀 ~ getEventById ~ response:", response);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export async function addEventSection(eventId: string, data: Partial<Section>) {
  try {
    const client = createDirectusClient();
    const response = (await client.request(createItem(Collections.SECTIONS, { ...data, status: Status.Enum.published }))) as unknown as Section;

    await client.request(createItem(Collections.EVENTS_SECTIONS, { events_id: eventId, sections_id: response.id }));
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
}

export async function archiveEventSection(sectionId: string) {
  try {
    const client = createDirectusClient();
    const response = (await client.request(updateItem(Collections.SECTIONS, sectionId, { status: Status.Enum.archived }))) as unknown as Section;

    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
}
