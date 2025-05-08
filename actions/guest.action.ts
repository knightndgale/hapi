"use server";

import { Guest } from "@/types/schema/Guest.schema";
import { Event } from "@/types/schema/Event.schema";

const mockGuestData: Guest = {
  id: "guest-1",
  firstName: "Aurora",
  lastName: "Demonteverde",
  type: "regular" as const,
  response: "pending" as const,
};

export async function getGuestData(guestId: string) {
  // TODO: Replace with actual API call
  return mockGuestData;
}

export async function submitRSVP(data: { eventId: string; guestId: string; response: "accept" | "decline"; phoneNumber?: string; dietaryRequirements?: string; message?: string; images?: File[] }) {
  // TODO: Replace with actual API call
  console.log("Submitting RSVP:", data);
  return { success: true };
}
