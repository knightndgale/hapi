import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { GuestList } from "@/components/guests/guest-list";

describe("GuestList", () => {
  const mockGuests = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      status: "pending",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "0987654321",
      status: "accepted",
    },
  ];

  const mockOnDelete = vi.fn();
  const mockOnStatusChange = vi.fn();

  it("renders guest list correctly", () => {
    render(<GuestList eventId="1" />);
    expect(screen.getByTestId("guest-list")).toBeInTheDocument();
  });

  // TODO handle deletion
  // TODO handle status change
  // TODO handle QR code generation
  // TODO handle guest list data showing
});
