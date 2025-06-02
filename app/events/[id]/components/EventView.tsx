/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";

import { Calendar, Church, Utensils, Music, Camera, Gift, Heart, Star, Trophy, Cake, Glasses, Mic, Book } from "lucide-react";

import { motion } from "framer-motion";

import React from "react";
import { useEvent } from "../context/event-context";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
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

const EventDetailsSection = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="space-y-4">
        <h3 className="text-xl md:text-2xl font-medium text-center md:text-left">JUNE 30, 2025 | MONDAY | 2:00 PM</h3>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="space-y-6 md:space-y-8">
        <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Church className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <h4 className="text-base md:text-lg font-medium text-primary">Ceremony</h4>
          </div>
          <div className="space-y-2">
            <p className="text-lg md:text-xl font-medium">ST. MICHAEL THE ARCHANGEL PARISH</p>
            <p className="text-base md:text-lg">Barangay Heights, General Santos City</p>
          </div>
        </div>

        <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 md:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            <h4 className="text-base md:text-lg font-medium text-primary">Reception</h4>
          </div>
          <div className="space-y-2">
            <p className="text-lg md:text-xl font-medium">GRAND PALMERA HOTEL</p>
            <p className="text-base md:text-lg">Barangay Baluan, General Santos</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const EventView = () => {
  const { state } = useEvent();
  const { event, loading, error, user } = state;
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative h-[300px] md:h-[500px] w-full">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <div className="container mx-auto">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-shadow-lg text-center md:text-left">{event.title}</h1>
                <p className="text-base md:text-xl opacity-90 max-w-2xl text-shadow text-center md:text-left">{event.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="container mx-auto py-6 md:py-12 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <EventDetailsSection />
            <div className={`grid grid-cols-1 ${!!user ? "md:grid-cols-3" : "md:grid-cols-2"} gap-4`}>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/ee183a58-6be2-410a-91f7-d0f046a8a837"
                  alt="Wedding Decoration 1"
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/c8b99cdb-dbfe-44ec-992b-1638d815ba59"
                  alt="Wedding Decoration 2"
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full"
                />
              </div>

              {!!user && (
                <>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="space-y-4 md:space-y-6">
                    <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                      <CardHeader className="text-base md:text-lg font-semibold">Quick Actions</CardHeader>
                      <CardContent className="space-y-3 md:space-y-4">
                        <Button className="w-full" onClick={() => router.push(`/events/${state.event?.id}/guests`)}>
                          Manage Guests
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => toast.error("This feature is not available yet")}>
                          Edit Event
                        </Button>
                      </CardContent>
                    </Card>

                    {event.rsvp && (
                      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => router.push(`/invite/${event.id}/creatorView`)}>
                        <CardHeader className="text-base md:text-lg font-semibold">RSVP Details</CardHeader>
                        <CardContent className="space-y-2">
                          <p className="font-medium">{event.rsvp.title}</p>
                          <p className="text-sm text-muted-foreground">{event.rsvp.subtitle}</p>
                          {event.rsvp.deadline && <p className="text-sm">Deadline: {format(new Date(event.rsvp.deadline), "MMMM d, yyyy")}</p>}
                          <p className="text-sm text-blue-600 mt-2">Click to view your RSVP</p>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </div>

          <div className="container mx-auto py-6 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8 text-center md:text-left">Wedding Timeline</h2>
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-20 md:w-24 text-sm font-medium">2:00 PM</div>
                      <div className="w-auto">
                        <p className="font-medium">Church Ceremony Begins</p>
                        <p className="text-sm text-muted-foreground">ST. MICHAEL THE ARCHANGEL PARISH</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-20 md:w-24 text-sm font-medium">3:30 PM</div>
                      <div>
                        <p className="font-medium">Photo Session</p>
                        <p className="text-sm text-muted-foreground">Church Grounds</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-20 md:w-24 text-sm font-medium">4:00 PM</div>
                      <div>
                        <p className="font-medium">Reception</p>
                        <p className="text-sm text-muted-foreground">GRAND PALMERA HOTEL</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-20 md:w-24 text-sm font-medium">6:00 PM</div>
                      <div>
                        <p className="font-medium">Dinner</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-20 md:w-24 text-sm font-medium">7:00 PM</div>
                      <div>
                        <p className="font-medium">Party</p>
                        <p className="text-sm text-muted-foreground">Dance and celebrate with the newlyweds</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="relative h-[250px] md:h-[400px] w-full rounded-lg overflow-hidden">
                  <Image
                    src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/ad8d70e5-a6bc-49a3-a25a-f799b969d26d"
                    alt="Wedding Decoration 1"
                    width={1920}
                    height={1080}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attire Guide Section */}
          <div className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8 text-center ">Attire Guide</h2>
                <h3 className="text-xl md:text-2xl font-medium text-primary">For Sponsors</h3>
                <p className="text-base md:text-lg text-muted-foreground">We would love to see you in your semi-formal / formal that suits in our color motif</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/ee183a58-6be2-410a-91f7-d0f046a8a837"
                    alt="Attire Guide Example 1"
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
                  <Image
                    src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/c8b99cdb-dbfe-44ec-992b-1638d815ba59"
                    alt="Attire Guide Example 2"
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-medium">A Note on Gifts</h3>
                <p className="text-base md:text-lg text-muted-foreground italic">
                  With all that we have, we&apos;ve been truly blessed, your present and prayers are all that we request, but if you desire to give us nonetheless, monetary gift is one we suggest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventView;
