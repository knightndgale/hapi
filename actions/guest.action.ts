"use server";

import { Guest } from "@/types/schema/Guest.schema";
import { Event } from "@/types/schema/Event.schema";
import { getGuestById } from "@/requests/guest.request";

export async function getGuestData(guestId: string) {
  const response = await getGuestById(guestId);
  if (!response.success) {
    return undefined;
  }

  return response.data;
}

export async function submitRSVP(data: { eventId: string; guestId: string; response: "accept" | "decline"; phoneNumber?: string; dietaryRequirements?: string; message?: string; images?: File[] }) {
  // TODO: Replace with actual API call
  return { success: true };
}
