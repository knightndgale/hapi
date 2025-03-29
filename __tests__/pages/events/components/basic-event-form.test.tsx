import { render, screen, fireEvent, waitFor, act, prettyDOM } from "@testing-library/react";
import { vi } from "vitest";
import { BasicEventForm } from "@/app/events/components/basic-event-form";
import { format } from "date-fns";
import { Event } from "@/types/schema/Event.schema";
// Mock the format function from date-fns
vi.mock("date-fns", async () => {
  const actual = await vi.importActual("date-fns");
  return {
    ...actual,
    format: vi.fn((date: Date, format: string) => {
      if (format === "PPP") return "March 1, 2024";
      if (format === "h:mm a") return "2:00 PM";
      if (format === "EEEE, MMMM d, yyyy") return "Friday, March 1, 2024";
      if (format === "HH:mm") return "14:00";
      return date.toLocaleString();
    }),
  };
});

describe("BasicEventForm", () => {
  const mockOnSubmit = vi.fn();
  const defaultValues: Event = {
    id: "123",
    title: "Test Event",
    description: "Test Description",
    location: "Test Location",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-01"),
    startTime: "09:00",
    endTime: "17:00",
    program: [],
    type: "wedding",
    templateId: "123",
    attendees: 100,
    maxAttendees: 100,
    status: "draft",
    backgroundImage: "https://example.com/image.jpg",
    pageBanner: "https://example.com/image.jpg",
    sections: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when no program items exist", () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);
    expect(screen.getByText(/no program items added yet/i)).toBeInTheDocument();
  });

  it("opens program item modal when add button is clicked", async () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    await act(async () => {
      fireEvent.click(screen.getByTestId("add-program-item"));
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("add-program-item")).toBeInTheDocument();
  });

  it("removes program item when delete button is clicked", async () => {
    const programItem = {
      title: "Test Program",
      description: "Test Description",
      dateTime: "2024-03-01T14:00",
      speaker: {
        name: "John Doe",
        bio: "Speaker Bio",
        image: "https://example.com/image.jpg",
      },
    };

    render(
      <BasicEventForm
        onSubmit={mockOnSubmit}
        defaultValues={{
          ...defaultValues,
          program: [programItem],
        }}
      />
    );

    // Verify program item is displayed
    expect(screen.getByText("Test Program")).toBeInTheDocument();

    // Click delete button
    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-program-item"));
    });

    // Verify program item is removed
    await waitFor(() => {
      expect(screen.queryByText("Test Program")).not.toBeInTheDocument();
      expect(screen.getByText(/no program items added yet/i)).toBeInTheDocument();
    });
  });

  it("adds program item through modal", async () => {
    render(<BasicEventForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    // Open modal
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /add item/i }));
    });

    // Fill out program item form
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter program item title/i), {
        target: { value: "Test Program" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter program item description/i), {
        target: { value: "Test Description" },
      });
      fireEvent.change(screen.getByLabelText(/date and time/i), {
        target: { value: "2024-03-01T14:00" },
      });

      // Add optional speaker details
      fireEvent.change(screen.getByPlaceholderText(/enter speaker name/i), {
        target: { value: "John Doe" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter speaker bio/i), {
        target: { value: "Speaker Bio" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter speaker image url/i), {
        target: { value: "https://example.com/image.jpg" },
      });

      // Submit form
      fireEvent.click(screen.getByRole("button", { name: /add program item/i }));
    });

    expect(screen.getByTestId("program-title")).toHaveTextContent("Test Program");
    expect(screen.getByTestId("program-date-time")).toHaveTextContent("2:00 PM");
    expect(screen.getByTestId("program-date")).toHaveTextContent("Friday, March 1, 2024");
    expect(screen.getByTestId("program-description")).toHaveTextContent("Test Description");
    expect(screen.getByTestId("program-speaker-name")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("program-speaker-bio")).toHaveTextContent("Speaker Bio");
    expect(screen.getByTestId("program-speaker-image")).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("shows validation errors for empty required fields", async () => {
    const { container } = render(<BasicEventForm onSubmit={mockOnSubmit} defaultValues={{ ...defaultValues, title: "", description: "", location: "" }} />);
    // Submit form without filling required fields
    await act(async () => {
      fireEvent.change(screen.getByTestId("event-title"), {
        target: { value: undefined },
      });
      fireEvent.change(screen.getByTestId("description"), {
        target: { value: undefined },
      });

      fireEvent.change(screen.getByTestId("location"), {
        target: { value: undefined },
      });
      fireEvent.click(screen.getByRole("button", { name: /next/i }));
    });

    console.log(prettyDOM(container));
    // Check for validation error messages based on schema

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByText("Location is required")).toBeInTheDocument();

    // Check that onSubmit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // it("submits form with program items", async () => {
  //   const rendered = render(<BasicEventForm onSubmit={mockOnSubmit} />);

  //   // Add program item
  //   await act(async () => {
  //     fireEvent.click(screen.getByRole("button", { name: /add item/i }));
  //   });

  //   await act(async () => {
  //     fireEvent.change(screen.getByPlaceholderText(/enter program item title/i), {
  //       target: { value: "Test Program" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText(/enter program item description/i), {
  //       target: { value: "Test Description" },
  //     });
  //     fireEvent.change(screen.getByLabelText(/date and time/i), {
  //       target: { value: "2024-03-01T14:00" },
  //     });
  //     fireEvent.click(screen.getByRole("button", { name: /add program item/i }));
  //   });

  //   // Fill required form fields
  //   await act(async () => {
  //     console.log(prettyDOM(rendered.container));
  //     fireEvent.change(screen.getByTestId("event-name"), {
  //       target: { value: "Test Event" },
  //     });
  //     fireEvent.change(screen.getByTestId("description"), {
  //       target: { value: "Test Description" },
  //     });
  //     fireEvent.change(screen.getByTestId("location"), {
  //       target: { value: "Test Location" },
  //     });

  //     // Submit form
  //     fireEvent.click(screen.getByRole("button", { name: /next/i }));
  //   });

  //   await waitFor(() => {
  //     expect(mockOnSubmit).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         name: "Test Event",
  //         description: "Test Description",
  //         location: "Test Location",
  //         program: [
  //           expect.objectContaining({
  //             title: "Test Program",
  //             description: "Test Description",
  //             dateTime: "2024-03-01T14:00",
  //           }),
  //         ],
  //       })
  //     );
  //   });
  // });
});
