"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { Event } from "@/types/schema/Event.schema";
import { EventFilters, EventStatus, EventType } from "./components/event-filters";
import { DateRange } from "react-day-picker";

export default function DashboardPage() {
  const router = useRouter();
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2024",
      description: "Join us for an exciting day of technology talks and networking. Experience cutting-edge innovations and connect with industry leaders.",
      date: "2024-04-15",
      time: "09:00",
      location: "Convention Center",
      attendees: 120,
      maxAttendees: 200,
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=80",
      },
      program: [
        {
          title: "Opening Keynote",
          description: "Welcome address and conference overview",
          dateTime: "2024-04-15T09:00",
          speaker: {
            name: "John Doe",
            bio: "CEO of Tech Corp",
          },
        },
      ],
      type: "conference",
      templateId: "",
      status: "published",
    },
    {
      id: "2",
      title: "Product Launch",
      description: "Be the first to see our new product line. Join us for an exclusive preview of revolutionary features that will transform the industry.",
      date: "2024-05-01",
      time: "14:00",
      location: "Innovation Hub",
      attendees: 75,
      maxAttendees: 100,
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=2400&q=80",
      },
      program: [
        {
          title: "Product Demo",
          description: "Live demonstration of new features",
          dateTime: "2024-05-01T14:00",
          speaker: {
            name: "Jane Smith",
            bio: "Product Director",
          },
        },
      ],
      type: "conference",
      templateId: "",
      status: "draft",
    },
  ]);

  const [filters, setFilters] = useState<{
    type: EventType;
    status: EventStatus;
    dateRange: DateRange | undefined;
  }>({
    type: "all",
    status: "all",
    dateRange: undefined,
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Filter by type
      if (filters.type !== "all" && event.type !== filters.type) {
        return false;
      }

      // Filter by status
      if (filters.status !== "all" && event.status !== filters.status) {
        return false;
      }

      // Filter by date range
      if (filters.dateRange) {
        const eventDate = new Date(event.date);
        if (filters.dateRange.from && eventDate < filters.dateRange.from) {
          return false;
        }
        if (filters.dateRange.to && eventDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [events, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Events</h1>
          <Button onClick={() => router.push("/events/create")}>
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Button>
        </div>

        <EventFilters onFilterChange={setFilters} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
}
