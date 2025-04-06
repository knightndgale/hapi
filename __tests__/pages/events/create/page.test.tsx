import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import CreateEventPage from "@/app/events/create/page";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

// Mock form components
vi.mock("@/app/events/components/basic-event-form", () => ({
  BasicEventForm: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <div>
      <h2>Basic Information</h2>
      <button onClick={() => onSubmit({ name: "Test Event" })}>Next</button>
    </div>
  ),
}));

vi.mock("@/app/events/components/event-type-form", () => ({
  EventTypeForm: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <div>
      <h2>Choose Your Event Type</h2>
      <button onClick={() => onSubmit({ type: "wedding" })}>Next</button>
    </div>
  ),
}));

vi.mock("@/app/events/components/rsvp-form", () => ({
  RSVPForm: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <div>
      <h2>RSVP Form</h2>
      <button onClick={() => onSubmit({ title: "Test RSVP" })}>Next</button>
    </div>
  ),
}));

vi.mock("@/app/events/components/event-customization-form", () => ({
  EventCustomizationForm: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <div>
      <h2>Customize</h2>
      <button onClick={() => onSubmit({ sections: [] })}>Create Event</button>
    </div>
  ),
}));

describe("CreateEventPage", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    mockPush.mockClear();
    vi.mocked(useRouter).mockImplementation(() => ({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }));
  });

  it("renders initial step correctly", () => {
    render(<CreateEventPage />);

    expect(screen.getByText("Create Event")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Choose Your Event Type" })).toBeInTheDocument();
    expect(screen.getByText("Back to Events")).toBeInTheDocument();
  });

  it("navigates through all steps", async () => {
    render(<CreateEventPage />);

    // Step 1: Event Type
    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });
    expect(screen.getByRole("heading", { name: "Basic Information" })).toBeInTheDocument();

    // Step 2: Basic Information
    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });
    expect(screen.getByRole("heading", { name: "RSVP Form" })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "RSVP Form" })).toBeInTheDocument();
  });

  it("allows navigation back to previous steps", async () => {
    render(<CreateEventPage />);

    // Navigate to Basic Information
    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });
    expect(screen.getByRole("heading", { name: "Basic Information" })).toBeInTheDocument();

    // Go back to Event Type
    await act(async () => {
      fireEvent.click(screen.getByText("Back"));
    });
    expect(screen.getByRole("heading", { name: "Choose Your Event Type" })).toBeInTheDocument();
  });

  it("shows step indicators correctly", () => {
    render(<CreateEventPage />);

    const steps = ["Event Type", "Basic Information", "RSVP Form"];
    steps.forEach((step) => {
      expect(screen.getAllByText(step).length).toBeGreaterThan(0);
    });
  });
});
