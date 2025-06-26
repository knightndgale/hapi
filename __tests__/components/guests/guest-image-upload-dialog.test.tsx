import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { GuestImageUploadDialog } from "@/app/events/[id]/guests/components/guest-image-upload-dialog";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the ImageUpload component
vi.mock("@/components/ui/image-upload", () => ({
  ImageUpload: ({ value, onChange, onRemove, maxFiles }: any) => (
    <div data-testid="image-upload">
      <div data-testid="max-files">{maxFiles}</div>
      <div data-testid="current-images">{Array.isArray(value) ? value.length : 0}</div>
      <button onClick={() => onChange(["new-image-id"])}>Upload Image</button>
      {Array.isArray(value) && value.length > 0 && <button onClick={() => onRemove(0)}>Remove Image</button>}
    </div>
  ),
}));

// Mock the updateGuest function
vi.mock("@/requests/guest.request", () => ({
  updateGuest: vi.fn(),
}));

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

const mockGuest: Guest = {
  id: "1",
  first_name: "John",
  last_name: "Doe",
  email: "john@example.com",
  response: "pending",
  type: "regular",
  status: "published",
  token: "test-token",
  images: [],
};

const mockGuestWithImages: Guest = {
  ...mockGuest,
  images: [
    {
      id: 1,
      guests_id: 1,
      directus_files_id: "image-1",
    },
    {
      id: 2,
      guests_id: 1,
      directus_files_id: "image-2",
    },
  ] as any,
};

describe("GuestImageUploadDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dialog with guest information", () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText("Upload Images for John Doe")).toBeInTheDocument();
    expect(screen.getByText("Upload images for this guest. You can upload up to 3 images total.")).toBeInTheDocument();
  });

  it("shows existing images when guest has images", () => {
    render(<GuestImageUploadDialog guest={mockGuestWithImages} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText("Existing Images (2/3)")).toBeInTheDocument();
    expect(screen.getByText("Upload New Images (0/1)")).toBeInTheDocument();
  });

  it("shows upload section when guest has no images", () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText("Upload New Images (0/3)")).toBeInTheDocument();
    expect(screen.queryByText("Existing Images")).not.toBeInTheDocument();
  });

  it("shows correct max files for upload when guest has existing images", () => {
    render(<GuestImageUploadDialog guest={mockGuestWithImages} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const imageUpload = screen.getByTestId("image-upload");
    expect(imageUpload).toBeInTheDocument();
    expect(screen.getByTestId("max-files")).toHaveTextContent("1");
  });

  it("shows correct max files for upload when guest has no images", () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const imageUpload = screen.getByTestId("image-upload");
    expect(imageUpload).toBeInTheDocument();
    expect(screen.getByTestId("max-files")).toHaveTextContent("3");
  });

  it("hides upload section when maximum images reached", () => {
    const guestWithMaxImages: Guest = {
      ...mockGuest,
      images: [
        { id: 1, guests_id: 1, directus_files_id: "image-1" },
        { id: 2, guests_id: 1, directus_files_id: "image-2" },
        { id: 3, guests_id: 1, directus_files_id: "image-3" },
      ] as any,
    };

    render(<GuestImageUploadDialog guest={guestWithMaxImages} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText("Existing Images (3/3)")).toBeInTheDocument();
    expect(screen.queryByText("Upload New Images")).not.toBeInTheDocument();
    expect(screen.getByText("Maximum images reached")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("does not render when guest is null", () => {
    render(<GuestImageUploadDialog guest={null} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    expect(screen.queryByText("Upload Images for")).not.toBeInTheDocument();
  });

  it("shows loading state during upload", async () => {
    const { updateGuest } = await import("@/requests/guest.request");
    (updateGuest as any).mockResolvedValue({ success: true, data: mockGuest });

    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Upload an image first
    fireEvent.click(screen.getByText("Upload Image"));

    // Then submit
    const submitButton = screen.getByText("Upload Images");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });
  });

  it("disables submit button when no images are uploaded", () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByText("Upload Images");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when images are uploaded", async () => {
    render(<GuestImageUploadDialog guest={mockGuest} isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Upload an image
    fireEvent.click(screen.getByText("Upload Image"));

    await waitFor(() => {
      const submitButton = screen.getByText("Upload Images");
      expect(submitButton).not.toBeDisabled();
    });
  });
});
