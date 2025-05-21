"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo } from "react";
import { Event } from "@/types/schema/Event.schema";
import { getEventById } from "@/requests/event.request";
import { Status, TDefaultFieldFilter } from "@/types/index.types";
import { getMe } from "@/requests/auth.request";
import { Guest } from "@/types/schema/Guest.schema";

// Types
interface EventState {
  event: Event | null;
  loading: boolean;
  error: string | null;
  user: { id: string } | null;
}

type EventAction =
  | { type: "SET_EVENT"; payload: Event }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_USER"; payload: { id: string } | null };

// Initial state
const initialState: EventState = {
  event: null,
  loading: true,
  error: null,
  user: null,
};

// Context
interface EventContextType {
  state: EventState;
  actions: {
    loadEvent: (id: string, props?: Partial<TDefaultFieldFilter<Event>>) => Promise<void>;
  };
}

// Create context with default values
const EventContext = createContext<EventContextType>({
  state: initialState,
  actions: {
    loadEvent: async (id: string, props?: Partial<TDefaultFieldFilter<Event>>) => {},
  },
});

// Reducer
function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    case "SET_EVENT":
      return {
        ...state,
        event: action.payload,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

type EventResponse = {
  success: boolean;
  data?: Event;
  message?: string;
};

// Provider Props
interface EventProviderProps {
  children: ReactNode;
  eventId: string;
  loadEvent?: (id: string, props?: Partial<TDefaultFieldFilter<Event>>) => Promise<EventResponse>;
}

// Provider Component
export function EventProvider({ children, eventId, loadEvent = getEventById }: EventProviderProps) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await loadEvent(eventId, {
          fields: ["*", "guests.guests_id.*", "rsvp.*"],
        });

        if (response.success && response.data) {
          const guestsList = response.data.guests as unknown as { guests_id: Guest }[];
          // TODO [ ] Improve event filtering using directus filtering not manual filtering
          const guests = guestsList.map((guest) => guest.guests_id).filter((guest) => guest?.status !== Status.Enum.archived);
          dispatch({ type: "SET_EVENT", payload: { ...response.data, guests } });
        } else {
          dispatch({ type: "SET_ERROR", payload: response.message || "Failed to load event" });
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "An error occurred" });
      }
    };

    const loadUserData = async () => {
      try {
        const response = await getMe();
        if (response.success && response.data) {
          dispatch({ type: "SET_USER", payload: { id: response.data.id } });
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadEventData();
    loadUserData();
  }, [eventId, loadEvent]);

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(
    () => ({
      loadEvent: async (id?: string, props?: Partial<TDefaultFieldFilter<Event>>) => {
        try {
          dispatch({ type: "SET_LOADING", payload: true });
          const response = await loadEvent(id ?? eventId, props);
          if (response.success && response.data) {
            const guestsList = response.data.guests as unknown as { guests_id: Guest }[];
            const guests = guestsList.map((guest) => guest.guests_id).filter((guest) => guest?.status !== Status.Enum.archived);

            dispatch({ type: "SET_EVENT", payload: { ...response.data, guests } });
          } else {
            dispatch({ type: "SET_ERROR", payload: response.message || "Failed to load event" });
          }
        } catch (error) {
          dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "An error occurred" });
        }
      },
    }),
    [eventId, loadEvent]
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>;
}

// Custom hook for consuming the context
export function useEvent() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
}
