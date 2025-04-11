import { Collections } from "@/constants/collections.enum";
import { errorHandler } from "@/helpers/errorHandler";
import { createDirectusClient } from "@/lib/directus";
import { TDefaultFieldFilter } from "@/types/index.types";
import { Guest } from "@/types/schema/Guest.schema";
import { readItems } from "@directus/sdk";

export const getGuests = async (props?: Partial<TDefaultFieldFilter<Guest>>) => {
  try {
    const client = createDirectusClient();
    const response = (await client.request(readItems(Collections.GUESTS, props))) as unknown as Guest;
    return { success: true, data: response };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
};
