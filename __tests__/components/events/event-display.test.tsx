import { render, screen, fireEvent, prettyDOM } from "@testing-library/react";
import { vi } from "vitest";
import { EventDisplay } from "@/components/events/event-display";
import { Event } from "@/types/schema/Event.schema";

describe("EventDisplay", () => {
  const mockEvent: Event = {
    id: "1",
    title: "Test Event",
    description: "Test Description",
    date: "2024-03-25",
    location: "Test Location",
    type: "wedding",
    program: [
      {
        title: "Program Item",
        description: "Program Description",
        dateTime: "2024-03-25T10:00",
        speaker: {
          name: "Test Speaker",
          image: "Test Image",
          bio: "Test Bio",
        },
      },
    ],
    time: "10:00",
    templateId: "1",
    status: "published",
    attendees: 10,
    maxAttendees: 20,
  };

  it("renders event details correctly", () => {
    render(<EventDisplay id={mockEvent.id} />);

    expect(screen.getByTestId("event-page")).toBeInTheDocument();
  });
  // TODO program items
  // TODO mocking of data for event display
});
