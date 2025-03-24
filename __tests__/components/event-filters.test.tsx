import { render, screen, fireEvent } from "@testing-library/react";
import { EventFilters } from "@/app/dashboard/components/event-filters";

describe("EventFilters", () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it("renders all filter components", () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);

    // Check if all filter components are rendered
    expect(screen.getByPlaceholderText("Event Type")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Status")).toBeInTheDocument();
    expect(screen.getByText("Pick a date range")).toBeInTheDocument();
  });

  it("handles event type filter changes", () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);

    const typeSelect = screen.getByPlaceholderText("Event Type");
    fireEvent.click(typeSelect);

    const conferenceOption = screen.getByText("Conference");
    fireEvent.click(conferenceOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: "conference",
      status: "all",
      dateRange: undefined,
    });
  });

  it("handles status filter changes", () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);

    const statusSelect = screen.getByPlaceholderText("Status");
    fireEvent.click(statusSelect);

    const publishedOption = screen.getByText("Published");
    fireEvent.click(publishedOption);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: "all",
      status: "published",
      dateRange: undefined,
    });
  });

  it("handles date range filter changes", () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);

    const dateRangeButton = screen.getByText("Pick a date range");
    fireEvent.click(dateRangeButton);

    // Note: Testing date range selection is more complex and might require
    // additional setup with react-day-picker. For now, we'll just verify
    // that the calendar is rendered.
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("maintains filter state between changes", () => {
    render(<EventFilters onFilterChange={mockOnFilterChange} />);

    // Set event type
    const typeSelect = screen.getByPlaceholderText("Event Type");
    fireEvent.click(typeSelect);
    fireEvent.click(screen.getByText("Conference"));

    // Set status
    const statusSelect = screen.getByPlaceholderText("Status");
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText("Published"));

    // Verify that both filters are maintained
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: "conference",
      status: "published",
      dateRange: undefined,
    });
  });
});
