import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import { createDirectusClient } from "@/lib/directus";
import { Status, TDefaultFieldFilter } from "@/types/index.types";
import { Guest } from "@/types/schema/Guest.schema";
import { createItem, readItems, updateItem } from "@directus/sdk";

export const getGuests = async (props?: Partial<TDefaultFieldFilter<Guest>>) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItems(Collections.GUESTS, props))) as unknown as Guest;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const getGuestByToken = async (token: string) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItems(Collections.GUESTS, { filter: { token } }))) as unknown as Guest;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const getGuestById = async (id: string) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItems(Collections.GUESTS, { filter: { id } }))) as unknown as Guest;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const createGuest = async (data: Omit<Guest, "id" | "token" | "response" | "phone_number" | "dietary_requirements" | "message">, eventId: string) => {
  try {
    const client = createDirectusClient();

    const response = (await client.request(createItem(Collections.GUESTS, data))) as unknown as Guest;
    await client.request(createItem(Collections.EVENT_GUESTS, { guests_id: response.id, events_id: eventId }));
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const updateGuest = async (id: string, data: Partial<Omit<Guest, "token" | "response" | "phoneNumber" | "dietaryRequirements" | "message">>) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(updateItem(Collections.GUESTS, id, data))) as unknown as Guest;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const archiveGuest = async (id: string) => {
  try {
    const client = createDirectusClient();
    await client.request(updateItem(Collections.GUESTS, id, { status: Status.Enum.archived }));
    return { success: true };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
