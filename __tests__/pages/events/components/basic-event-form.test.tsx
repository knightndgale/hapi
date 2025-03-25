import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { BasicEventForm } from "@/app/events/components/basic-event-form";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

describe("BasicEventForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders all form fields", () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/event name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end time/i)).toBeInTheDocument();
  });

  // it("submits form with valid data", async () => {
  //   render(<BasicEventForm onSubmit={mockOnSubmit} />);

  //   await act(async () => {
  //     fireEvent.change(screen.getByLabelText(/event name/i), {
  //       target: { value: "Test Event" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/description/i), {
  //       target: { value: "Test Description" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/location/i), {
  //       target: { value: "Test Location" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/start time/i), {
  //       target: { value: "09:00" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/end time/i), {
  //       target: { value: "17:00" },
  //     });

  //     // Submit form
  //     fireEvent.click(screen.getByText("Next"));
  //   });

  //   expect(mockOnSubmit).toHaveBeenCalledWith(
  //     expect.objectContaining({
  //       name: "Test Event",
  //       description: "Test Description",
  //       location: "Test Location",
  //       startTime: "09:00",
  //       endTime: "17:00",
  //       program: [],
  //     })
  //   );
  // });

  it("shows validation errors for required fields", async () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });

    expect(screen.getByText("Event name is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Location is required")).toBeInTheDocument();
  });

  it("allows adding and removing program items", async () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} />);

    // Add program item
    await act(async () => {
      fireEvent.click(screen.getByText("Add Program Item"));
    });

    // Fill out program item fields
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter program item title/i), {
        target: { value: "Test Program" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter program item description/i), {
        target: { value: "Test Program Description" },
      });
      fireEvent.change(screen.getByLabelText(/date and time/i), {
        target: { value: "2024-03-24T10:00" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter speaker name/i), {
        target: { value: "Test Speaker" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter speaker bio/i), {
        target: { value: "Test Speaker Bio" },
      });
    });

    // Remove program item
    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-program-item"));
    });

    expect(screen.queryByText("Program Item 1")).not.toBeInTheDocument();
  });

  it("renders with default values", () => {
    const defaultValues = {
      name: "Default Event",
      description: "Default Description",
      location: "Default Location",
      startTime: "10:00",
      endTime: "18:00",
      program: [],
    };

    render(<BasicEventForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/event name/i)).toHaveValue("Default Event");
    expect(screen.getByLabelText(/description/i)).toHaveValue("Default Description");
    expect(screen.getByLabelText(/location/i)).toHaveValue("Default Location");
    expect(screen.getByLabelText(/start time/i)).toHaveValue("10:00");
    expect(screen.getByLabelText(/end time/i)).toHaveValue("18:00");
  });
});
