import { prettyDOM, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EventPage from "@/app/events/[id]/page";

// Mock the useRouter hook
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the Image component
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

describe("EventPage", () => {
  const mockParams = { id: "1" };

  beforeEach(() => {
    // Reset the mock before each test
    mockIntersectionObserver.mockClear();
  });

  it("renders the event title", () => {
    render(<EventPage params={mockParams} />);
    const title = screen.getByText("John & Jane's Wedding");
    expect(title).toBeInTheDocument();
  });

  it("renders the event description", () => {
    render(<EventPage params={mockParams} />);

    const description = screen.getByText("Join us in celebrating our special day!");
    expect(description).toBeInTheDocument();
  });
});
