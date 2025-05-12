import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";
import { vi } from "vitest";
import { EventCard } from "@/components/events/event-card";
import { Event } from "@/types/schema/Event.schema";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

describe("EventCard", () => {
  const mockEvent: Event = {
    id: "1",
    title: "Test Event",
    description: "Test Description",
    date: "2024-03-25",
    location: "Test Location",
    type: "wedding",
    time: "10:00",
    status: "published",

    templateId: "1",
    rsvp: {
      title: "Test Event",
      subtitle: "Test Description",
      invitation: "Test Invitation",
      accept_text: "Test Accept Text",
      decline_text: "Test Decline Text",
    },
    program: [
      {
        title: "Test Program",
        description: "Test Description",
        dateTime: "2024-03-25 10:00",
        speaker: {
          name: "Test Speaker",
          image: "Test Image",
          bio: "Test Bio",
        },
      },
    ],
    guests: 10,
    maxAttendees: 20,
    sections: [],
  };

  it("renders event information correctly", () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByTestId("event-card")).toBeInTheDocument();
    expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
    expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
  });
});
