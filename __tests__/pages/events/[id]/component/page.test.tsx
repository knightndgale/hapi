import { prettyDOM, render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EventView from "@/app/events/[id]/components/EventView";
import { dummyEvent } from "@/constants/dummyData";
import { EventProvider } from "@/app/events/[id]/context/event-context";

// Mock the useRouter hook
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, role, ...props }: { src: string; alt: string; role?: string; [key: string]: any }) => <img src={src} alt={alt} role={role} data-testid={`mock-image-${alt}`} {...props} />,
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock loadEvent function
const mockLoadEvent = vi.fn().mockResolvedValue({
  success: true,
  data: dummyEvent,
});

describe("EventPage", async () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  it("renders the event banner, title, and description", async () => {
    render(
      <EventProvider eventId={dummyEvent.id.toString()} loadEvent={mockLoadEvent}>
        <EventView />
      </EventProvider>
    );

    await waitFor(() => {
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveAttribute("src", dummyEvent.pageBanner);

      const title = screen.getByText(dummyEvent.title);
      expect(title).toBeInTheDocument();
      const description = screen.getByText(dummyEvent.description);
      expect(description).toBeInTheDocument();
    });

    expect(mockLoadEvent).toHaveBeenCalledWith(dummyEvent.id.toString());
  });

  it("renders the event details card", async () => {
    render(
      <EventProvider eventId={dummyEvent.id.toString()} loadEvent={mockLoadEvent}>
        <EventView />
      </EventProvider>
    );

    await waitFor(() => {
      const detailsCard = screen.getByTestId("event-details-card");
      expect(detailsCard).toBeInTheDocument();
    });

    expect(mockLoadEvent).toHaveBeenCalledWith(dummyEvent.id.toString());
  });

  it("handles loading state", async () => {
    mockLoadEvent.mockImplementationOnce(() => new Promise(() => {})); // Never resolves
    render(
      <EventProvider eventId={dummyEvent.id.toString()} loadEvent={mockLoadEvent}>
        <EventView />
      </EventProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    mockLoadEvent.mockRejectedValueOnce(new Error("Failed to load event"));
    render(
      <EventProvider eventId={dummyEvent.id.toString()} loadEvent={mockLoadEvent}>
        <EventView />
      </EventProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
