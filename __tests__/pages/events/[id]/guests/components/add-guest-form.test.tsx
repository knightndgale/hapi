import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { AddGuestForm } from "@/app/events/[id]/guests/components/add-guest-form";
import { Guest } from "@/types/schema/Guest.schema";
import useDisclosure from "@/hooks/useDisclosure";

// Mock the hooks and modules
vi.mock("@/hooks/useDisclosure");
vi.mock("../../context/event-context", () => ({
  useEvent: () => ({
    state: {
      event: {
        id: "1",
        title: "Test Event",
      },
    },
  }),
}));

vi.mock("../context/guest-list-context", () => ({
  useGuestList: () => ({
    actions: {
      loadGuests: vi.fn(),
    },
  }),
}));

vi.mock("@/requests/guest.request", () => ({
  createGuest: vi.fn(),
  updateGuest: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockUseDisclosure = {
  isOpen: false,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onToggle: vi.fn(),
};

describe("AddGuestForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnGuestCreated = vi.fn();
  const eventId = "test-event-id";

  beforeEach(() => {
    vi.clearAllMocks();
    (useDisclosure as any).mockReturnValue(mockUseDisclosure);
  });

  it("renders form fields correctly", () => {
    render(<AddGuestForm eventId={eventId} onSuccess={mockOnSuccess} guestForm={mockUseDisclosure} onGuestCreated={mockOnGuestCreated} />);

    expect(screen.getByTestId("add-guest-form")).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/attendee type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/seat number/i)).toBeInTheDocument();
  });

  it("submits form with all fields including seat number", async () => {
    const { createGuest } = await import("@/requests/guest.request");
    (createGuest as any).mockResolvedValue({
      success: true,
      data: {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        type: "regular",
        seat_number: "A1",
        token: "test-token",
      },
    });

    render(<AddGuestForm eventId={eventId} onSuccess={mockOnSuccess} guestForm={mockUseDisclosure} onGuestCreated={mockOnGuestCreated} />);

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/seat number/i), {
      target: { value: "A1" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add attendee/i }));

    await waitFor(() => {
      expect(createGuest).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          type: "regular",
          seat_number: "A1",
          status: "published",
          attendance_status: "not_admitted",
        }),
        eventId
      );
    });
  });

  it("updates existing guest with seat number", async () => {
    const { updateGuest } = await import("@/requests/guest.request");
    (updateGuest as any).mockResolvedValue({
      success: true,
      data: {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        type: "regular",
        seat_number: "B2",
      },
    });

    const editGuest: Guest = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      type: "regular",
      response: "pending",
      status: "published",
      attendance_status: "not_admitted",
      seat_number: "A1",
    };

    render(<AddGuestForm eventId={eventId} onSuccess={mockOnSuccess} editGuest={editGuest} guestForm={mockUseDisclosure} onGuestCreated={mockOnGuestCreated} />);

    // Update the seat number
    fireEvent.change(screen.getByLabelText(/seat number/i), {
      target: { value: "B2" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /update attendee/i }));

    await waitFor(() => {
      expect(updateGuest).toHaveBeenCalledWith("1", {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        type: "regular",
        seat_number: "B2",
      });
    });
  });

  it("handles empty seat number", async () => {
    const { createGuest } = await import("@/requests/guest.request");
    (createGuest as any).mockResolvedValue({
      success: true,
      data: {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        type: "regular",
        token: "test-token",
      },
    });

    render(<AddGuestForm eventId={eventId} onSuccess={mockOnSuccess} guestForm={mockUseDisclosure} onGuestCreated={mockOnGuestCreated} />);

    // Fill in the form without seat number
    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add attendee/i }));

    await waitFor(() => {
      expect(createGuest).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          type: "regular",
          seat_number: "",
        }),
        eventId
      );
    });
  });

  it("displays existing seat number when editing guest", () => {
    const editGuest: Guest = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      type: "regular",
      response: "pending",
      status: "published",
      attendance_status: "not_admitted",
      seat_number: "C3",
    };

    render(<AddGuestForm eventId={eventId} onSuccess={mockOnSuccess} editGuest={editGuest} guestForm={mockUseDisclosure} onGuestCreated={mockOnGuestCreated} />);

    expect(screen.getByDisplayValue("C3")).toBeInTheDocument();
  });
});
