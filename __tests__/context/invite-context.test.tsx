import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { InviteProvider, useInviteContext } from "@/app/invite/context/invite-context";

// Mock server actions
const mockActions = {
  getEventData: vi.fn(),
  getGuestData: vi.fn(),
  submitRSVP: vi.fn(),
};

// Test component that uses the context
function TestComponent() {
  const context = useInviteContext();
  return (
    <div>
      <div data-testid="context-available">{context ? "Context Available" : "No Context"}</div>
      <button
        onClick={() =>
          context.submitRSVP({
            eventId: "test",
            guestId: "test",
            response: "accept",
          })
        }>
        Submit RSVP
      </button>
    </div>
  );
}

describe("InviteContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides context to children", () => {
    render(
      <InviteProvider actions={mockActions}>
        <TestComponent />
      </InviteProvider>
    );

    expect(screen.getByTestId("context-available")).toHaveTextContent("Context Available");
  });

  it("throws error when context is used outside provider", () => {
    // Suppress console.error for this test
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useInviteContext must be used within an InviteProvider");

    // Restore console.error
    console.error = consoleError;
  });

  it("provides working server actions", async () => {
    mockActions.submitRSVP.mockResolvedValueOnce({ success: true });

    render(
      <InviteProvider actions={mockActions}>
        <TestComponent />
      </InviteProvider>
    );

    const button = screen.getByText("Submit RSVP");
    await act(async () => {
      button.click();
    });

    expect(mockActions.submitRSVP).toHaveBeenCalledWith({
      eventId: "test",
      guestId: "test",
      response: "accept",
    });
  });

  it("handles different action implementations", async () => {
    const customActions = {
      ...mockActions,
      submitRSVP: vi.fn().mockResolvedValue({ success: false }),
    };

    render(
      <InviteProvider actions={customActions}>
        <TestComponent />
      </InviteProvider>
    );

    const button = screen.getByText("Submit RSVP");
    await act(async () => {
      button.click();
    });

    expect(customActions.submitRSVP).toHaveBeenCalled();
  });
});
