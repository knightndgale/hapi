import { render, screen, waitFor } from "@testing-library/react";
import { DashboardContent } from "@/app/dashboard/components/dashboard-content";
import { DashboardProvider } from "@/app/dashboard/context/dashboard-context";
import { vi } from "vitest";

// Mock the router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the event request
vi.mock("@/requests/event.request", () => ({
  getMyEvents: vi.fn(),
}));

describe("DashboardContent", () => {
  const mockPush = vi.fn();
  const mockGetMyEvents = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Re-mock the router with fresh function
    vi.mocked(require("next/navigation").useRouter).mockReturnValue({
      push: mockPush,
    });
    // Re-mock the event request with fresh function
    vi.mocked(require("@/requests/event.request").getMyEvents).mockImplementation(mockGetMyEvents);
  });

  const renderWithProvider = (children: React.ReactNode) => {
    return render(<DashboardProvider loadEvents={mockGetMyEvents}>{children}</DashboardProvider>);
  };

  it("should show loading state initially", () => {
    mockGetMyEvents.mockResolvedValue({ success: true, data: [] });

    renderWithProvider(<DashboardContent />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should show error state when API fails", async () => {
    mockGetMyEvents.mockResolvedValue({
      success: false,
      message: "Failed to fetch events",
    });

    renderWithProvider(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to fetch events")).toBeInTheDocument();
    });
  });

  it("should show empty state when no events", async () => {
    mockGetMyEvents.mockResolvedValue({ success: true, data: [] });

    renderWithProvider(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("No events found")).toBeInTheDocument();
    });
  });

  it("should render events in grid view", async () => {
    const mockEvents = [
      {
        id: "1",
        title: "Test Event",
        description: "Test Description",
        location: "Test Location",
        startDate: "2024-01-01",
        endDate: "2024-01-01",
        startTime: "10:00",
        endTime: "11:00",
        type: "wedding",
        status: "published",
        maxAttendees: 100,
        guests: [],
        pageBanner: null,
        rsvp: null,
        sections: [],
        programs: [],
        date_created: "2024-01-01",
        date_updated: "2024-01-01",
        user_created: "1",
        user_updated: "1",
      },
    ];

    mockGetMyEvents.mockResolvedValue({ success: true, data: mockEvents });

    renderWithProvider(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Test Event")).toBeInTheDocument();
    });
  });

  it("should handle null/undefined event properties safely", async () => {
    const mockEvents = [
      {
        id: "1",
        title: null,
        description: null,
        location: null,
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        type: "wedding",
        status: "published",
        maxAttendees: null,
        guests: null,
        pageBanner: null,
        rsvp: null,
        sections: [],
        programs: [],
        date_created: "2024-01-01",
        date_updated: "2024-01-01",
        user_created: "1",
        user_updated: "1",
      },
    ];

    mockGetMyEvents.mockResolvedValue({ success: true, data: mockEvents });

    renderWithProvider(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Date TBD")).toBeInTheDocument();
      expect(screen.getByText("Location TBD")).toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    mockGetMyEvents.mockRejectedValue(new Error("Network error"));

    renderWithProvider(<DashboardContent />);

    await waitFor(() => {
      expect(screen.getByText("Error: Network error")).toBeInTheDocument();
    });
  });
});
