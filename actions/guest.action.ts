"use server";

import { Guest } from "@/types/schema/Guest.schema";
import { Event } from "@/types/schema/Event.schema";
import { getGuestById, updateGuest } from "@/requests/guest.request";

export async function getGuestData(guestId: string) {
  const response = await getGuestById(guestId);
  if (!response.success) {
    return undefined;
  }

  return response.data;
}

export const submitRSVP = async (data: Partial<Guest>) => {
  if (!data.id) {
    return { success: false, message: "Guest ID is required" };
  }
  const { id, ...guestResponse } = data;

  return await updateGuest(id, guestResponse);
};
