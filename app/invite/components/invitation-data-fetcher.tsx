"use client";

import { useEffect, useState } from "react";
import { useInviteContext } from "../context/invite-context";
import { Event } from "@/types/schema/Event.schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { submitRSVP } from "@/actions/guest.action";
import { InvitationForm } from "./invitation-form";
import { Guest } from "@/types/schema/Guest.schema";

interface InvitationDataFetcherProps {
  eventId: string;
  guestId: string;
}

// Sample guest data for creator view
const sampleGuestData: Guest = {
  id: "creator-view",
  first_name: "Sample",
  last_name: "Guest",
  email: "sample@example.com",
  response: "pending",
  type: "regular",
  phoneNumber: "",
  dietaryRequirements: "",
  message: "",
};

export function InvitationDataFetcher({ eventId, guestId }: InvitationDataFetcherProps) {
  const { getEventData, getGuestData } = useInviteContext();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [guestData, setGuestData] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isCreatorView = guestId === "creatorView";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch event data
        const eventResponse = await getEventData(eventId);
        if (!eventResponse) {
          throw new Error("Failed to load event data");
        }
        setEventData(eventResponse);

        // If it's creator view, use sample data, otherwise fetch guest data
        if (isCreatorView) {
          setGuestData(sampleGuestData);
        } else {
          const guestResponse = await getGuestData(guestId);
          if (!guestResponse) {
            throw new Error("Failed to load guest data");
          }
          setGuestData(guestResponse);
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, guestId, getEventData, getGuestData, isCreatorView]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div role="alert" className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Unable to Load Invitation</h1>
                <p className="text-gray-600 mb-4">We&apos;re having trouble loading your invitation details.</p>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600">Error: {error}</p>
                </div>
                <p className="mt-4 text-gray-600">Please try refreshing the page or contact the event organizer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!eventData || !guestData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div role="alert" className="text-center">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">No Invitation Found</h1>
                <p className="text-gray-600">We couldn&apos;t find the invitation details you&apos;re looking for.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <InvitationForm eventData={eventData} guestData={guestData} onSubmitRSVP={submitRSVP} isCreatorView={isCreatorView} />;
}
