"use server";

import { Event, EventStatus, EventType } from "@/types/schema/Event.schema";
// Mock data for development
const mockEventData: Event = {
  id: "event-1",
  title: "Sample Event",
  description: "Sample Description",
  location: "Sample Location",
  startDate: new Date("2025-06-15"),
  endDate: new Date("2025-06-15"),
  startTime: "2:00 pm",
  endTime: "2:00 pm",
  type: "wedding",
  templateId: "template-1",
  sections: [],
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
      icon: "church",
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

// Dummy data for events
const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Summer Wedding",
    description: "A beautiful summer wedding celebration",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-15"),
    startTime: "14:00",
    endTime: "14:00",
    location: "Sunset Beach Resort",
    type: "wedding",
    status: "published",
    templateId: "1",
    rsvp: {
      title: "Summer Wedding",
      subtitle: "Join us on our special day",
      invitation: "We invite you to celebrate with us",
      accept_text: "I'll be there",
      decline_text: "Sorry, can't make it",
    },
    program: [],
    attendees: 0,
    maxAttendees: 100,
    sections: [],
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    description: "Annual technology conference",
    startDate: new Date("2024-09-20"),
    endDate: new Date("2024-09-20"),
    startTime: "09:00",
    endTime: "17:00",
    location: "Tech Hub Center",
    type: "seminar",
    status: "published",
    templateId: "2",
    rsvp: {
      title: "Tech Conference 2024",
      subtitle: "The future of technology",
      invitation: "Join us for an exciting day of innovation",
      accept_text: "Count me in",
      decline_text: "Maybe next time",
    },
    program: [],
    attendees: 0,
    maxAttendees: 500,
    sections: [],
  },
  // Add more dummy events as needed
];

const generateDummyEvents = (): Event[] => {
  const types: EventType[] = ["wedding", "birthday", "seminar"];
  const statuses: EventStatus[] = ["draft", "published", "archived"];
  const locations = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: `event-${i + 1}`,
    title: `Event ${i + 1}`,
    description: `Description for Event ${i + 1}. This is a sample event description.`,
    startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    startTime: "14:00",
    endTime: "14:00",
    location: locations[Math.floor(Math.random() * locations.length)],
    type: types[Math.floor(Math.random() * types.length)],
    templateId: `template-${(i % 5) + 1}`,
    sections: [],
    program: [
      {
        title: "Welcome Session",
        description: "Opening remarks and welcome speech",
        dateTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        speaker: {
          name: "John Doe",
          image: `https://i.pravatar.cc/150?u=${i}`,
          bio: "Event host and coordinator",
        },
        icon: "church",
      },
    ],
    attendees: Math.floor(Math.random() * 100),
    pageBanner: `https://picsum.photos/seed/${i + 1}/400/300`,
    maxAttendees: 200,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rsvp: {
      title: `RSVP for Event ${i + 1}`,
      subtitle: "We'd love to see you there!",
      invitation: "You are cordially invited to join us...",
      accept_text: "Yes, I'll be there",
      decline_text: "Sorry, I can't make it",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      logo: `https://picsum.photos/seed/${i + 1}/100/100`,
    },
  }));
};

export async function getEventData(eventId: string): Promise<Event> {
  // TODO: Replace with actual API call
  return mockEventData;
}

export async function getEvents(): Promise<Event[]> {
  // Simulate API delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return generateDummyEvents();
}
