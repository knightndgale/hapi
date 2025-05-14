/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event, Section } from "@/types/schema/Event.schema";
import { Users, Calendar, MapPin, Clock, Church, Utensils, Music, Camera, Gift, Heart, User, Star, Trophy, Cake, Glasses, Mic, Book } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";

import { motion } from "framer-motion";
import { fadeIn, slideIn } from "@/lib/animations";
import React from "react";
import { useEvent } from "../context/event-context";

// Dummy data following the updated schema

const programIcons = {
  church: Church,
  utensils: Utensils,
  music: Music,
  heart: Heart,
  camera: Camera,
  gift: Gift,
  star: Star,
  trophy: Trophy,
  cake: Cake,
  glasses: Glasses,
  mic: Mic,
  book: Book,
  calendar: Calendar,
} as const;

function renderSection(section: Section) {
  switch (section.type) {
    case "content":
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="py-12 px-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.description && (
            <div
              className="prose max-w-none prose-lg prose-pink prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: section.description }}
            />
          )}
        </motion.div>
      );

    case "image":
      return (
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideIn} className="py-12 px-6">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
          {section.image && (
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg group">
              <Image src={section.image} alt={section.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
            </div>
          )}
        </motion.div>
      );

    default:
      return null;
  }
}

const EventView = () => {
  const { state } = useEvent();
  const { event, loading, error } = state;

  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center justify-center">
          <div data-testid="loading-spinner" className="animate-spin rounded-full border-4 border-gray-200 border-t-primary w-12 h-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Event not found</div>
      </div>
    );
  }

  return (
    <>
      <div
        className="min-h-screen bg-fixed"
        style={{
          backgroundColor: event.theme?.background || "white",
          backgroundImage: event.backgroundImage ? `url(${event.backgroundImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-testid="main-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[500px] w-full">
          <img
            role="banner"
            data-testid="event-banner"
            src={
              event.pageBanner
                ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${event.pageBanner}`
                : "https://images.unsplash.com/photo-1511795409834-432f7b1728f8?w=1600&auto=format&fit=crop&q=60"
            }
            alt={event.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <h1 className="text-5xl font-bold mb-4 text-shadow-lg">{event.title}</h1>
              <p className="text-xl opacity-90 max-w-2xl text-shadow">{event.description}</p>
            </div>
          </motion.div>
        </motion.div>

        <div className="container mx-auto py-12 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card data-testid="event-details-card" className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-xl font-semibold">Event Details</CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { icon: Calendar, text: format(new Date(event.startDate), "MMMM d, yyyy") },
                      { icon: Clock, text: format(new Date(`2000-01-01T${event.startTime}`), "h:mm a") },
                      { icon: MapPin, text: event.location },
                      { icon: Users, text: `${event.guests.length} / ${event.maxAttendees} Guests` },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 transition-colors duration-300">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span data-testid={`${item.icon}-text`} className="text-lg">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {event.program && event.program.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="text-xl font-semibold flex items-center gap-3 pb-2">
                      <Calendar className="h-6 w-6 text-primary" />
                      <span>Program Schedule</span>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-10">
                        {event.program.map((item, index) => (
                          <div key={index} className="relative flex gap-6 group">
                            {/* Timeline dot */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center relative z-10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                              {item.icon && programIcons[item.icon as keyof typeof programIcons] ? (
                                React.createElement(programIcons[item.icon as keyof typeof programIcons], { className: "h-7 w-7 text-primary" })
                              ) : (
                                <Calendar className="h-7 w-7 text-primary" />
                              )}
                            </div>

                            <div className="flex-grow bg-white/60 rounded-xl p-6 shadow-sm transition-all duration-300 group-hover:bg-white/80 group-hover:shadow-md">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h3 className="font-semibold text-xl text-primary">{item.title}</h3>
                                <div className="flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full">
                                  <Clock className="h-4 w-4 text-primary" />
                                  <p className="text-sm font-medium text-primary">{format(new Date(item.dateTime), "h:mm a")}</p>
                                </div>
                              </div>

                              <p className="text-base mt-3 text-muted-foreground leading-relaxed">{item.description}</p>

                              {item.speaker && (
                                <div className="mt-4 pt-4 border-t border-primary/10">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium flex items-center gap-2">
                                        <span className="text-primary">Speaker:</span>
                                        {item.speaker.name}
                                      </p>
                                      {item.speaker.bio && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.speaker.bio}</p>}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-lg font-semibold">Quick Actions</CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => router.push(`/events/${state.event?.id}/guests`)}>
                    Manage Guests
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => router.push(`/events/${state.event?.id}/edit`)}>
                    Edit Event
                  </Button>
                </CardContent>
              </Card>

              {event.rsvp && (
                <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => router.push(`/invite/${event.id}/creatorView`)}>
                  <CardHeader className="text-lg font-semibold">RSVP Details</CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium">{event.rsvp.title}</p>
                    <p className="text-sm text-muted-foreground">{event.rsvp.subtitle}</p>
                    {event.rsvp.deadline && <p className="text-sm">Deadline: {format(new Date(event.rsvp.deadline), "MMMM d, yyyy")}</p>}
                    <p className="text-sm text-blue-600 mt-2">Click to view your RSVP</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12 space-y-8">
            {event.sections.map((section) => (
              <div key={section.id}>{renderSection(section)}</div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EventView;
