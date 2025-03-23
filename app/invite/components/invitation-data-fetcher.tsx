"use client";

import { useEffect, useState } from "react";
import { useInviteContext } from "../context/invite-context";
import { Event } from "@/types/schema/Event.schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { submitRSVP } from "@/actions/guest.action";
import { InvitationForm } from "./invitation-form";

interface GuestData {
  id: string;
  firstName: string;
  lastName: string;
  guestType: "regular" | "entourage" | "sponsor";
}

interface InvitationDataFetcherProps {
  eventId: string;
  guestId: string;
}

export function InvitationDataFetcher({ eventId, guestId }: InvitationDataFetcherProps) {
  const { getEventData, getGuestData } = useInviteContext();
  const [eventData, setEventData] = useState<Event | null>(null);
  const [guestData, setGuestData] = useState<GuestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        const [event, guest] = await Promise.all([getEventData(eventId), getGuestData(guestId)]);

        if (isMounted) {
          setEventData(event);
          setGuestData(guest);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
          // Set default data for error state
          setEventData(null);
          setGuestData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [eventId, guestId, getEventData, getGuestData]);

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading invitation data">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error message within the default UI
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

  return <InvitationForm eventData={eventData} guestData={guestData} onSubmitRSVP={submitRSVP} />;
}
