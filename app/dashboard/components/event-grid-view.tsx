"use client";

import { Event } from "@/types/schema/Event.schema";
import { EventCard } from "@/components/events/event-card";

interface EventGridViewProps {
  events: Event[];
}

export function EventGridView({ events }: EventGridViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
