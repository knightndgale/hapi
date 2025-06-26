import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { DashboardProvider, useDashboard } from "@/app/dashboard/context/dashboard-context";
import { Event } from "@/types/schema/Event.schema";

// Mock the event request functions
vi.mock("@/requests/event.request", () => ({
  getMyEvents: vi.fn(),
  getTotalGuestCount: vi.fn(),
}));

// Import the mocked functions
import { getMyEvents, getTotalGuestCount } from "@/requests/event.request";

// Mock component to test the context
function TestComponent() {
  const { state, filteredEvents } = useDashboard();

  return (
    <div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="error">{state.error || "no-error"}</div>
      <div data-testid="events-count">{filteredEvents.length}</div>
      {filteredEvents.map((event, index) => (
        <div key={event.id} data-testid={`event-${index}`}>
          <span data-testid={`event-${index}-title`}>{event.title}</span>
          <span data-testid={`event-${index}-guest-count`}>{event.guest_count}</span>
        </div>
      ))}
    </div>
  );
}

describe("DashboardContext", () => {
  const mockGetMyEvents = vi.mocked(getMyEvents);
  const mockGetTotalGuestCount = vi.mocked(getTotalGuestCount);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load events with guest counts", async () => {
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Test Event 1",
        description: "Test Description 1",
        location: "Test Location 1",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-01"),
        startTime: "10:00",
        endTime: "12:00",
        type: "wedding",
        templateId: "template1",
        guests: [],
        maxAttendees: 100,
        guest_count: 0,
        status: "published",
        sections: [],
        programs: [],
        created_by: "user1",
      },
      {
        id: "2",
        title: "Test Event 2",
        description: "Test Description 2",
        location: "Test Location 2",
        startDate: new Date("2024-01-02"),
        endDate: new Date("2024-01-02"),
        startTime: "14:00",
        endTime: "16:00",
        type: "birthday",
        templateId: "template2",
        guests: [],
        maxAttendees: 50,
        guest_count: 0,
        status: "published",
        sections: [],
        programs: [],
        created_by: "user1",
      },
    ];

    mockGetMyEvents.mockResolvedValue({
      success: true,
      data: mockEvents,
    });

    mockGetTotalGuestCount.mockResolvedValueOnce({ success: true, data: 25 }).mockResolvedValueOnce({ success: true, data: 15 });

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    // Check loading state
    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    // Wait for events to load
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Check that events are loaded with guest counts
    expect(screen.getByTestId("events-count")).toHaveTextContent("2");
    expect(screen.getByTestId("event-0-title")).toHaveTextContent("Test Event 1");
    expect(screen.getByTestId("event-0-guest-count")).toHaveTextContent("25");
    expect(screen.getByTestId("event-1-title")).toHaveTextContent("Test Event 2");
    expect(screen.getByTestId("event-1-guest-count")).toHaveTextContent("15");

    // Verify that getTotalGuestCount was called for each event
    expect(mockGetTotalGuestCount).toHaveBeenCalledTimes(2);
    expect(mockGetTotalGuestCount).toHaveBeenCalledWith("1");
    expect(mockGetTotalGuestCount).toHaveBeenCalledWith("2");
  });

  it("should handle guest count fetch errors gracefully", async () => {
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Test Event",
        description: "Test Description",
        location: "Test Location",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-01"),
        startTime: "10:00",
        endTime: "12:00",
        type: "wedding",
        templateId: "template1",
        guests: [],
        maxAttendees: 100,
        guest_count: 0,
        status: "published",
        sections: [],
        programs: [],
        created_by: "user1",
      },
    ];

    mockGetMyEvents.mockResolvedValue({
      success: true,
      data: mockEvents,
    });

    mockGetTotalGuestCount.mockResolvedValue({
      success: false,
      message: "Failed to fetch guest count",
    });

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Should still load the event with guest_count as 0
    expect(screen.getByTestId("events-count")).toHaveTextContent("1");
    expect(screen.getByTestId("event-0-guest-count")).toHaveTextContent("0");
  });

  it("should handle events fetch error", async () => {
    mockGetMyEvents.mockResolvedValue({
      success: false,
      message: "Failed to fetch events",
    });

    render(
      <DashboardProvider>
        <TestComponent />
      </DashboardProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("error")).toHaveTextContent("Failed to fetch events");
    expect(screen.getByTestId("events-count")).toHaveTextContent("0");
  });
});
