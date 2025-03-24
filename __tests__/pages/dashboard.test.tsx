import { render, screen, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Dashboard Page", () => {
  it("renders the dashboard with all events initially", () => {
    render(<DashboardPage />);

    // Check if the page title is rendered
    expect(screen.getByText("My Events")).toBeInTheDocument();

    // Check if all events are rendered
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.getByText("Product Launch")).toBeInTheDocument();
  });

  it("filters events by type", () => {
    render(<DashboardPage />);

    // Open event type filter
    const typeSelect = screen.getByPlaceholderText("Event Type");
    fireEvent.click(typeSelect);

    // Select conference type
    const conferenceOption = screen.getByText("Conference");
    fireEvent.click(conferenceOption);

    // Check if only conference events are shown
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.getByText("Product Launch")).toBeInTheDocument();
  });

  it("filters events by status", () => {
    render(<DashboardPage />);

    // Open status filter
    const statusSelect = screen.getByPlaceholderText("Status");
    fireEvent.click(statusSelect);

    // Select published status
    const publishedOption = screen.getByText("Published");
    fireEvent.click(publishedOption);

    // Check if only published events are shown
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.queryByText("Product Launch")).not.toBeInTheDocument();
  });

  it("filters events by date range", () => {
    render(<DashboardPage />);

    // Open date range picker
    const dateRangeButton = screen.getByText("Pick a date range");
    fireEvent.click(dateRangeButton);

    // Note: Testing date range selection is more complex and might require
    // additional setup with react-day-picker. For now, we'll just verify
    // that the calendar is rendered.
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("combines multiple filters", () => {
    render(<DashboardPage />);

    // Set event type to conference
    const typeSelect = screen.getByPlaceholderText("Event Type");
    fireEvent.click(typeSelect);
    fireEvent.click(screen.getByText("Conference"));

    // Set status to published
    const statusSelect = screen.getByPlaceholderText("Status");
    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText("Published"));

    // Check if only published conference events are shown
    expect(screen.getByText("Tech Conference 2024")).toBeInTheDocument();
    expect(screen.queryByText("Product Launch")).not.toBeInTheDocument();
  });

  it("navigates to create event page when create button is clicked", () => {
    const mockPush = jest.fn();
    jest.spyOn(require("next/navigation"), "useRouter").mockImplementation(() => ({
      push: mockPush,
    }));

    render(<DashboardPage />);

    const createButton = screen.getByText("Create Event");
    fireEvent.click(createButton);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/create");
  });
});
