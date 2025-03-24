import { render, screen } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";

describe("Privacy Policy Page", () => {
  it("renders the Privacy Policy page with all sections", () => {
    render(<PrivacyPage />);

    // Check if the page title is rendered
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();

    // Check if all section headings are rendered
    expect(screen.getByText("1. Introduction")).toBeInTheDocument();
    expect(screen.getByText("2. Information We Collect")).toBeInTheDocument();
    expect(screen.getByText("3. How We Use Your Information")).toBeInTheDocument();
    expect(screen.getByText("4. Data Security")).toBeInTheDocument();
    expect(screen.getByText("5. Contact Us")).toBeInTheDocument();

    // Check if important content is rendered
    expect(screen.getByText(/At Hapi, we take your privacy seriously/)).toBeInTheDocument();
    expect(screen.getByText(/Account information/)).toBeInTheDocument();
    expect(screen.getByText(/Event information/)).toBeInTheDocument();
    expect(screen.getByText(/Guest information/)).toBeInTheDocument();
    expect(screen.getByText(/Content you upload/)).toBeInTheDocument();

    // Check if contact information is rendered
    expect(screen.getByText(/privacy@hapi.com/)).toBeInTheDocument();
  });

  it("renders the navigation bar", () => {
    render(<PrivacyPage />);

    // Check if the navigation bar is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the last updated date", () => {
    render(<PrivacyPage />);

    // Check if the last updated date is rendered
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});
