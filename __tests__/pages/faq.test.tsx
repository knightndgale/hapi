import { render, screen, fireEvent } from "@testing-library/react";
import FAQPage from "@/app/faq/page";

describe("FAQ Page", () => {
  it("renders the navigation bar", () => {
    render(<FAQPage />);

    // Check if the navigation bar is rendered
    expect(screen.getByTestId("faq-page")).toBeInTheDocument();
  });
});
