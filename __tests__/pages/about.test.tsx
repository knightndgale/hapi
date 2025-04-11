import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AboutPage from "@/app/about/page";

describe("FAQ Page", () => {
  it("renders the navigation bar", () => {
    render(<AboutPage />);

    // Check if the navigation bar is rendered
    waitFor(() => {
      expect(screen.getByTestId("about-page")).toBeInTheDocument();
    });
  });
});
