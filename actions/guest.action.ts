"use server";

import { Guest } from "@/types/schema/Guest.schema";
import { Event } from "@/types/schema/Event.schema";
import { getGuestById, updateGuest } from "@/requests/guest.request";
import { getEventGuests, getGuestByToken } from "@/requests/event.request";
import { errorHandler } from "@/helpers/errorHandler";

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

export async function updateGuestAttendanceStatus(guestId: string, attendanceStatus: "admitted" | "not_admitted") {
  try {
    await updateGuest(guestId, { attendance_status: attendanceStatus });
    return { success: true };
  } catch (error) {
    return { success: false, message: "Failed to update attendance status" };
  }
}

export async function getGuestsForAttendance(eventId: string) {
  try {
    const response = await getEventGuests(eventId);

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
}

export async function retreiveGuestByToken(token: string) {
  try {
    const response = await getGuestByToken(token);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: errorHandler(error) };
  }
}
