import { render, screen, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttendanceProvider, useAttendance } from "@/app/events/[id]/guests/context/attendance-context";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the actions
vi.mock("@/actions/guest.action", () => ({
  getGuestsForAttendance: vi.fn(),
  updateGuestAttendanceStatus: vi.fn(),
  getGuestByToken: vi.fn(),
}));

const mockGuest: Guest = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  response: "accepted",
  type: "regular",
  status: "published",
  attendance_status: "not_admitted",
};

const mockGuests = [mockGuest];

// Test component to access context
function TestComponent() {
  const { state, actions, filteredGuests, totalPages } = useAttendance();

  return (
    <div>
      <div data-testid="loading">{state.loading.toString()}</div>
      <div data-testid="error">{state.error || "no-error"}</div>
      <div data-testid="search">{state.search}</div>
      <div data-testid="current-page">{state.currentPage}</div>
      <div data-testid="page-size">{state.pageSize}</div>
      <div data-testid="attendance-filter">{state.attendanceFilter}</div>
      <div data-testid="guests-count">{state.guests.length}</div>
      <div data-testid="filtered-guests-count">{filteredGuests.length}</div>
      <div data-testid="total-pages">{totalPages}</div>
      <button data-testid="set-search" onClick={() => actions.setSearch("test")}>
        Set Search
      </button>
      <button data-testid="set-page" onClick={() => actions.setCurrentPage(2)}>
        Set Page
      </button>
      <button data-testid="set-page-size" onClick={() => actions.setPageSize(50)}>
        Set Page Size
      </button>
      <button data-testid="set-filter" onClick={() => actions.setAttendanceFilter("admitted")}>
        Set Filter
      </button>
    </div>
  );
}

describe("AttendanceProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide initial state", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("error")).toHaveTextContent("no-error");
    expect(screen.getByTestId("search")).toHaveTextContent("");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("page-size")).toHaveTextContent("20");
    expect(screen.getByTestId("attendance-filter")).toHaveTextContent("all");
    expect(screen.getByTestId("guests-count")).toHaveTextContent("1");
    expect(screen.getByTestId("filtered-guests-count")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("1");
  });

  it("should handle search functionality", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    act(() => {
      screen.getByTestId("set-search").click();
    });

    expect(screen.getByTestId("search")).toHaveTextContent("test");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1"); // Should reset to page 1
  });

  it("should handle pagination", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    act(() => {
      screen.getByTestId("set-page").click();
    });

    expect(screen.getByTestId("current-page")).toHaveTextContent("2");

    act(() => {
      screen.getByTestId("set-page-size").click();
    });

    expect(screen.getByTestId("page-size")).toHaveTextContent("50");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1"); // Should reset to page 1
  });

  it("should handle attendance filter", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    act(() => {
      screen.getByTestId("set-filter").click();
    });

    expect(screen.getByTestId("attendance-filter")).toHaveTextContent("admitted");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1"); // Should reset to page 1
  });

  it("should handle error state", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: false,
      message: "Failed to load guests",
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("error")).toHaveTextContent("Failed to load guests");
  });

  it("should filter guests based on search and attendance status", async () => {
    const multipleGuests: Guest[] = [
      { ...mockGuest, id: "1", first_name: "John", attendance_status: "not_admitted" },
      { ...mockGuest, id: "2", first_name: "Jane", attendance_status: "admitted" },
      { ...mockGuest, id: "3", first_name: "Bob", attendance_status: "not_admitted" },
    ];

    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: multipleGuests,
    });

    render(
      <AttendanceProvider eventId="test-event">
        <TestComponent />
      </AttendanceProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // Initially should show all guests
    expect(screen.getByTestId("filtered-guests-count")).toHaveTextContent("3");

    // Set filter to admitted only
    act(() => {
      screen.getByTestId("set-filter").click();
    });

    expect(screen.getByTestId("filtered-guests-count")).toHaveTextContent("1");
  });
});
