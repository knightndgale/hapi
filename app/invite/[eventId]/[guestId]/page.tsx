import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationDataFetcher } from "../../components/invitation-data-fetcher";

interface PageProps {
  params: {
    eventId: string;
    guestId: string;
  };
}

export default function InvitationPage({ params }: PageProps) {
  const { eventId, guestId } = params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InvitationDataFetcher eventId={eventId} guestId={guestId} />
    </Suspense>
  );
}
