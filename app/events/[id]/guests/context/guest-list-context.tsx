"use client";

import { createContext, useContext, useReducer, ReactNode, useMemo } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";

// Types
interface GuestListState {
  currentPage: number;
  pageSize: number;
  search: string;
  responseFilter: GuestResponse | "all";
}

interface GuestListContextType {
  state: GuestListState;
  actions: {
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setSearch: (search: string) => void;
    setResponseFilter: (response: GuestResponse | "all") => void;
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
};

// Context
const GuestListContext = createContext<GuestListContextType>({
  state: initialState,
  actions: {
    setCurrentPage: () => {},
    setPageSize: () => {},
    setSearch: () => {},
    setResponseFilter: () => {},
  },
  filteredGuests: [],
  totalPages: 0,
});

// Reducer
type GuestListAction =
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_RESPONSE_FILTER"; payload: GuestResponse | "all" };

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
    default:
      return state;
  }
}

// Provider Props
interface GuestListProviderProps {
  children: ReactNode;
  guests: Guest[];
}

// Provider Component
export function GuestListProvider({ children, guests }: GuestListProviderProps) {
  const [state, dispatch] = useReducer(guestListReducer, initialState);

  // Memoize filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch = state.search === "" || `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(state.search.toLowerCase());
      const matchesResponse = state.responseFilter === "all" || guest.response === state.responseFilter;
      return matchesSearch && matchesResponse;
    });
  }, [guests, state.search, state.responseFilter]);

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
    }),
    []
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
