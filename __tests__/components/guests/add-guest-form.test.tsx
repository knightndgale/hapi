import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { AddGuestForm } from "@/components/guest/add-guest-form";

describe("AddGuestForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form fields correctly", () => {
    render(<AddGuestForm eventId="1" onSuccess={mockOnSubmit} />);
    expect(screen.getByTestId("add-guest-form")).toBeInTheDocument();
  });

  // TODO testing for form fields
});
