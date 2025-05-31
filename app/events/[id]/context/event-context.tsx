"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect, useMemo } from "react";
import { Event, Section } from "@/types/schema/Event.schema";
import { getEventById, archiveEventSection } from "@/requests/event.request";
import { Status, TDefaultFieldFilter } from "@/types/index.types";
import { getMe } from "@/requests/auth.request";
import { Guest } from "@/types/schema/Guest.schema";
import { ProgramItem } from "@/types/schema/Program.schema";
type EventsSection = {
  events_id: string;
  sections_id: Section;
};

type EventsProgram = {
  events_id: string;
  programs_id: ProgramItem;
};
export interface ExtendedEvent extends Omit<Event, "sections" | "programs"> {
  sections: EventsSection[];
  programs: EventsProgram[];
}
interface EventState {
  event: ExtendedEvent | null;
  loading: boolean;
  error: string | null;
  user: { id: string } | null;
}

type EventAction =
  | { type: "SET_EVENT"; payload: ExtendedEvent }
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
    loadEvent: (id: string, props?: Partial<TDefaultFieldFilter<ExtendedEvent>>) => Promise<void>;
    deleteSection: (sectionId: string) => Promise<{ success: boolean; message?: string }>;
  };
  dispatch: React.Dispatch<EventAction>;
}

// Create context with default values
const EventContext = createContext<EventContextType>({
  state: initialState,
  actions: {
    loadEvent: async (id: string, props?: Partial<TDefaultFieldFilter<ExtendedEvent>>) => {},
    deleteSection: async (sectionId: string) => ({ success: false }),
  },
  dispatch: () => {},
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

// Provider Props
interface EventProviderProps {
  children: ReactNode;
  eventId: string;
  loadEvent?: (id: string, props?: Partial<TDefaultFieldFilter<Event>>) => Promise<{ success: boolean; data?: Event; message?: string }>;
}

// Provider Component
export function EventProvider({ children, eventId, loadEvent = getEventById }: EventProviderProps) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await loadEvent(eventId, {
          fields: ["*", "rsvp.*", "guests.*.*", "sections.*.*", "programs.*.*"],
          // filter: {
          //   sections: {
          //     sections_id: {
          //       status: Status.Enum.published,
          //     },
          //   },
          // },
        });

        if (response.success && response.data) {
          const eventData = response.data;
          const guestsList = eventData.guests as unknown as { guests_id: Guest }[];
          const guests = guestsList.map((guest) => guest.guests_id).filter((guest) => guest?.status !== Status.Enum.archived);

          // Transform sections into EventsSection format
          const sections = eventData.sections
            .filter((section: any) => section.sections_id.status !== Status.Enum.archived)
            .map((section: any) => ({
              events_id: eventData.id,
              sections_id: section.sections_id || section,
            }));

          const programs = eventData.programs
            .filter((program: any) => program.programs_id.status !== Status.Enum.archived)
            .map((program: any) => ({
              events_id: eventData.id,
              programs_id: program.programs_id || program,
            }));

          dispatch({ type: "SET_EVENT", payload: { ...eventData, guests, sections, programs } });
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
          const response = await loadEvent(id ?? eventId, {
            ...props,
            fields: ["*", "rsvp.*", "guests.*.*", "sections.*.*", "programs.*.*"],
            // filter: {
            //   sections: {
            //     sections_id: {
            //       status: Status.Enum.published,
            //     },
            //   },
            // },
          });

          if (response.success && response.data) {
            const eventData = response.data;
            const guestsList = eventData.guests as unknown as { guests_id: Guest }[];
            const guests = guestsList.map((guest) => guest.guests_id).filter((guest) => guest?.status !== Status.Enum.archived);

            // Transform sections into EventsSection format
            const sections = eventData.sections
              .filter((section: any) => section.sections_id.status !== Status.Enum.archived)
              .map((section: any) => ({
                events_id: eventData.id,
                sections_id: section.sections_id || section,
              }));

            const programs = eventData.programs
              .filter((program: any) => program.programs_id.status !== Status.Enum.archived)
              .map((program: any) => ({
                events_id: eventData.id,
                programs_id: program.programs_id || program,
              }));

            dispatch({ type: "SET_EVENT", payload: { ...eventData, guests, sections, programs } });
          } else {
            dispatch({ type: "SET_ERROR", payload: response.message || "Failed to load event" });
          }
        } catch (error) {
          dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : "An error occurred" });
        }
      },
      deleteSection: async (sectionId: string) => {
        try {
          const response = await archiveEventSection(sectionId);

          if (response.success) {
            // Reload the event data to get the updated sections
            await actions.loadEvent(eventId);
          }
          return response;
        } catch (error) {
          return { success: false, message: error instanceof Error ? error.message : "Failed to delete section" };
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
      dispatch,
    }),
    [state, actions, dispatch]
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
