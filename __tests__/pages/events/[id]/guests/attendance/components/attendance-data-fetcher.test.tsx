import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttendanceDataFetcher } from "@/app/events/[id]/guests/attendance/components/attendance-data-fetcher";
import { AttendanceProvider } from "@/app/events/[id]/guests/context/attendance-context";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the actions
vi.mock("@/actions/guest.action", () => ({
  getGuestsForAttendance: vi.fn(),
  updateGuestAttendanceStatus: vi.fn(),
  getGuestByToken: vi.fn(),
}));

// Mock the QR scanner component
vi.mock("@/app/events/[id]/guests/components/qr-scanner", () => ({
  QRScanner: ({ isOpen, onClose, onGuestFound }: any) => (
    <div data-testid="qr-scanner" style={{ display: isOpen ? "block" : "none" }}>
      <button onClick={() => onGuestFound({ id: "1", first_name: "John", last_name: "Doe" })}>Simulate QR Scan</button>
      <button onClick={onClose}>Close Scanner</button>
    </div>
  ),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
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

function renderAttendanceDataFetcher(eventId: string = "test-event") {
  return render(
    <AttendanceProvider eventId={eventId}>
      <AttendanceDataFetcher eventId={eventId} />
    </AttendanceProvider>
  );
}

describe("AttendanceDataFetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render attendance tracking interface", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByTestId("attendance-tracking")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Search guests...")).toBeInTheDocument();
    expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(screen.getByText("Attendance Status")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("should display guest information in table", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Not Admitted")).toBeInTheDocument();
  });

  it("should handle search functionality", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search guests...");
    act(() => {
      fireEvent.change(searchInput, { target: { value: "Jane" } });
    });

    // Should filter out John Doe when searching for Jane
    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    });
  });

  it("should handle attendance filter", async () => {
    const multipleGuests: Guest[] = [
      { ...mockGuest, id: "1", first_name: "John", attendance_status: "not_admitted" },
      { ...mockGuest, id: "2", first_name: "Jane", attendance_status: "admitted" },
    ];

    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: multipleGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    // Open filter dropdown and select "Admitted"
    const filterSelect = screen.getByText("All Status");
    act(() => {
      fireEvent.click(filterSelect);
    });

    const admittedOption = screen.getByText("Admitted");
    act(() => {
      fireEvent.click(admittedOption);
    });

    // Should only show admitted guests
    await waitFor(() => {
      expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("should show admit button for not admitted guests", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Admit")).toBeInTheDocument();
    });
  });

  it("should not show admit button for already admitted guests", async () => {
    const admittedGuest = { ...mockGuest, attendance_status: "admitted" as const };
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: [admittedGuest],
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Admitted")).toBeInTheDocument();
    });

    expect(screen.queryByText("Admit")).not.toBeInTheDocument();
  });

  it("should open QR scanner when scan button is clicked", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: mockGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText("Scan QR Code"));
    });

    expect(screen.getByTestId("qr-scanner")).toBeInTheDocument();
  });

  it("should handle error state", async () => {
    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: false,
      message: "Failed to load guests",
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Error: Failed to load guests")).toBeInTheDocument();
    });
  });

  it("should handle pagination", async () => {
    const manyGuests = Array.from({ length: 25 }, (_, i) => ({
      ...mockGuest,
      id: i.toString(),
      first_name: `Guest${i}`,
    }));

    const { getGuestsForAttendance } = await import("@/actions/guest.action");
    vi.mocked(getGuestsForAttendance).mockResolvedValue({
      success: true,
      data: manyGuests,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next");
    act(() => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });
  });
});
