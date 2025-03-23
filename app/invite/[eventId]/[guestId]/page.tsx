"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Event, EventType, RSVP } from "@/types/schema/Event.schema";
import { BACKGROUND_IMAGES, THEME_COLORS, DEFAULT_MESSAGES } from "@/constants/invitation";
import { Calendar, Clock, MapPin, Upload, X } from "lucide-react";
import { PhotoUpload } from "@/components/invitation/photo-upload";

interface GuestData {
  firstName: string;
  lastName: string;
  guestType: "regular" | "entourage" | "sponsor";
}

interface ImagePreview {
  id: string;
  url: string;
  file: File;
}

export default function InvitationPage({ params }: { params: { eventId: string; guestId: string } }) {
  // Dummy data for development - replace with actual API calls
  const dummyEventData: Event = {
    id: params.eventId,
    title: "Sample Event",
    description: "Sample Description",
    date: "2024-06-15",
    time: "2:00 pm",
    location: "Sample Location",
    type: "wedding",
    templateId: "template-1",
    media: {
      type: "image",
      url: "",
    },
    program: [
      {
        title: "Welcome",
        description: "Welcome ceremony",
        dateTime: "2024-06-15T14:00:00Z",
        speaker: {
          name: "Host",
          bio: "Event Host",
          image: "",
        },
      },
    ],
    attendees: 0,
    maxAttendees: 100,
    rsvp: {
      title: "Together With Their Families",
      subtitle: "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
      invitation:
        "We joyfully invite you to share in the celebration of our love and commitment as we exchange vows and begin our new life together. Your presence would make our special day complete.",
      accept_text: "Joyfully Accept",
      decline_text: "Respectfully Decline",
      // logo: "https://example.com/logo.png",
      title_as_image: "https://i.ibb.co/r2wYRn2j/Kindly-Respond-removebg-preview-1.png",
    },
  };

  const dummyGuestData: GuestData = {
    firstName: "Aurora",
    lastName: "Demonteverde",
    guestType: "regular",
  };

  const [eventData, setEventData] = useState<Event>(dummyEventData);
  const [guestData, setGuestData] = useState<GuestData>(dummyGuestData);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImagesChange = (images: File[]) => {
    setUploadedImages(images);
  };

  const handleSubmit = async (response: "accept" | "decline") => {
    const responseData = {
      eventId: params.eventId,
      guestId: params.guestId,
      response,
      phoneNumber: guestData?.guestType !== "regular" ? phoneNumber : undefined,
      dietaryRequirements,
      message,
      images: uploadedImages,
    };
    console.log("Submitting response:", responseData);
    // TODO: Implement API call to submit response
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const theme = THEME_COLORS[eventData.type];
  const messages = eventData.rsvp || DEFAULT_MESSAGES[eventData.type];
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
        <div className="space-y-4">
          {dummyEventData.rsvp?.logo && (
            <div className="relative w-16 h-16 mx-auto">
              <Image src={dummyEventData.rsvp.logo} alt="Logo" fill className="object-contain" sizes="64px" />
            </div>
          )}
          {messages?.title_as_image ? (
            <div className="relative h-36 flex justify-start">
              <Image src={messages.title_as_image} alt="Title" fill className="object-contain object-left" sizes="(max-width: 768px) 100vw, 768px" />
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-black">{messages.title}</h1>
          )}
          <p className="text-xl text-black">
            Dear {guestData.firstName} {guestData.lastName},
          </p>
          <p className="text-lg text-black mt-4">{messages.invitation}</p>
          <div className="flex flex-wrap justify-center gap-4 text-black">
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{eventData.date}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{eventData.time}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{eventData.location}</span>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          {isPhoneRequired && (
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-black font-medium">
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="bg-white border-gray-300 focus:border-gray-400 text-black placeholder:text-black/70"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dietaryRequirements" className="text-black font-medium">
              Dietary Requirements
            </Label>
            <Input
              id="dietaryRequirements"
              value={dietaryRequirements}
              onChange={(e) => setDietaryRequirements(e.target.value)}
              placeholder="E.g., Vegan, Gluten-free, Nut allergies"
              className="bg-white border-gray-300 focus:border-gray-400 text-black placeholder:text-black/70"
            />
          </div>

          {eventData.type === "wedding" && <PhotoUpload onImagesChange={handleImagesChange} />}

          <div className="space-y-2">
            <Label htmlFor="message" className="text-black font-medium">
              Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your message with the hosts..."
              className="h-24 bg-white border-gray-300 focus:border-gray-400 text-black placeholder:text-black/70"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              className="flex-1"
              style={{
                backgroundColor: theme.primary,
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary;
              }}
              onClick={() => handleSubmit("accept")}>
              {messages.accept_text}
            </Button>
            <Button
              type="button"
              className="flex-1"
              style={{
                backgroundColor: `${theme.primary}cc`,
                color: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primaryHover}cc`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${theme.primary}cc`;
              }}
              onClick={() => handleSubmit("decline")}>
              {messages.decline_text}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
