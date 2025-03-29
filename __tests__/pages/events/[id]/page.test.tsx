import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import EventPage from "@/app/events/[id]/page";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

describe("EventPage", () => {
  const mockRouter = {
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useRouter).mockReturnValue(mockRouter);
  });

  it("renders event details correctly", () => {
    render(<EventPage params={{ id: "1" }} />);

    // Check main event details
    expect(screen.getByText("John & Jane's Wedding")).toBeInTheDocument();
    expect(screen.getByText("Join us in celebrating our special day!")).toBeInTheDocument();
    expect(screen.getByText("Grand Ballroom, Luxury Hotel")).toBeInTheDocument();
    expect(screen.getByText("0 / 100 Guests")).toBeInTheDocument();

    // Check program items
    expect(screen.getByText("Ceremony")).toBeInTheDocument();
    expect(screen.getByText("Wedding ceremony")).toBeInTheDocument();
    expect(screen.getByText("Reverend Smith")).toBeInTheDocument();
    expect(screen.getByText("Our beloved pastor")).toBeInTheDocument();
    expect(screen.getByText("Reception")).toBeInTheDocument();
    expect(screen.getByText("Dinner and celebration")).toBeInTheDocument();
  });

  it("navigates to guest management page when clicking Manage Guests button", () => {
    render(<EventPage params={{ id: "1" }} />);

    const manageGuestsButton = screen.getByText("Manage Guests");
    fireEvent.click(manageGuestsButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/events/1/guests");
  });

  it("navigates to edit page when clicking Edit Event button", () => {
    render(<EventPage params={{ id: "1" }} />);

    const editButton = screen.getByText("Edit Event");
    fireEvent.click(editButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/events/1/edit");
  });

  it("displays banner image correctly", () => {
    render(<EventPage params={{ id: "1" }} />);

    const bannerImage = screen.getByAltText("John & Jane's Wedding");
    expect(bannerImage).toBeVisible();
  });
});
