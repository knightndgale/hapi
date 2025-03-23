import { EventDisplay } from "@/components/events/event-display";

// Static data for generateStaticParams
export const eventIds = ["1", "2", "3"];

// This function is required for static site generation with dynamic routes
export function generateStaticParams() {
  return eventIds.map((id) => ({
    id: id,
  }));
}

export default function EventPage({ params }: { params: { id: string } }) {
  return <EventDisplay id={params.id} />;
}
