import { render, screen, waitFor, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QRScanner } from "@/app/events/[id]/guests/components/qr-scanner";
import { AttendanceProvider } from "@/app/events/[id]/guests/context/attendance-context";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the actions
vi.mock("@/actions/guest.action", () => ({
  getGuestsForAttendance: vi.fn(),
  updateGuestAttendanceStatus: vi.fn(),
  getGuestByToken: vi.fn(),
}));

// Mock navigator.mediaDevices
const mockGetUserMedia = vi.fn();
Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

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

function renderQRScanner(isOpen: boolean = true, onClose: () => void = vi.fn(), onGuestFound: (guest: Guest) => void = vi.fn()) {
  return render(
    <AttendanceProvider eventId="test-event">
      <QRScanner isOpen={isOpen} onClose={onClose} onGuestFound={onGuestFound} />
    </AttendanceProvider>
  );
}

describe("QRScanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockClear();
  });

  it("should render QR scanner when open", () => {
    renderQRScanner(true);

    expect(screen.getByText("Scan Guest QR Code")).toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    renderQRScanner(false);

    expect(screen.queryByText("Scan Guest QR Code")).not.toBeInTheDocument();
  });

  it("should request camera access when opened", async () => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    renderQRScanner(true);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({
        video: { facingMode: "environment" },
      });
    });
  });

  it("should handle camera access error", async () => {
    const { toast } = await import("sonner");
    mockGetUserMedia.mockRejectedValue(new Error("Camera access denied"));

    renderQRScanner(true);

    await waitFor(() => {
      expect(screen.getByText("Unable to access camera. Please check permissions.")).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith("Camera access denied");
  });

  it("should show try again button when camera access fails", async () => {
    mockGetUserMedia.mockRejectedValue(new Error("Camera access denied"));

    renderQRScanner(true);

    await waitFor(() => {
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });
  });

  it("should retry camera access when try again is clicked", async () => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockRejectedValueOnce(new Error("Camera access denied"));
    mockGetUserMedia.mockResolvedValueOnce(mockStream);

    renderQRScanner(true);

    await waitFor(() => {
      expect(screen.getByText("Try Again")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText("Try Again"));
    });

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledTimes(2);
    });
  });

  it("should show scanning indicator when camera is active", async () => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    renderQRScanner(true);

    await waitFor(() => {
      expect(screen.getByText("Scanning...")).toBeInTheDocument();
    });
  });

  it("should call onClose when cancel button is clicked", async () => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);
    const onClose = vi.fn();

    renderQRScanner(true, onClose);

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(onClose).toHaveBeenCalled();
  });

  it("should stop camera when component unmounts", async () => {
    const mockTrack = { stop: vi.fn() };
    const mockStream = {
      getTracks: () => [mockTrack],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    const { unmount } = renderQRScanner(true);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalled();
    });

    unmount();

    expect(mockTrack.stop).toHaveBeenCalled();
  });

  it("should show camera feed when available", async () => {
    const mockStream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    mockGetUserMedia.mockResolvedValue(mockStream);

    renderQRScanner(true);

    await waitFor(() => {
      const video = document.querySelector("video");
      expect(video).toBeInTheDocument();
      expect(video).toHaveAttribute("autoplay");
      expect(video).toHaveAttribute("playsinline");
      expect(video).toHaveAttribute("muted");
    });
  });
});
