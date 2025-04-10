import { prettyDOM, render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EventPage, { dummyEvent } from "@/app/events/[id]/page";
import { format } from "date-fns";
import EventView from "@/app/events/[id]/component/EventView";

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

describe("EventPage", async () => {
  const mockParams = Promise.resolve({ id: dummyEvent.id });

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockIntersectionObserver.mockClear();
  });

  it("renders the event banner, title, and description", async () => {
    render(<EventView event={dummyEvent} id={Number(dummyEvent.id)} />);

    await waitFor(() => {
      const banner = screen.getByRole("banner");
      expect(banner).toBeInTheDocument();
      expect(banner).toHaveAttribute("src", dummyEvent.pageBanner);

      const title = screen.getByText(dummyEvent.title);
      expect(title).toBeInTheDocument();
      const description = screen.getByText(dummyEvent.description);
      expect(description).toBeInTheDocument();
    });
  });

  it("renders the event details card", async () => {
    render(<EventView event={dummyEvent} id={Number(dummyEvent.id)} />);

    await waitFor(() => {
      const detailsCard = screen.getByText("Event Details").closest('div[class*="rounded-lg border"]') as HTMLElement;
      expect(detailsCard).toBeInTheDocument();

      if (!detailsCard) throw new Error("Details card not found");

      expect(within(detailsCard).getByText(format(dummyEvent.startDate, "MMMM d, yyyy"))).toBeInTheDocument();
      expect(within(detailsCard).getByText(format(new Date(`2000-01-01T${dummyEvent.startTime}`), "h:mm a"))).toBeInTheDocument();
      expect(within(detailsCard).getByText(dummyEvent.location)).toBeInTheDocument();
      expect(within(detailsCard).getByText(`${dummyEvent.attendees} / ${dummyEvent.maxAttendees} Guests`)).toBeInTheDocument();
    });
  });
});
