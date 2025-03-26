"use server";

import { Event } from "@/types/schema/Event.schema";
// Mock data for development
const mockEventData: Event = {
  id: "event-1",
  title: "Sample Event",
  description: "Sample Description",
  date: "2025-06-15",
  time: "2:00 pm",
  location: "Sample Location",
  type: "wedding",
  templateId: "template-1",
  media: {
    type: "image",
    url: "",
  },
  program: [
    {
      title: "Welcome",
      description: "Welcome ceremony",
      dateTime: "2024-06-15T14:00:00Z",
      speaker: {
        name: "Host",
        bio: "Event Host",
        image: "",
      },
    },
  ],
  attendees: 0,
  maxAttendees: 100,
  rsvp: {
    title: "Together With Their Families",
    subtitle: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
    invitation: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
    accept_text: "Joyfully Accept",
    decline_text: "Respectfully Decline",
    deadline: "2025-05-15",
    title_as_image: "https://i.ibb.co/r2wYRn2j/Kindly-Respond-removebg-preview-1.png",
  },
  status: "published",
};

export async function getEventData(eventId: string): Promise<Event> {
  // TODO: Replace with actual API call
  return mockEventData;
}
