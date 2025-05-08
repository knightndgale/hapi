import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { InvitationDataFetcher } from "@/app/invite/components/invitation-data-fetcher";
import { InviteProvider } from "@/app/invite/context/invite-context";
import { Event } from "@/types/schema/Event.schema";

// Mock data
const mockEventData: Event = {
  id: "test-event-1",
  title: "Test Wedding",
  description: "A beautiful test wedding",
  location: "Test Location",
  type: "wedding" as const,
  templateId: "template-1",
  startDate: new Date("2024-06-15"),
  endDate: new Date("2024-06-15"),
  startTime: "14:00:00",
  endTime: "16:00:00",
  sections: [],
  program: [
    {
      title: "Welcome",
      description: "Welcome ceremony",
      dateTime: "2024-06-15T14:00:00Z",
      icon: "church",
      speaker: {
        name: "Host",
        bio: "Event Host",
        image: "",
      },
    },
  ],
  attendees: [],
  maxAttendees: 100,
  rsvp: {
    title: "Together With Their Families",
    subtitle: "Test subtitle",
    invitation: "Test invitation",
    accept_text: "Accept",
    decline_text: "Decline",
    deadline: "2025-05-15",
  },
  status: "published",
};

const mockGuestData = {
  id: "test-guest-1",
  firstName: "John",
  lastName: "Doe",
  guestType: "regular" as const,
};

// Mock server actions
const mockActions = {
  getEventData: vi.fn(),
  getGuestData: vi.fn(),
  submitRSVP: vi.fn(),
};

// Wrapper component to provide context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <InviteProvider actions={mockActions}>{children}</InviteProvider>;
}

describe("InvitationDataFetcher", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    mockActions.getEventData.mockResolvedValue(mockEventData);
    mockActions.getGuestData.mockResolvedValue(mockGuestData);
  });

  it("renders loading state initially", () => {
    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    const loadingElement = screen.getByRole("status");
    expect(loadingElement).toBeInTheDocument();
  });

  it("renders event and guest data correctly after loading", async () => {
    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Check if all the data is rendered correctly
    expect(screen.getByTestId("test-greetings")).toBeInTheDocument();
    expect(screen.getByTestId("test-title")).toBeInTheDocument();
    expect(screen.getByTestId("test-date")).toBeInTheDocument();
    expect(screen.getByTestId("test-time")).toBeInTheDocument();
    expect(screen.getByTestId("test-location")).toBeInTheDocument();
  });

  it("handles different guest types correctly", async () => {
    const sponsorGuestData = {
      ...mockGuestData,
      guestType: "sponsor" as const,
    };
    mockActions.getGuestData.mockResolvedValueOnce(sponsorGuestData);

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Should show phone number field for sponsor
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("displays RSVP deadline correctly", async () => {
    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Check if deadline is displayed
    expect(screen.getByText(/RSVP Deadline/i)).toBeInTheDocument();
    expect(screen.getByText(/May 15, 2025/i)).toBeInTheDocument();
  });

  it("handles different event types correctly", async () => {
    const birthdayEventData = {
      ...mockEventData,
      type: "birthday" as const,
    };
    mockActions.getEventData.mockResolvedValueOnce(birthdayEventData);

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Should not show photo upload for birthday events
    expect(screen.queryByText(/upload photos/i)).not.toBeInTheDocument();
  });

  it("handles error state correctly", async () => {
    mockActions.getEventData.mockRejectedValueOnce(new Error("Failed to fetch event"));

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Should show error message
    expect(screen.getByText(/Error: Failed to fetch event/i)).toBeInTheDocument();
  });

  it("shows error UI with message when event data fetch fails", async () => {
    const errorMessage = "Failed to fetch event data";
    mockActions.getEventData.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Verify error UI elements
    expect(screen.getByText("Unable to Load Invitation")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText("We're having trouble loading your invitation details.")).toBeInTheDocument();
    expect(screen.getByText("Please try refreshing the page or contact the event organizer.")).toBeInTheDocument();
  });

  it("shows error UI with message when guest data fetch fails", async () => {
    const errorMessage = "Failed to fetch guest data";
    mockActions.getGuestData.mockRejectedValueOnce(new Error(errorMessage));

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Unable to Load Invitation")).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it("shows no data UI when data is null", async () => {
    mockActions.getEventData.mockResolvedValueOnce(null);
    mockActions.getGuestData.mockResolvedValueOnce(null);

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getByText("No Invitation Found")).toBeInTheDocument();
    expect(screen.getByText("We couldn't find the invitation details you're looking for.")).toBeInTheDocument();
  });

  it("maintains error UI structure within page layout", async () => {
    mockActions.getEventData.mockRejectedValueOnce(new Error("Test error"));

    render(
      <TestWrapper>
        <InvitationDataFetcher eventId="test-event-1" guestId="test-guest-1" />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Verify the error is contained within the proper layout structure
    const container = screen.getByRole("alert").closest(".container");
    expect(container).toHaveClass("mx-auto");

    // Verify the error message is properly styled
    const errorContainer = screen.getByRole("alert");
    expect(errorContainer).toHaveClass("text-center");
  });
});
