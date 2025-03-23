"use server";

import { Event } from "@/types/schema/Event.schema";

const mockGuestData = {
  id: "guest-1",
  firstName: "Aurora",
  lastName: "Demonteverde",
  guestType: "regular" as const,
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
