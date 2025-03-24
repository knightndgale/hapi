import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

describe("About Us Page", () => {
  it("renders the About Us page with all sections", () => {
    render(<AboutPage />);

    // Check if the page title is rendered
    expect(screen.getByText("About Hapi")).toBeInTheDocument();

    // Check if the subtitle is rendered
    expect(screen.getByText("Revolutionizing event management with beautiful, intuitive solutions")).toBeInTheDocument();

    // Check if all section headings are rendered
    expect(screen.getByText("Our Mission")).toBeInTheDocument();
    expect(screen.getByText("Our Values")).toBeInTheDocument();
    expect(screen.getByText("Our Team")).toBeInTheDocument();

    // Check if values are rendered
    expect(screen.getByText("Innovation")).toBeInTheDocument();
    expect(screen.getByText("User-First")).toBeInTheDocument();
    expect(screen.getByText("Excellence")).toBeInTheDocument();

    // Check if team members are rendered
    expect(screen.getAllByText("John Doe")).toHaveLength(4);
    expect(screen.getAllByText("Position")).toHaveLength(4);
  });

  it("renders all images with correct alt text", () => {
    render(<AboutPage />);

    // Check if all images are rendered with correct alt text
    expect(screen.getByAltText("Hapi Team")).toBeInTheDocument();
    expect(screen.getByAltText("Our Mission")).toBeInTheDocument();
    expect(screen.getByAltText("Team Member 1")).toBeInTheDocument();
    expect(screen.getByAltText("Team Member 2")).toBeInTheDocument();
    expect(screen.getByAltText("Team Member 3")).toBeInTheDocument();
    expect(screen.getByAltText("Team Member 4")).toBeInTheDocument();
  });

  it("renders the navigation bar", () => {
    render(<AboutPage />);

    // Check if the navigation bar is rendered
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders the hero section with overlay", () => {
    render(<AboutPage />);

    // Check if the hero section is rendered with the correct structure
    const heroSection = screen.getByRole("banner");
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveClass("relative", "h-[400px]", "w-full");
  });
});
