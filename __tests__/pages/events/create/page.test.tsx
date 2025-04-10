import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CreateEventPage from "@/app/events/create/page";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
  })),
}));

// Mock ResizeObserver
const mockResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.ResizeObserver = mockResizeObserver;

// Mock IntersectionObserver (might be needed by other components, good to keep)
const mockIntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("CreateEventPage", () => {
  const mockPush = vi.fn();
  const mockBack = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    vi.mocked(useRouter).mockImplementation(() => ({
      push: mockPush,
      back: mockBack,
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }));
    mockResizeObserver.mockClear();
    mockIntersectionObserver.mockClear();
  });

  it("renders initial step correctly", () => {
    render(<CreateEventPage />);

    expect(screen.getByRole("heading", { name: /create event/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to events/i })).toBeInTheDocument();
  });

  it("renders and navigates through step 2", async () => {
    render(<CreateEventPage />);

    expect(screen.getByText(/choose your event type/i)).toBeInTheDocument();

    const weddingRadioButton = screen.getByRole("radio", { name: /wedding/i });
    expect(weddingRadioButton).toBeInTheDocument();
    fireEvent.click(weddingRadioButton);

    await act(async () => {
      fireEvent.click(screen.getByTestId("event-type-form-submit"));
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter event title")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter event description")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Enter event location")).toBeInTheDocument();
    });
  });

  it("allows navigation back to previous steps", async () => {
    const { container } = render(<CreateEventPage />);

    // Navigate to Basic Information
    const weddingRadioButton = screen.getByRole("radio", { name: /wedding/i });
    expect(weddingRadioButton).toBeInTheDocument();
    fireEvent.click(weddingRadioButton);
    await act(async () => {
      fireEvent.click(screen.getByTestId("event-type-form-submit"));
    });

    expect(screen.getByPlaceholderText("Enter event title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter event description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter event location")).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(screen.getByText("Back"));
    });
    await waitFor(() => {
      expect(screen.getByText(/choose your event type/i)).toBeInTheDocument();
    });
  });

  it("shows step indicators correctly", () => {
    render(<CreateEventPage />);

    const steps = ["Event Type", "Basic Information", "RSVP Form"];
    steps.forEach((step) => {
      expect(screen.getAllByText(step).length).toBeGreaterThan(0);
    });
  });
});
