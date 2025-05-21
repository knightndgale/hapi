import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import { createDirectusClient } from "@/lib/directus";
import { Status, TDefaultFieldFilter } from "@/types/index.types";
import { Guest } from "@/types/schema/Guest.schema";
import { createItem, readItem, readItems, updateItem } from "@directus/sdk";
import * as jose from "jose";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key";
const TOKEN_EXPIRATION = process.env.NEXT_PUBLIC_GUEST_TOKEN_EXPIRATION || "30d";

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

export const getGuestById = async (id: string | number) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItem(Collections.GUESTS, id))) as unknown as Guest;
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

    // Generate JWT token with guest and event information
    const tokenPayload = {
      guestId: response.id,
      eventId: eventId,
    };

    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new jose.SignJWT(tokenPayload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(TOKEN_EXPIRATION).sign(secret);

    const updatedGuest = (await client.request(updateItem(Collections.GUESTS, response.id, { token }))) as unknown as Guest;
    return { success: true, data: updatedGuest };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};

export const updateGuest = async (id: string, data: Partial<Omit<Guest, "token" | "response" | "phoneNumber" | "dietaryRequirements" | "message">>) => {
  try {
    const client = createDirectusClient();
    const { images, ...payload } = data;
    if (images && images.length > 0) {
      for await (const image of images) {
        await client.request(createItem(Collections.GUEST_FILES, { guests_id: id, directus_files_id: image }));
      }
    }
    const response = (await client.request(updateItem(Collections.GUESTS, id, payload))) as unknown as Guest;

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

// Add a function to verify and decode the JWT token
export const verifyGuestToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    // Verify that the payload contains the required fields
    if (!payload.guestId || !payload.eventId) {
      return { success: false, message: "Invalid token payload" };
    }

    return {
      success: true,
      data: {
        guestId: payload.guestId as number,
        eventId: payload.eventId as string,
      },
    };
  } catch (error) {
    return { success: false, message: "Invalid or expired token" };
  }
};
