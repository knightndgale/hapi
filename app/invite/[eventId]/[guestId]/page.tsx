import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { InvitationDataFetcher } from "../../components/invitation-data-fetcher";

interface PageProps {
  params: Promise<{
    eventId: string;
    guestId: string;
  }>;
}

export default async function InvitationPage(props: PageProps) {
  const params = await props.params;
  const { eventId, guestId } = params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InvitationDataFetcher eventId={eventId} guestId={guestId} />
    </Suspense>
  );
}
