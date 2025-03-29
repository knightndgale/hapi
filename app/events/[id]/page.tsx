"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, EventType, Section } from "@/types/schema/Event.schema";
import { Users, Calendar, MapPin, Clock, Church, Utensils, Music, Camera, Gift, Heart } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Navbar } from "@/components/navbar";
import { cn } from "@/lib/utils";

const eventTypeImages: Record<EventType, string> = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=60",
  birthday: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=1600&auto=format&fit=crop&q=60",
  seminar: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&auto=format&fit=crop&q=60",
};

// Dummy data following the updated schema
const dummyEvent: Event = {
  id: "1",
  title: "John & Jane's Wedding",
  description: "Join us in celebrating our special day!",
  startDate: new Date("2024-12-31"),
  endDate: new Date("2024-12-31"),
  startTime: "18:00",
  endTime: "18:00",
  location: "Grand Ballroom, Luxury Hotel",
  type: "wedding",
  templateId: "template-1",
  attendees: 0,
  maxAttendees: 100,
  status: "published",
  backgroundImage: "https://images.unsplash.com/photo-1535378146586-dad15573cb2e?q=80&w=3088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  pageBanner: "https://images.unsplash.com/photo-1545071677-f95c441049f1?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  sections: [
    {
      id: "1",
      type: "content",
      title: "Our Love Story",
      description: `
        <p class="mb-4">In a world of endless possibilities, our paths crossed in the most unexpected way. What started as a chance encounter blossomed into a beautiful journey of love, trust, and understanding.</p>
        <p class="mb-4">Every moment we've shared has been a testament to the power of love and the beauty of finding your perfect match. From our first date to this moment, we've grown together, learned together, and built a foundation that will last a lifetime.</p>
        <p>We are excited to begin this new chapter of our lives together, surrounded by the love and support of our family and friends.</p>
      `,
    },
    {
      id: "2",
      type: "image",
      title: "Our Journey Together",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    },
    {
      id: "3",
      type: "content",
      title: "Wedding Details",
      description: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-2">
            <Church className="h-5 w-5 text-primary" />
            <span>Ceremony at Grand Ballroom</span>
          </div>
          <div class="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>December 31, 2024</span>
          </div>
          <div class="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>6:00 PM - 11:00 PM</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Luxury Hotel, City Center</span>
          </div>
        </div>
      `,
    },
    {
      id: "4",
      type: "content",
      title: "What to Expect",
      description: `
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <Music className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Live Music & Entertainment</h3>
              <p>Enjoy an evening of beautiful melodies and entertainment that will make your celebration memorable.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Utensils className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Fine Dining Experience</h3>
              <p>Indulge in a carefully curated menu featuring the finest cuisine prepared by our expert chefs.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Camera className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Professional Photography</h3>
              <p>Capture every precious moment with our professional photography team.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Gift className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 class="font-semibold">Wedding Favors</h3>
              <p>Take home a special token of our appreciation for being part of our special day.</p>
            </div>
          </div>
        </div>
      `,
    },
  ],
  program: [
    {
      title: "Ceremony",
      description: "Wedding ceremony",
      dateTime: "2024-12-31T18:00",
      speaker: {
        name: "Reverend Smith",
        bio: "Our beloved pastor",
      },
    },
    {
      title: "Cocktail Hour",
      description: "Drinks and appetizers",
      dateTime: "2024-12-31T19:00",
    },
    {
      title: "Reception",
      description: "Dinner and celebration",
      dateTime: "2024-12-31T20:00",
    },
    {
      title: "First Dance",
      description: "Our special moment",
      dateTime: "2024-12-31T21:00",
    },
  ],
  theme: {
    primary: "#FF4081",
    secondary: "#2196F3",
    accent: "#FFC107",
    background: "#FFFFFF",
  },
};

function renderSection(section: Section) {
  switch (section.type) {
    case "content":
      return (
        <div className="py-12 px-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.description && <div className="prose max-w-none prose-lg prose-pink" dangerouslySetInnerHTML={{ __html: section.description }} />}
        </div>
      );

    case "image":
      return (
        <div className="py-12 px-6">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.image && (
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image src={section.image} alt={section.title} fill className="object-cover" />
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const event = dummyEvent;

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen"
        style={{
          backgroundColor: event.theme?.background || "white",
          backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
        data-testid="main-container">
        <div className="relative h-[500px] w-full">
          <Image
            role="banner"
            src={event.pageBanner || "https://images.unsplash.com/photo-1511795409834-432f7b1728f8?w=1600&auto=format&fit=crop&q=60"}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
              <p className="text-xl opacity-90 max-w-2xl">{event.description}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-lg font-semibold">Event Details</CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{format(new Date(event.startDate), "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{format(new Date(`2000-01-01T${event.startTime}`), "h:mm a")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {event.attendees} / {event.maxAttendees} Guests
                    </span>
                  </div>
                </CardContent>
              </Card>

              {event.program.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Program Schedule</span>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20" />

                      <div className="space-y-8">
                        {event.program.map((item, index) => (
                          <div key={index} className="relative flex gap-6">
                            {/* Timeline dot */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center relative z-10">
                              {index === 0 && <Church className="h-6 w-6 text-primary" />}
                              {index === 1 && <Utensils className="h-6 w-6 text-primary" />}
                              {index === 2 && <Music className="h-6 w-6 text-primary" />}
                              {index === 3 && <Heart className="h-6 w-6 text-primary" />}
                            </div>

                            <div className="flex-grow bg-white/50 rounded-lg p-4 shadow-sm">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3 className="font-semibold text-lg text-primary">{item.title}</h3>
                                <p className="text-sm font-medium text-muted-foreground">{format(new Date(item.dateTime), "h:mm a")}</p>
                              </div>

                              <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>

                              {item.speaker && (
                                <div className="mt-3 pt-3 border-t border-primary/10">
                                  <p className="text-sm font-medium flex items-center gap-2">
                                    <span className="text-primary">Speaker:</span>
                                    {item.speaker.name}
                                  </p>
                                  {item.speaker.bio && <p className="text-sm text-muted-foreground mt-1">{item.speaker.bio}</p>}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="text-lg font-semibold">Quick Actions</CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => router.push(`/events/${params.id}/guests`)}>
                    Manage Guests
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push(`/events/${params.id}/edit`)}>
                    Edit Event
                  </Button>
                </CardContent>
              </Card>

              {event.rsvp && (
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader className="text-lg font-semibold">RSVP Details</CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{event.rsvp.title}</p>
                    <p className="text-sm text-muted-foreground">{event.rsvp.subtitle}</p>
                    {event.rsvp.deadline && <p className="text-sm">Deadline: {format(new Date(event.rsvp.deadline), "MMMM d, yyyy")}</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Custom Sections */}
          <div className="mt-8 space-y-8">
            {event.sections.map((section) => (
              <div key={section.id}>{renderSection(section)}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
