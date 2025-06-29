import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttendanceDataFetcher } from "@/app/events/[id]/guests/attendance/components/attendance-data-fetcher";
import { AttendanceProvider } from "@/app/events/[id]/guests/context/attendance-context";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the modules
vi.mock("../../components/qr-scanner", () => ({
  QRScanner: ({ isOpen, onClose, onGuestFound }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="qr-scanner">
        <button
          onClick={() =>
            onGuestFound({
              id: "1",
              first_name: "John",
              last_name: "Doe",
              email: "john@example.com",
              type: "regular",
              response: "accepted",
              status: "published",
              attendance_status: "not_admitted",
              seat_number: "A1",
            })
          }>
          Simulate QR Scan
        </button>
        <button onClick={onClose}>Close Scanner</button>
      </div>
    );
  },
}));

vi.mock("@/actions/guest.action", () => ({
  getGuestsForAttendance: vi.fn(),
  updateGuestAttendanceStatus: vi.fn(),
  retreiveGuestByToken: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockGuests: Guest[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    type: "regular",
    response: "accepted",
    status: "published",
    attendance_status: "not_admitted",
    seat_number: "A1",
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@example.com",
    type: "entourage",
    response: "pending",
    status: "published",
    attendance_status: "admitted",
    seat_number: "B2",
  },
  {
    id: "3",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@example.com",
    type: "sponsor",
    response: "accepted",
    status: "published",
    attendance_status: "not_admitted",
    seat_number: "",
  },
];

const renderAttendanceDataFetcher = (eventId = "test-event-id") => {
  return render(
    <AttendanceProvider eventId={eventId}>
      <AttendanceDataFetcher eventId={eventId} />
    </AttendanceProvider>
  );
};

describe("AttendanceDataFetcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const { getGuestsForAttendance, updateGuestAttendanceStatus } = require("@/actions/guest.action");
    getGuestsForAttendance.mockResolvedValue({
      success: true,
      data: mockGuests,
    });
    updateGuestAttendanceStatus.mockResolvedValue({
      success: true,
    });
  });

  it("renders attendance tracking interface", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByTestId("attendance-tracking")).toBeInTheDocument();
    });
    expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search guests...")).toBeInTheDocument();
  });

  it("displays seat numbers in desktop table view", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Seat Number")).toBeInTheDocument();
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(screen.getByText("Attendance Status")).toBeInTheDocument();

    // Check seat numbers are displayed
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument(); // For guest without seat number
  });

  it("displays seat numbers in mobile card view", async () => {
    // Mock window.innerWidth to simulate mobile view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 768,
    });

    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Seat:")).toBeInTheDocument();
    });

    // Check that seat information is displayed in mobile cards
    expect(screen.getByText("Seat:")).toBeInTheDocument();
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("B2")).toBeInTheDocument();
  });

  it("shows seat number in admission confirmation dialog", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Admit")).toBeInTheDocument();
    });

    // Find and click the first admit button
    const admitButtons = screen.getAllByText("Admit");
    fireEvent.click(admitButtons[0]);

    // Check that the admission dialog shows with seat number
    await waitFor(() => {
      expect(screen.getByText("Admit Guest")).toBeInTheDocument();
      expect(screen.getByText("Seat Number:")).toBeInTheDocument();
      expect(screen.getByText("A1")).toBeInTheDocument();
    });
  });

  it("shows success dialog with seat number after QR scan", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Scan QR Code")).toBeInTheDocument();
    });

    // Open QR scanner
    fireEvent.click(screen.getByText("Scan QR Code"));

    // Simulate QR scan
    fireEvent.click(screen.getByText("Simulate QR Scan"));

    // Check that success dialog shows with seat number
    await waitFor(() => {
      expect(screen.getByText("Guest Admitted Successfully")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Seat Number:")).toBeInTheDocument();
      expect(screen.getByText("A1")).toBeInTheDocument();
    });
  });

  it("shows success dialog with seat number after manual admission", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Admit")).toBeInTheDocument();
    });

    // Find and click the first admit button
    const admitButtons = screen.getAllByText("Admit");
    fireEvent.click(admitButtons[0]);

    // Confirm admission
    await waitFor(() => {
      expect(screen.getByText("Admit Guest")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Admit Guest"));

    // Check that success dialog shows with seat number
    await waitFor(() => {
      expect(screen.getByText("Guest Admitted Successfully")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Seat Number:")).toBeInTheDocument();
      expect(screen.getByText("A1")).toBeInTheDocument();
    });
  });

  it("handles guests without seat numbers", async () => {
    renderAttendanceDataFetcher();

    await waitFor(() => {
      expect(screen.getByText("Admit")).toBeInTheDocument();
    });

    // Find and click the admit button for the guest without seat number (Bob Johnson)
    const admitButtons = screen.getAllByText("Admit");
    fireEvent.click(admitButtons[1]); // Bob Johnson's admit button

    // Confirm admission
    await waitFor(() => {
      expect(screen.getByText("Admit Guest")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Admit Guest"));

    // Check that success dialog shows without seat number section
    await waitFor(() => {
      expect(screen.getByText("Guest Admitted Successfully")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.queryByText("Seat Number:")).not.toBeInTheDocument();
    });
  });
});
