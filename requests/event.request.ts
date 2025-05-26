import { TDefaultFieldFilter } from "@/types/index.types";

import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import createDirectusClient from "@/lib/directus";
import { Event } from "@/types/schema/Event.schema";
import { createItem, readItem, readItems, readMe } from "@directus/sdk";

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

export const getEventById = async (id: Event["id"], props: Partial<TDefaultFieldFilter<Event>> = { fields: ["*", "rsvp.*", "guests.guests_id.*"] }) => {
  try {
    const client = createDirectusClient();

    const response = (await client.request(readItem(Collections.EVENTS, id, props))) as unknown as Event;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export async function updateEvent(eventId: string, data: Partial<Event>) {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update event",
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update event",
    };
  }
}
