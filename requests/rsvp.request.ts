import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import createDirectusClient from "@/lib/directus";
import { RSVP, RSVPSchema } from "@/types/schema/Event.schema";
import { createItem } from "@directus/sdk";

export const createRSVP = async (rsvp: Partial<RSVP>) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(createItem(Collections.RSVP, rsvp))) as unknown as RSVP;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
