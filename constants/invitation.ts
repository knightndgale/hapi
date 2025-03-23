import { EventType, RSVP } from "@/types/schema/Event.schema";

export const BACKGROUND_IMAGES = {
  wedding: "https://images.unsplash.com/photo-1612538946893-033c6bb7060c?q=80&w=3174&auto=format&fit=crop",
  birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=3174&auto=format&fit=crop",
  seminar: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=3174&auto=format&fit=crop",
} as const;

export const THEME_COLORS = {
  wedding: {
    primary: "#8B4513",
    primaryHover: "#A0522D",
    background: "white/95",
    text: "gray-900",
    buttonAccept: "bg-[#8B4513] hover:bg-[#A0522D]",
    buttonDecline: "bg-[#8B4513]/80 hover:bg-[#A0522D]/80",
  },
  birthday: {
    primary: "#FF69B4",
    primaryHover: "#FF1493",
    background: "white/95",
    text: "gray-800",
    buttonAccept: "bg-[#FF69B4] hover:bg-[#FF1493]",
    buttonDecline: "bg-[#FF69B4]/80 hover:bg-[#FF1493]/80",
  },
  seminar: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    background: "white/95",
    text: "gray-900",
    buttonAccept: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    buttonDecline: "bg-[#2563eb]/80 hover:bg-[#1d4ed8]/80",
  },
} as const;

export const DEFAULT_MESSAGES: Record<EventType, RSVP> = {
  wedding: {
    title: "Together With Their Families",
    subtitle: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
    invitation: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
    accept_text: "Joyfully Accept",
    decline_text: "Respectfully Decline",
  },
  birthday: {
    title: "You're Invited to the Celebration!",
    subtitle: "Join us for an amazing celebration filled with joy, laughter, and unforgettable moments. Your presence will make this birthday extra special!",
    invitation: "Join us for an amazing celebration filled with joy, laughter, and unforgettable moments. Your presence will make this birthday extra special!",
    accept_text: "Count Me In!",
    decline_text: "Sorry, Can't Make It",
  },
  seminar: {
    title: "Professional Development Invitation",
    subtitle: "You are invited to join us for an engaging and informative session. Your participation will contribute to meaningful discussions and knowledge sharing.",
    invitation: "You are invited to join us for an engaging and informative session. Your participation will contribute to meaningful discussions and knowledge sharing.",
    accept_text: "Confirm Attendance",
    decline_text: "Unable to Attend",
  },
};
