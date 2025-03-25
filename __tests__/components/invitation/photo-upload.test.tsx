import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { PhotoUpload } from "@/components/invitation/photo-upload";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

describe("PhotoUpload", () => {
  const mockOnUpload = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnUpload.mockClear();
    mockOnRemove.mockClear();
  });

  it("renders upload button when no image is selected", () => {
    const mockOnImagesChange = vi.fn();
    render(<PhotoUpload onImagesChange={mockOnImagesChange} />);

    expect(screen.getByText(/upload photo/i)).toBeInTheDocument();
  });
  // TODO displays preview when image is provided
  // TODO handles remove action
});
