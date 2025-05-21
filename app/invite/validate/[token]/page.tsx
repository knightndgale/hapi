"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getGuestById, getGuestByToken, verifyGuestToken } from "@/requests/guest.request";
import { getEventById } from "@/requests/event.request";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BACKGROUND_IMAGES, THEME_COLORS } from "@/constants/invitation";
import { Event } from "@/types/schema/Event.schema";
import { Guest } from "@/types/schema/Guest.schema";

export default function ValidateTokenPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<Event | null>(null);
  const [guestData, setGuestData] = useState<Guest | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = params.token as string;

        // Verify JWT token
        const tokenResult = await verifyGuestToken(token);
        if (!tokenResult.success || !tokenResult.data) {
          throw new Error("Invalid token");
        }

        const { guestId, eventId } = tokenResult.data;

        // Get guest data
        const guestResponse = await getGuestById(guestId);

        if (!guestResponse.success || !guestResponse.data) {
          throw new Error("Guest not found");
        }

        // Get event data
        const eventResponse = await getEventById(eventId);

        if (!eventResponse.success || !eventResponse.data) {
          throw new Error("Event not found");
        }

        setGuestData(guestResponse.data);
        setEventData(eventResponse.data);

        // If both guest and event are valid, redirect to invitation page
        router.push(`/invite/${eventId}/${guestId}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid invitation link");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [params.token, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8"
        style={{
          backgroundImage: eventData?.rsvp?.backgroundImage
            ? `url(${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.backgroundImage})`
            : eventData?.type
            ? `url(${BACKGROUND_IMAGES[eventData.type]})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <Card className="max-w-md w-full bg-white/95 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <div className="space-y-6 text-center">
            {eventData?.rsvp?.logo && (
              <div className="relative w-16 h-16 mx-auto">
                <img src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${eventData.rsvp.logo}`} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{eventData ? "Invalid Invitation Link" : "Invalid Event"}</h1>
            <p className="text-gray-600">
              {eventData ? "This invitation link is no longer valid. Please contact the hosts for assistance." : "The event you're trying to access doesn't exist or has been removed."}
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-4"
              style={{
                backgroundColor: eventData ? THEME_COLORS[eventData.type].primary : undefined,
                color: "white",
              }}>
              Return Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
