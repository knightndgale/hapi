"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Event, EventType, EventStatus } from "@/types/schema/Event.schema";

interface Filters {
  type: EventType | "all";
  status: EventStatus | "all";
  search: string;
}

interface DashboardContextType {
  events: Event[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  viewMode: "grid" | "list";
  filters: Filters;
  actions: {
    getEvents: () => Promise<Event[]>;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setViewMode: (mode: "grid" | "list") => void;
    setFilters: (filters: Partial<Filters>) => void;
  };
}

interface DashboardProviderProps {
  children: React.ReactNode;
  actions: {
    getEvents: () => Promise<Event[]>;
  };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Generate 100 dummy events
const generateDummyEvents = (): Event[] => {
  const types: EventType[] = ["wedding", "birthday", "seminar"];
  const statuses: EventStatus[] = ["draft", "published", "archived"];
  const locations = ["New York", "London", "Tokyo", "Paris", "Berlin", "Sydney"];

  return Array.from({ length: 100 }, (_, i) => ({
    id: `event-${i + 1}`,
    title: `Event ${i + 1}`,
    description: `Description for Event ${i + 1}. This is a sample event description.`,
    startDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    startTime: "14:00",
    endTime: "14:00",
    location: locations[Math.floor(Math.random() * locations.length)],
    type: types[Math.floor(Math.random() * types.length)],
    templateId: `template-${(i % 5) + 1}`,
    sections: [],
    program: [
      {
        title: "Welcome Session",
        description: "Opening remarks and welcome speech",
        dateTime: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        speaker: {
          name: "John Doe",
          image: `https://i.pravatar.cc/150?u=${i}`,
          bio: "Event host and coordinator",
        },
      },
    ],
    attendees: Math.floor(Math.random() * 100),
    maxAttendees: 200,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    rsvp: {
      title: `RSVP for Event ${i + 1}`,
      subtitle: "We'd love to see you there!",
      invitation: "You are cordially invited to join us...",
      accept_text: "Yes, I'll be there",
      decline_text: "Sorry, I can't make it",
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
  }));
};

const dummyEvents = generateDummyEvents();

export function DashboardProvider({ children, actions: { getEvents } }: DashboardProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    status: "all",
    search: "",
  });

  // Fetch events on mount
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        if (isMounted) {
          setEvents(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch events");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, [getEvents]);

  const filteredEvents = events.filter((event) => {
    const matchesType = filters.type === "all" || event.type === filters.type;
    const matchesStatus = filters.status === "all" || event.status === filters.status;
    const matchesSearch =
      event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.search.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const value: DashboardContextType = {
    events: paginatedEvents,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    viewMode,
    filters,
    actions: {
      getEvents,
      setCurrentPage,
      setPageSize,
      setViewMode,
      setFilters: (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
    },
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
