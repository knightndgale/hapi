"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Event } from "@/types/event"

interface EventDisplayProps {
  id: string
}

export function EventDisplay({ id }: EventDisplayProps) {
  const [event, setEvent] = useState<Event | null>(null)

  useEffect(() => {
    // Simulate fetching event data
    const mockEvent: Event = {
      id,
      title: "Tech Conference 2024",
      description: "Join us for an exciting day of technology talks and networking.",
      date: "2024-04-15",
      time: "09:00",
      location: "Convention Center",
      type: "seminar",
      templateId: "seminar-professional",
      attendees: 120,
      media: {
        type: "image",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
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
        {
          title: "Future of Technology",
          description: "Exploring emerging trends and innovations in tech",
          dateTime: "2024-04-15T10:30",
          speaker: {
            name: "Jane Smith",
            bio: "Tech Analyst",
          },
        },
        {
          title: "AI in Business",
          description: "Practical applications of AI in modern business",
          dateTime: "2024-04-15T13:00",
          speaker: {
            name: "Mike Johnson",
            bio: "AI Research Lead",
          },
        },
      ],
      maxAttendees: 200,
    }

    setEvent(mockEvent)
  }, [id])

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div 
      className="min-h-screen flex flex-col bg-cover bg-center bg-fixed"
      style={{ 
        backgroundImage: `url(${event.media?.url})`,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              {event.title}
            </h1>
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
              {event.description}
            </p>
          </div>

          <Card className="bg-black/60 backdrop-blur-sm border-gray-800">
            <CardContent className="p-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center text-gray-200">
                  <Calendar className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-200">
                  <Clock className="mr-3 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-400">{event.time}</p>
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
                        <h3 className="text-xl font-semibold mb-2 text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-300 mb-4">{item.description}</p>
                        <div className="flex items-center justify-between text-gray-300">
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span className="text-sm">
                              {new Date(item.dateTime).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">{item.speaker.name}</span>
                            {item.speaker.bio && (
                              <span className="text-gray-400"> - {item.speaker.bio}</span>
                            )}
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
                  <span>{event.attendees} / {event.maxAttendees} attendees</span>
                </div>
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-gray-600">
                  Join Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}