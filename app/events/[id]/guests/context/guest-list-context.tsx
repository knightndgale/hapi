"use client";

import { createContext, useContext, useReducer, ReactNode, useMemo, useEffect } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { getEventGuests } from "@/requests/event.request";
import { updateGuest } from "@/requests/guest.request";

// Types
interface GuestListState {
  currentPage: number;
  pageSize: number;
  search: string;
  responseFilter: GuestResponse | "all";
  guests: Guest[];
  loading: boolean;
  error: string | null;
}

interface GuestListContextType {
  state: GuestListState;
  actions: {
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSearch: (search: string) => void;
    setResponseFilter: (response: GuestResponse | "all") => void;
    loadGuests: (eventId: string) => Promise<void>;
    forceAcceptGuest: (guestId: string) => Promise<void>;
  };
  filteredGuests: Guest[];
  totalPages: number;
}

// Initial state
const initialState: GuestListState = {
  currentPage: 1,
  pageSize: 10,
  search: "",
  responseFilter: "all",
  guests: [],
  loading: false,
  error: null,
};

// Context
const GuestListContext = createContext<GuestListContextType>({
  state: initialState,
  actions: {
    setCurrentPage: () => {},
    setPageSize: () => {},
    setSearch: () => {},
    setResponseFilter: () => {},
    loadGuests: async () => {},
    forceAcceptGuest: async () => {},
  },
  filteredGuests: [],
  totalPages: 0,
});

// Reducer
type GuestListAction =
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_RESPONSE_FILTER"; payload: GuestResponse | "all" }
  | { type: "SET_GUESTS"; payload: Guest[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

function guestListReducer(state: GuestListState, action: GuestListAction): GuestListState {
  switch (action.type) {
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, currentPage: 1 };
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "SET_RESPONSE_FILTER":
      return { ...state, responseFilter: action.payload, currentPage: 1 };
    case "SET_GUESTS":
      return { ...state, guests: action.payload, loading: false, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

// Provider Props
interface GuestListProviderProps {
  children: ReactNode;
  eventId: string;
}

// Provider Component
export function GuestListProvider({ children, eventId }: GuestListProviderProps) {
  const [state, dispatch] = useReducer(guestListReducer, initialState);

  // Load guests on mount
  useEffect(() => {
    actions.loadGuests(eventId);
  }, [eventId]);

  // Memoize filtered guests
  const filteredGuests = useMemo(() => {
    return state.guests.filter((guest) => {
      const matchesSearch = state.search === "" || `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(state.search.toLowerCase());
      const matchesResponse = state.responseFilter === "all" || guest.response === state.responseFilter;
      return matchesSearch && matchesResponse;
    });
  }, [state.guests, state.search, state.responseFilter]);

  // Memoize pagination calculations
  const totalPages = useMemo(() => {
    return Math.ceil(filteredGuests.length / state.pageSize);
  }, [filteredGuests.length, state.pageSize]);

  // Memoize actions
  const actions = useMemo(
    () => ({
      setCurrentPage: (page: number) => dispatch({ type: "SET_CURRENT_PAGE", payload: page }),
      setPageSize: (size: number) => dispatch({ type: "SET_PAGE_SIZE", payload: size }),
      setSearch: (search: string) => dispatch({ type: "SET_SEARCH", payload: search }),
      setResponseFilter: (response: GuestResponse | "all") => dispatch({ type: "SET_RESPONSE_FILTER", payload: response }),
      loadGuests: async (eventId: string) => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await getEventGuests(eventId);
          if (response.success && response.data) {
            dispatch({ type: "SET_GUESTS", payload: response.data });
          } else {
            dispatch({ type: "SET_ERROR", payload: response.message || "Failed to load guests" });
          }
        } catch (error) {
          dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "An error occurred" });
        }
      },
      forceAcceptGuest: async (guestId: string) => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await updateGuest(guestId, { response: "accepted" });
          if (response.success) {
            await actions.loadGuests(eventId);
          } else {
            dispatch({ type: "SET_ERROR", payload: response.message || "Failed to force accept guest" });
          }
        } catch (error) {
          dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "An error occurred" });
        }
      },
    }),
    [eventId]
  );

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      state,
      actions,
      filteredGuests,
      totalPages,
    }),
    [state, actions, filteredGuests, totalPages]
  );

  return <GuestListContext.Provider value={contextValue}>{children}</GuestListContext.Provider>;
}

// Custom hook for consuming the context
export function useGuestList() {
  const context = useContext(GuestListContext);
  if (context === undefined) {
    throw new Error("useGuestList must be used within a GuestListProvider");
  }
  return context;
}
