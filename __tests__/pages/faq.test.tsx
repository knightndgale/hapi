import { render, screen, fireEvent } from "@testing-library/react";
import FAQPage from "@/app/faq/page";

describe("FAQ Page", () => {
  it("renders the FAQ page with all questions", () => {
    render(<FAQPage />);

    // Check if the page title is rendered
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();

    // Check if all questions are rendered
    expect(screen.getByText("What is Hapi?")).toBeInTheDocument();
    expect(screen.getByText("How do I create an event?")).toBeInTheDocument();
    expect(screen.getByText("Can I customize my event page?")).toBeInTheDocument();
    expect(screen.getByText("How do I manage RSVPs?")).toBeInTheDocument();
    expect(screen.getByText("What happens if I need to cancel an event?")).toBeInTheDocument();
  });

  it("expands and collapses FAQ items when clicked", () => {
    render(<FAQPage />);

    // Get the first question
    const firstQuestion = screen.getByText("What is Hapi?");

    // Initially, the answer should not be visible
    expect(screen.getByText("Hapi is an event management platform that helps you create, manage, and share beautiful event pages and invitations.")).not.toBeVisible();

    // Click the question
    fireEvent.click(firstQuestion);

    // After clicking, the answer should be visible
    expect(screen.getByText("Hapi is an event management platform that helps you create, manage, and share beautiful event pages and invitations.")).toBeVisible();

    // Click again to collapse
    fireEvent.click(firstQuestion);

    // The answer should be hidden again
    expect(screen.getByText("Hapi is an event management platform that helps you create, manage, and share beautiful event pages and invitations.")).not.toBeVisible();
  });

  it("renders the navigation bar", () => {
    render(<FAQPage />);

    // Check if the navigation bar is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
