import { render, screen, fireEvent, act, prettyDOM } from "@testing-library/react";
import { vi } from "vitest";
import { RSVPForm } from "@/app/events/component/rsvp-form";
import { ButtonText } from "@/constants/rsvp-form";

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock ImageUpload component
vi.mock("@/components/ui/image-upload", () => ({
  ImageUpload: ({ onChange }: { onChange: (url: string) => void }) => (
    <div>
      <button onClick={() => onChange("test-image-url")}>Upload Image</button>
      <span>Upload successful</span>
    </div>
  ),
}));

describe("RSVPForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form fields correctly", () => {
    render(<RSVPForm type="wedding" onSubmit={mockOnSubmit} defaultValues={{ title: "", subtitle: "", invitation: "", accept_text: "", decline_text: "", deadline: "" }} />);
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("subtitle")).toBeInTheDocument();
    expect(screen.getByTestId("invitation")).toBeInTheDocument();
    expect(screen.getByTestId("accept_text")).toBeInTheDocument();
    expect(screen.getByTestId("decline_text")).toBeInTheDocument();
    expect(screen.getByTestId("deadline")).toBeInTheDocument();
    expect(screen.getByTestId("logo")).toBeInTheDocument(); // Logo
    expect(screen.getByTestId("backgroundImage")).toBeInTheDocument(); // Background
    expect(screen.getByTestId("title_as_image")).toBeInTheDocument();
  });

  // TODO: submits form with valid data
  // TODO: handles image upload

  it("renders with default values", () => {
    const defaultValues = {
      title: "Default Title",
      subtitle: "Default Subtitle",
      invitation: "Default Invitation",
      accept_text: "Default Accept",
      decline_text: "Default Decline",
      deadline: "2024-12-31",
      logo: "default-logo.jpg",
      backgroundImage: "default-bg.jpg",
    };

    render(<RSVPForm type="wedding" onSubmit={mockOnSubmit} defaultValues={defaultValues} />);

    expect(screen.getByTestId("title-input")).toHaveValue("Default Title");
    expect(screen.getByTestId("subtitle-input")).toHaveValue("Default Subtitle");
    expect(screen.getByTestId("invitation-input")).toHaveValue("Default Invitation");
    expect(screen.getByTestId("accept_text-input")).toHaveValue("Default Accept");
    expect(screen.getByTestId("decline_text-input")).toHaveValue("Default Decline");
  });

  it("shows validation errors for required fields", async () => {
    render(
      <RSVPForm
        type="wedding"
        onSubmit={mockOnSubmit}
        // @ts-ignore
        defaultValues={{ title: undefined, subtitle: undefined, invitation: undefined, accept_text: undefined, decline_text: undefined, deadline: undefined }}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("event-submit-button"));
    });

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(screen.getByText("Subtitle is required")).toBeInTheDocument();
    expect(screen.getByText("Invitation message is required")).toBeInTheDocument();
    expect(screen.getByText("Accept text is required")).toBeInTheDocument();
    expect(screen.getByText("Decline text is required")).toBeInTheDocument();
  });

  describe("getButtonTextByEvent", () => {
    it("returns correct text for wedding events", () => {
      render(<RSVPForm type="wedding" onSubmit={mockOnSubmit} defaultValues={{ title: "", subtitle: "", invitation: "", accept_text: "", decline_text: "", deadline: "" }} />);

      expect(screen.getByRole("button", { name: "Let's get this wedding started! 💍🎉" })).toBeInTheDocument();
    });

    it("returns correct text for birthday events", () => {
      render(<RSVPForm type="birthday" onSubmit={mockOnSubmit} defaultValues={{ title: "", subtitle: "", invitation: "", accept_text: "", decline_text: "", deadline: "" }} />);

      expect(screen.getByRole("button", { name: "Let's get the birthday party started! 🎂🎈" })).toBeInTheDocument();
    });

    it("returns correct text for seminar events", () => {
      render(<RSVPForm type="seminar" onSubmit={mockOnSubmit} defaultValues={{ title: "", subtitle: "", invitation: "", accept_text: "", decline_text: "", deadline: "" }} />);

      expect(screen.getByRole("button", { name: "Create Your Seminar 📚" })).toBeInTheDocument();
    });

    it("returns default text for unknown event types", () => {
      // @ts-ignore - Testing invalid type case
      render(<RSVPForm type="unknown" onSubmit={mockOnSubmit} defaultValues={{ title: "", subtitle: "", invitation: "", accept_text: "", decline_text: "", deadline: "" }} />);

      expect(screen.getByRole("button", { name: ButtonText.default })).toBeInTheDocument();
    });
  });
});
