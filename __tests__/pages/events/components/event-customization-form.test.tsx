import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { EventCustomizationForm } from "@/app/events/components/event-customization-form";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock react-beautiful-dnd
vi.mock("react-beautiful-dnd", () => ({
  DragDropContext: ({ children }: any) => <div data-testid="drag-context">{children}</div>,
  Droppable: ({ children }: any) =>
    children({
      droppableProps: {
        "data-testid": "droppable",
      },
      innerRef: () => {},
      placeholder: null,
    }),
  Draggable: ({ children }: any) =>
    children(
      {
        draggableProps: {
          "data-testid": "draggable",
          style: {},
        },
        dragHandleProps: {
          "data-testid": "drag-handle",
        },
        innerRef: () => {},
      },
      {
        isDragging: false,
        isDropAnimating: false,
      }
    ),
}));

// Mock ImageUpload component
vi.mock("@/components/ui/image-upload", () => ({
  ImageUpload: ({ onChange }: { onChange: (url: string) => void }) => (
    <div>
      <button onClick={() => onChange("test-image-url")}>Upload Image</button>
      <span>Upload successful</span>
    </div>
  ),
}));

describe("EventCustomizationForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders initial form state", () => {
    render(<EventCustomizationForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Background Image")).toBeInTheDocument();
    expect(screen.getByText("Page Sections")).toBeInTheDocument();
    expect(screen.getByText("Add Content Section")).toBeInTheDocument();
    expect(screen.getByText("Add Image Section")).toBeInTheDocument();
  });

  it("adds content section", async () => {
    render(<EventCustomizationForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Add Content Section"));
    });

    expect(screen.getByText("Content Section")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter section title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter section description")).toBeInTheDocument();
  });

  it("adds image section", async () => {
    render(<EventCustomizationForm onSubmit={mockOnSubmit} />);

    await act(async () => {
      fireEvent.click(screen.getByText("Add Image Section"));
    });

    expect(screen.getByText("Image Section")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter section title")).toBeInTheDocument();
    expect(screen.getByTestId("upload-image")).toBeInTheDocument();
  });

  it("removes section", async () => {
    render(<EventCustomizationForm onSubmit={mockOnSubmit} />);

    // Add a section first
    await act(async () => {
      fireEvent.click(screen.getByText("Add Content Section"));
    });

    expect(screen.getByText("Content Section")).toBeInTheDocument();

    // Remove the section
    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-section"));
    });

    expect(screen.queryByText("Content Section")).not.toBeInTheDocument();
  });

  it("renders with default values", () => {
    const defaultValues = {
      backgroundImage: "default-bg.jpg",
      sections: [
        {
          id: "1",
          type: "content" as const,
          title: "Default Section",
          description: "Default Description",
        },
      ],
    };

    render(<EventCustomizationForm onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByDisplayValue("Default Section")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Default Description")).toBeInTheDocument();
  });
});
