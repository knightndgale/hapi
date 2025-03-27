import { render, screen, fireEvent, act, prettyDOM } from "@testing-library/react";
import { vi } from "vitest";
import { EventTypeForm } from "@/app/events/components/event-type-form";
import { EventType } from "@/types/schema/Event.schema";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

describe("EventTypeForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all event types", () => {
    render(<EventTypeForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("Birthday")).toBeInTheDocument();
    expect(screen.getByText("Seminar")).toBeInTheDocument();
  });

  // it("submits form with selected event type", async () => {
  //   const { container } = render(<EventTypeForm onSubmit={mockOnSubmit} />);
  //   console.log(prettyDOM(container));

  //   await act(async () => {
  //     // Select Meeting event type
  //     fireEvent.click(screen.getByText("Wedding"));
  //     // Submit form
  //     fireEvent.click(screen.getByText("Next"));
  //   });

  //   expect(mockOnSubmit).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       type: "Wedding",
  //     })
  //   );
  // });

  it("shows validation error when no event type is selected", async () => {
    render(<EventTypeForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });

    expect(screen.getByText("Please select an event type")).toBeInTheDocument();
  });

  // TODO: Implement this test
  // it("allows changing selected event type", async () => {
  //   render(<EventTypeForm onSubmit={mockOnSubmit} />);

  //   await act(async () => {
  //     // Select Party
  //     fireEvent.click(screen.getByTestId("wedding"));
  //     expect(screen.getByTestId("wedding")).toBeChecked();

  //     // Change to Conference
  //     fireEvent.click(screen.getByTestId("birthday"));
  //     expect(screen.getByTestId("birthday")).toBeChecked();
  //   });
  // });

  it("displays event type descriptions", () => {
    render(<EventTypeForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText(/Perfect for celebrating love and commitment/i)).toBeInTheDocument();
    expect(screen.getByText(/Celebrate special moments and milestones/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional events for learning and networking/i)).toBeInTheDocument();
  });
});
