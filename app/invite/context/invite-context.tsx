"use client";

import { createContext, useContext } from "react";
import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";

interface InviteContextType {
  getEventData: (eventId: string) => Promise<Event | undefined>;
  getGuestData: (guestId: string) => Promise<Guest | undefined>;
  submitRSVP: (data: Partial<Guest>) => Promise<{ data?: Guest; success: boolean; message?: string }>;
}

const InviteContext = createContext<InviteContextType | null>(null);

export function useInviteContext() {
  const context = useContext(InviteContext);
  if (!context) {
    throw new Error("useInviteContext must be used within an InviteProvider");
  }
  return context;
}

interface InviteProviderProps {
  children: React.ReactNode;
  actions: InviteContextType;
}

export function InviteProvider({ children, actions }: InviteProviderProps) {
  return <InviteContext.Provider value={actions}>{children}</InviteContext.Provider>;
}
