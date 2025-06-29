import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { GuestList } from "@/app/events/[id]/guests/components/guest-list";
import { Guest } from "@/types/schema/Guest.schema";

// Mock the context and modules
vi.mock("../context/guest-list-context", () => ({
  GuestListProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useGuestList: () => ({
    state: {
      loading: false,
      error: null,
      search: "",
      responseFilter: "all",
      currentPage: 1,
      pageSize: 10,
    },
    actions: {
      setSearch: vi.fn(),
      setResponseFilter: vi.fn(),
      setCurrentPage: vi.fn(),
      setPageSize: vi.fn(),
      loadGuests: vi.fn(),
      forceAcceptGuest: vi.fn(),
    },
    filteredGuests: [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        type: "regular",
        response: "accepted",
        status: "published",
        attendance_status: "not_admitted",
        seat_number: "A1",
      },
      {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        type: "entourage",
        response: "pending",
        status: "published",
        attendance_status: "not_admitted",
        seat_number: "",
      },
    ],
    totalPages: 1,
  }),
}));

vi.mock("../../context/event-context", () => ({
  useEvent: () => ({
    state: {
      event: {
        id: "1",
        title: "Test Event",
      },
    },
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/useDisclosure", () => ({
  default: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn(),
    onToggle: vi.fn(),
  }),
}));

vi.mock("@/requests/guest.request", () => ({
  archiveGuest: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("GuestList", () => {
  const eventId = "test-event-id";

  it("renders guest list with seat number column", () => {
    render(<GuestList eventId={eventId} />);

    // Check that the table headers include seat number
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Seat Number")).toBeInTheDocument();
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("displays seat numbers for guests", () => {
    render(<GuestList eventId={eventId} />);

    // Check that seat numbers are displayed
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument(); // For guest without seat number
  });

  it("displays guest information correctly", () => {
    render(<GuestList eventId={eventId} />);

    // Check guest names
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check emails
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();

    // Check responses
    expect(screen.getByText("Accepted")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
