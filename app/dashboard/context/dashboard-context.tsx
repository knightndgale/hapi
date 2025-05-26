"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, ReactNode } from "react";
import { Event, EventType, EventStatus } from "@/types/schema/Event.schema";
import { TDefaultFieldFilter } from "@/types/index.types";
import { getEvents, getMyEvents } from "@/requests/event.request";

// Types
type EventResponse = {
  success: boolean;
  data?: Event[];
  message?: string;
};

interface Filters {
  type: EventType | "all";
  status: EventStatus | "all";
  search: string;
}

interface DashboardState {
  events: Event[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  viewMode: "grid" | "list";
  filters: Filters;
}

type DashboardAction =
  | { type: "SET_EVENTS"; payload: Event[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "list" }
  | { type: "SET_FILTERS"; payload: Partial<Filters> };

// Initial state
const initialState: DashboardState = {
  events: [],
  loading: true,
  error: null,
  currentPage: 1,
  pageSize: 10,
  viewMode: "grid",
  filters: {
    type: "all",
    status: "all",
    search: "",
  },
};

// Context
interface DashboardContextType {
  state: DashboardState;
  actions: {
    loadEvents: () => Promise<void>;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setViewMode: (mode: "grid" | "list") => void;
    setFilters: (filters: Partial<Filters>) => void;
  };
  filteredEvents: Event[];
  totalPages: number;
}

// Create context with default values
const DashboardContext = createContext<DashboardContextType>({
  state: initialState,
  actions: {
    loadEvents: async () => {},
    setCurrentPage: () => {},
    setPageSize: () => {},
    setViewMode: () => {},
    setFilters: () => {},
  },
  filteredEvents: [],
  totalPages: 0,
});

// Reducer
function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    default:
      return state;
  }
}

// Provider Props
interface DashboardProviderProps {
  children: ReactNode;
  loadEvents?: (props?: Partial<TDefaultFieldFilter<Event>>) => Promise<EventResponse>;
}

// Provider Component
export function DashboardProvider({ children, loadEvents = getMyEvents }: DashboardProviderProps) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // TODO [ ] IMPLEMENT DIRECTUS FILTERING
  // Memoize filtered events
  const filteredEvents = useMemo(() => {
    return state.events.filter((event) => {
      const matchesType = state.filters.type === "all" || event.type === state.filters.type;
      const matchesStatus = state.filters.status === "all" || event.status === state.filters.status;
      const matchesSearch =
        event.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(state.filters.search.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [state.events, state.filters]);

  // Memoize pagination calculations
  const { totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredEvents.length / state.pageSize);
    return { totalPages };
  }, [filteredEvents, state.pageSize]);

  // TODO [ ] IMPLEMENT DIRECTUS FILTERING

  // Memoize actions
  const actions = useMemo(
    () => ({
      loadEvents: async () => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await loadEvents();

          if (response.success && response.data) {
            dispatch({ type: "SET_EVENTS", payload: response.data });
          } else {
            dispatch({
              type: "SET_ERROR",
              payload: response.message || "Failed to fetch events",
            });
          }
        } catch (error) {
          dispatch({
            type: "SET_ERROR",
            payload: error instanceof Error ? error.message : "Failed to fetch events",
          });
        }
      },
      setCurrentPage: (page: number) => dispatch({ type: "SET_CURRENT_PAGE", payload: page }),
      setPageSize: (size: number) => dispatch({ type: "SET_PAGE_SIZE", payload: size }),
      setViewMode: (mode: "grid" | "list") => dispatch({ type: "SET_VIEW_MODE", payload: mode }),
      setFilters: (filters: Partial<Filters>) => dispatch({ type: "SET_FILTERS", payload: filters }),
    }),
    [loadEvents]
  );

  // Load events on mount
  useEffect(() => {
    actions.loadEvents();
  }, [actions]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      state,
      actions,
      filteredEvents,
      totalPages,
    }),
    [state, actions, filteredEvents, totalPages]
  );

  return <DashboardContext.Provider value={contextValue}>{children}</DashboardContext.Provider>;
}

// Custom hook for consuming the context
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
