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

  it("renders custom sections correctly", () => {
    render(<EventPage params={{ id: "1" }} />);

    // Check content section with HTML
    expect(screen.getByText("Our Story")).toBeInTheDocument();
    expect(screen.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.")).toBeInTheDocument();
    expect(screen.getByText("Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")).toBeInTheDocument();

    // Check image section
    expect(screen.getByText("Our Journey")).toBeInTheDocument();
    const image = screen.getByAltText("Our Journey");
    expect(image).toHaveAttribute("src", "https://images.unsplash.com/photo-1519741497674-611481863552?w=800");
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

  it("applies theme colors and background image correctly", () => {
    render(<EventPage params={{ id: "1" }} />);

    const mainContainer = screen.getByTestId("main-container");
    expect(mainContainer).toHaveStyle({
      backgroundColor: "#FFFFFF",
      backgroundImage: "url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=60)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
    });
  });

  it("displays banner image correctly", () => {
    render(<EventPage params={{ id: "1" }} />);

    const bannerImage = screen.getByAltText("John & Jane's Wedding");
    expect(bannerImage).toHaveAttribute("src", "https://images.unsplash.com/photo-1511795409834-432f7b1728f8?w=1600&auto=format&fit=crop&q=60");
  });

  it("renders cards with proper styling", () => {
    render(<EventPage params={{ id: "1" }} />);

    // Check if all cards have the backdrop blur effect
    const cards = screen.getAllByRole("article");
    cards.forEach((card) => {
      expect(card).toHaveClass("bg-white/90", "backdrop-blur-sm");
    });
  });

  it("renders hero section with proper gradient overlay", () => {
    render(<EventPage params={{ id: "1" }} />);

    const heroSection = screen.getByRole("banner");
    expect(heroSection).toHaveClass("relative", "h-[500px]");

    const gradientOverlay = heroSection.querySelector(".absolute");
    expect(gradientOverlay).toHaveClass("bg-gradient-to-t", "from-black/80", "via-black/40", "to-transparent");
  });
});
