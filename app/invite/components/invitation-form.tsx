"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, CalendarCheck } from "lucide-react";
import { PhotoUpload } from "@/components/invitation/photo-upload";
import { Event } from "@/types/schema/Event.schema";
import { BACKGROUND_IMAGES, THEME_COLORS, DEFAULT_MESSAGES } from "@/constants/invitation";
import formatDate from "@/helpers/formatDate";
import isRSVPDeadlinePassed from "@/helpers/isRSVPDeadlinePassed";
import { toast } from "sonner";
import { Guest } from "@/types/schema/Guest.schema";

interface InvitationFormProps {
  eventData: Event;
  guestData: Guest;
  onSubmitRSVP: (data: any) => Promise<{ success: boolean }>;
  isCreatorView?: boolean;
}

export function InvitationForm({ eventData, guestData, onSubmitRSVP, isCreatorView = false }: InvitationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dietaryRequirements, setDietaryRequirements] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleImagesChange = (images: File[]) => {
    setUploadedImages(images);
  };

  const handleSubmit = async (response: "accept" | "decline") => {
    try {
      setLoading(true);
      const result = await onSubmitRSVP({
        eventId: eventData.id,
        guestId: guestData.id,
        response,
        phoneNumber: guestData.type !== "regular" ? phoneNumber : undefined,
        dietaryRequirements,
        message,
        images: uploadedImages,
      });

      if (result.success) {
        toast.success("RSVP submitted successfully!");
        // You could redirect or show a success message here
      } else {
        throw new Error("Failed to submit RSVP");
      }
    } catch (error) {
      console.error("Failed to submit RSVP:", error);
      toast.error("Failed to submit RSVP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const theme = THEME_COLORS[eventData.type];
  const messages = eventData.rsvp || DEFAULT_MESSAGES[eventData.type];
  const isPhoneRequired = guestData.type === "entourage" || guestData.type === "sponsor";
  const hasResponded = guestData.response !== "pending";

  if (hasResponded && !isCreatorView) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundImage: eventData.rsvp?.backgroundImage ? `url(${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.backgroundImage})` : `url(${BACKGROUND_IMAGES[eventData.type]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md p-8 rounded-lg shadow-lg space-y-8">
          <div className="space-y-6 text-center">
            {eventData.rsvp?.logo && (
              <div className="relative w-16 h-16 mx-auto">
                <Image src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.logo}`} alt="Logo" fill className="object-contain" sizes="64px" />
              </div>
            )}

            <h1 className="text-3xl font-bold text-black">Thank You for Your Response!</h1>
            <p className="text-lg text-black">
              Dear {guestData.first_name} {guestData.last_name},
            </p>
            <p className="text-lg text-black">We have received your RSVP response. The {eventData.type} page is currently being finalized, and we will notify you once it&apos;s ready.</p>
            <div className="flex flex-wrap justify-center gap-4 text-black mt-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{formatDate(String(eventData.startDate))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{eventData.startTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{eventData.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        backgroundImage: eventData.rsvp?.backgroundImage ? `url(${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.backgroundImage})` : `url(${BACKGROUND_IMAGES[eventData.type]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md p-8 rounded-lg shadow-lg space-y-8">
        <div className="space-y-4">
          {eventData.rsvp?.logo && (
            <div className="relative w-16 h-16 mx-auto">
              <Image src={eventData.rsvp.logo ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.logo}` : ""} alt="Logo" fill className="object-contain" sizes="64px" />
            </div>
          )}
          {messages?.title_as_image ? (
            <div className="relative h-36 flex justify-start">
              <Image
                src={eventData.rsvp?.title_as_image ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.title_as_image}` : ""}
                alt="Title"
                fill
                className="object-contain object-left"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-black" data-testid="test-title">
              {messages.title}
            </h1>
          )}
          <p className="text-xl text-black" data-testid="test-greetings">
            Dear {guestData.first_name} {guestData.last_name},
          </p>
          <p className="text-lg text-black mt-4">{messages.invitation}</p>
          <div className="flex flex-wrap justify-center gap-4 text-black">
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="truncate" data-testid="test-date">
                {formatDate(String(eventData.startDate))}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <span className="truncate" data-testid="test-time">
                {eventData.startTime}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-[150px] max-w-[300px]">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="truncate" data-testid="test-location">
                {eventData.location}
              </span>
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

          {messages.deadline && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700">
                <CalendarCheck className="w-5 h-5" />
                <span className="font-medium">RSVP Deadline:</span>
                <span className={isRSVPDeadlinePassed(messages.deadline) ? "text-red-500" : "text-gray-600"}>{formatDate(messages.deadline)}</span>
              </div>
              {isRSVPDeadlinePassed(messages.deadline) && <p className="mt-2 text-sm text-red-500">The RSVP deadline has passed. Please contact the hosts for more information.</p>}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              type="button"
              className="flex-1 px-2 py-3 text-sm sm:text-base min-h-[48px]"
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
              onClick={() => handleSubmit("accept")}
              disabled={loading || Boolean(messages.deadline && isRSVPDeadlinePassed(messages.deadline)) || isCreatorView}>
              {loading ? "Submitting..." : messages.accept_text}
            </Button>
            <Button
              type="button"
              className="flex-1 px-2 py-3 text-sm sm:text-base min-h-[48px]"
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
              onClick={() => handleSubmit("decline")}
              disabled={loading || Boolean(messages.deadline && isRSVPDeadlinePassed(messages.deadline)) || isCreatorView}>
              {loading ? "Submitting..." : messages.decline_text}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
