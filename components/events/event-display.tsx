"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Event } from "@/types/schema/Event.schema";
import formatDate from "@/helpers/formatDate";

interface EventDisplayProps {
  id: string;
}

export function EventDisplay({ id }: EventDisplayProps) {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    // Simulate fetching event data
    const mockEvent: Event = {
      id,
      title: "Tech Conference 2024",
      description: "Join us for an exciting day of technology talks and networking.",
      startDate: new Date("2024-04-15"),
      endDate: new Date("2024-04-15"),
      startTime: "09:00",
      endTime: "09:00",
      location: "Convention Center",
      type: "seminar",
      templateId: "seminar-professional",
      attendees: 120,
      pageBanner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      program: [
        {
          title: "Opening Keynote",
          description: "Welcome address and conference overview",
          dateTime: "2024-04-15T09:00",
          speaker: {
            name: "John Doe",
            bio: "CEO of Tech Corp",
          },
          icon: "church",
        },
        {
          title: "Future of Technology",
          description: "Exploring emerging trends and innovations in tech",
          dateTime: "2024-04-15T10:30",
          speaker: {
            name: "Jane Smith",
            bio: "Tech Analyst",
          },
          icon: "book",
        },
        {
          title: "AI in Business",
          description: "Practical applications of AI in modern business",
          dateTime: "2024-04-15T13:00",
          speaker: {
            name: "Mike Johnson",
            bio: "AI Research Lead",
          },
          icon: "book",
        },
      ],
      maxAttendees: 200,
      status: "published",
      sections: [],
    };

    setEvent(mockEvent);
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div
      data-testid="event-page"
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${event.pageBanner})`,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backgroundBlendMode: "overlay",
      }}>
      <main className="flex-1 container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">{event.title}</h1>
              <p className="text-xl text-gray-200 mb-8 drop-shadow-md">{event.description}</p>
            </div>
            <Link href={`/events/${event.id}/guests`}>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-gray-600">
                Manage Guests
              </Button>
            </Link>
          </div>

          <Card className="bg-black/60 backdrop-blur-sm border-gray-800">
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center text-gray-200">
                  <Calendar className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-400">{formatDate(String(event.startDate))}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Clock className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-400">{event.startTime}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <MapPin className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-400">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">Program</h2>
                <div className="space-y-4">
                  {event.program.map((item, index) => (
                    <Card key={index} className="bg-black/40 border-gray-800">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-gray-300 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-gray-300">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="text-sm">{item.dateTime}</span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{item.speaker?.name}</span>
                            {item.speaker?.bio && <span className="text-gray-400"> - {item.speaker.bio}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-200">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>
                    {event.attendees} / {event.maxAttendees} attendees
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
