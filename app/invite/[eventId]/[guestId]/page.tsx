"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Event, EventType } from "@/types/schema/Event.schema";

interface GuestInvitation {
  firstName: string;
  lastName: string;
  guestType: "regular" | "entourage" | "sponsor";
}

interface EventInvitation {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
}

const BACKGROUND_IMAGES = {
  wedding: "https://images.unsplash.com/photo-1612538946893-033c6bb7060c?q=80&w=3174&auto=format&fit=crop",
  birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=3174&auto=format&fit=crop",
  seminar: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=3174&auto=format&fit=crop",
} as const;

const THEME_COLORS = {
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

const EVENT_MESSAGES = {
  wedding: {
    header: "Together With Their Families",
    invitation: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
    accept: "Joyfully Accept",
    decline: "Respectfully Decline",
  },
  birthday: {
    header: "You're Invited to the Celebration!",
    invitation: "Join us for an amazing celebration filled with joy, laughter, and unforgettable moments. Your presence will make this birthday extra special!",
    accept: "Count Me In!",
    decline: "Sorry, Can't Make It",
  },
  seminar: {
    header: "Professional Development Invitation",
    invitation: "You are invited to join us for an engaging and informative session. Your participation will contribute to meaningful discussions and knowledge sharing.",
    accept: "Confirm Attendance",
    decline: "Unable to Attend",
  },
} as const;

export default function InvitationPage({ params }: { params: { eventId: string; guestId: string } }) {
  // Dummy data for development - replace with actual API calls
  const dummyEventData: EventInvitation = {
    id: params.eventId,
    title: "Sample Event",
    description: "Sample Description",
    date: "2024-06-15",
    time: "14:00",
    location: "Sample Location",
    type: "wedding",
  };

  const dummyGuestData: GuestInvitation = {
    firstName: "John",
    lastName: "Smith",
    guestType: "regular",
  };

  const [eventData, setEventData] = useState<EventInvitation>(dummyEventData);
  const [guestData, setGuestData] = useState<GuestInvitation>(dummyGuestData);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (response: "accept" | "decline") => {
    const responseData = {
      eventId: params.eventId,
      guestId: params.guestId,
      response,
      phoneNumber: guestData?.guestType !== "regular" ? phoneNumber : undefined,
      dietaryRequirements,
      message,
    };
    console.log("Submitting response:", responseData);
    // TODO: Implement API call to submit response
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const theme = THEME_COLORS[eventData.type];
  const messages = EVENT_MESSAGES[eventData.type];
  const isPhoneRequired = guestData.guestType === "entourage" || guestData.guestType === "sponsor";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        backgroundImage: `url('${BACKGROUND_IMAGES[eventData.type]}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md p-8 rounded-lg shadow-lg space-y-8">
        <div className="text-center space-y-4">
          <h1 className={`text-3xl font-bold text-${theme.text}`}>{messages.header}</h1>
          <p className={`text-xl text-${theme.text}`}>
            Dear {guestData.firstName} {guestData.lastName},
          </p>
          <p className={`text-lg text-${theme.text} mt-4`}>{messages.invitation}</p>
          <div className="mt-4 text-gray-700">
            <p>Date: {eventData.date}</p>
            <p>Time: {eventData.time}</p>
            <p>Location: {eventData.location}</p>
          </div>
        </div>

        <form className="space-y-6">
          {isPhoneRequired && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={`text-${theme.text} font-medium`}>
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="bg-white border-gray-300 focus:border-gray-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dietaryRequirements" className={`text-${theme.text} font-medium`}>
              Dietary Requirements
            </Label>
            <Input
              id="dietaryRequirements"
              value={dietaryRequirements}
              onChange={(e) => setDietaryRequirements(e.target.value)}
              placeholder="E.g., Vegan, Gluten-free, Nut allergies"
              className="bg-white border-gray-300 focus:border-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className={`text-${theme.text} font-medium`}>
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your message with the hosts..."
              className="h-24 bg-white border-gray-300 focus:border-gray-400"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" className={`flex-1 ${theme.buttonAccept} text-white`} onClick={() => handleSubmit("accept")}>
              {messages.accept}
            </Button>
            <Button type="button" className={`flex-1 ${theme.buttonDecline} text-white`} onClick={() => handleSubmit("decline")}>
              {messages.decline}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
