import { Status, TDefaultFieldFilter } from "@/types/index.types";

import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import createDirectusClient from "@/lib/directus";
import { Event, Section } from "@/types/schema/Event.schema";
import { createItem, readItem, readItems, readMe, updateItem } from "@directus/sdk";
import { Guest } from "@/types/schema/Guest.schema";

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

export const getEventById = async (id: Event["id"], props: Partial<TDefaultFieldFilter<Event>> = { fields: ["*", "rsvp.*", "guests.*.*", "sections.*.*", "programs.*.*"] }) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItem(Collections.EVENTS, id, props))) as unknown as Event;

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

export async function getEventGuests(eventId: string) {
  try {
    const client = createDirectusClient();
    const response = await client.request(
      readItems(Collections.EVENT_GUESTS, { filter: { events_id: { _eq: eventId }, guests_id: { status: { _neq: "archived" } } }, fields: ["*", "guests_id.*"], limit: 300 })
    );
    const guests = response.map((guest) => guest.guests_id) as unknown as Guest[];
    return { success: true, data: guests };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
}
