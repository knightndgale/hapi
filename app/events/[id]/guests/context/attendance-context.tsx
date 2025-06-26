"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Guest, GuestAttendanceStatus } from "@/types/schema/Guest.schema";
import { getGuestsForAttendance, updateGuestAttendanceStatus, retreiveGuestByToken } from "@/actions/guest.action";

interface AttendanceState {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  search: string;
  currentPage: number;
  pageSize: number;
  attendanceFilter: GuestAttendanceStatus | "all";
}

type AttendanceAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_GUESTS"; payload: Guest[] }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_ATTENDANCE_FILTER"; payload: GuestAttendanceStatus | "all" }
  | { type: "UPDATE_GUEST_ATTENDANCE"; payload: { guestId: string; attendanceStatus: GuestAttendanceStatus } };

const initialState: AttendanceState = {
  guests: [],
  loading: false,
  error: null,
  search: "",
  currentPage: 1,
  pageSize: 20,
  attendanceFilter: "all",
};

function attendanceReducer(state: AttendanceState, action: AttendanceAction): AttendanceState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_GUESTS":
      return { ...state, guests: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, currentPage: 1 };
    case "SET_ATTENDANCE_FILTER":
      return { ...state, attendanceFilter: action.payload, currentPage: 1 };
    case "UPDATE_GUEST_ATTENDANCE":
      return {
        ...state,
        guests: state.guests.map((guest) => (guest.id === action.payload.guestId ? { ...guest, attendance_status: action.payload.attendanceStatus } : guest)),
      };
    default:
      return state;
  }
}

interface AttendanceContextType {
  state: AttendanceState;
  actions: {
    loadGuests: (eventId: string) => Promise<void>;
    setSearch: (search: string) => void;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
    setAttendanceFilter: (filter: GuestAttendanceStatus | "all") => void;
    updateAttendanceStatus: (guestId: string, attendanceStatus: GuestAttendanceStatus) => Promise<void>;
    getGuestByToken: (token: string) => Promise<Guest | null>;
  };
  filteredGuests: Guest[];
  totalPages: number;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}

interface AttendanceProviderProps {
  children: React.ReactNode;
  eventId: string;
}

export function AttendanceProvider({ children, eventId }: AttendanceProviderProps) {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  const loadGuests = async (eventId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const response = await getGuestsForAttendance(eventId);
      if (response.success && response.data) {
        dispatch({ type: "SET_GUESTS", payload: response.data });
      } else {
        dispatch({ type: "SET_ERROR", payload: response.message || "Failed to load guests" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to load guests" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const setSearch = (search: string) => {
    dispatch({ type: "SET_SEARCH", payload: search });
  };

  const setCurrentPage = (page: number) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: page });
  };

  const setPageSize = (size: number) => {
    dispatch({ type: "SET_PAGE_SIZE", payload: size });
  };

  const setAttendanceFilter = (filter: GuestAttendanceStatus | "all") => {
    dispatch({ type: "SET_ATTENDANCE_FILTER", payload: filter });
  };

  const updateAttendanceStatus = async (guestId: string, attendanceStatus: GuestAttendanceStatus) => {
    try {
      const response = await updateGuestAttendanceStatus(guestId, attendanceStatus);
      if (response.success) {
        dispatch({ type: "UPDATE_GUEST_ATTENDANCE", payload: { guestId, attendanceStatus } });
      } else {
        throw new Error(response.message || "Failed to update attendance status");
      }
    } catch (error) {
      console.error("Error updating attendance status:", error);
      throw error;
    }
  };

  const getGuestByTokenAction = async (token: string): Promise<Guest | null> => {
    try {
      // Extract token from URL if the scanned QR code contains a full URL
      let extractedToken = token;
      if (token.includes("/invite/validate/")) {
        extractedToken = token.split("/invite/validate/")[1];
      } else if (token.includes(`${process.env.NEXT_PUBLIC_URL}/invite/validate/`)) {
        extractedToken = token.split(`${process.env.NEXT_PUBLIC_URL}/invite/validate/`)[1];
      }

      const response = await retreiveGuestByToken(extractedToken);
      if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0] as Guest;
      } else {
        throw new Error(response.message || "Failed to get guest by token");
      }
    } catch (error) {
      console.error("Error getting guest by token:", error);
      throw error;
    }
  };

  // Filter guests based on search and attendance filter
  const filteredGuests = state.guests.filter((guest) => {
    const matchesSearch =
      state.search === "" || `${guest.first_name} ${guest.last_name}`.toLowerCase().includes(state.search.toLowerCase()) || guest.email?.toLowerCase().includes(state.search.toLowerCase());

    const matchesFilter = state.attendanceFilter === "all" || guest.attendance_status === state.attendanceFilter;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredGuests.length / state.pageSize);

  useEffect(() => {
    loadGuests(eventId);
  }, [eventId]);

  const value: AttendanceContextType = {
    state,
    actions: {
      loadGuests,
      setSearch,
      setCurrentPage,
      setPageSize,
      setAttendanceFilter,
      updateAttendanceStatus,
      getGuestByToken: getGuestByTokenAction,
    },
    filteredGuests,
    totalPages,
  };

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}
