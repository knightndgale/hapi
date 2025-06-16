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

// Update animation variants at the top of the file
const fadeInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const EventDetailsSection = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="space-y-4">
        <h3 className="text-xl md:text-2xl font-medium text-center md:text-left">JUNE 30, 2025 | MONDAY | 2:00 PM</h3>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="space-y-6 md:space-y-8">
        <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <Church className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <h4 className="text-xl md:text-2xl font-semibold text-primary">Ceremony</h4>
          </div>
          <div className="space-y-3">
            <p className="text-xl md:text-2xl font-semibold tracking-wide">ST. MICHAEL THE ARCHANGEL PARISH</p>
            <p className="text-lg md:text-xl text-muted-foreground">Barangay Heights, General Santos City</p>
          </div>
        </div>

        <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-4">
            <Utensils className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <h4 className="text-xl md:text-2xl font-semibold text-primary">Reception</h4>
          </div>
          <div className="space-y-3">
            <p className="text-xl md:text-2xl font-semibold tracking-wide">GRAND PALMERA HOTEL</p>
            <p className="text-lg md:text-xl text-muted-foreground">Barangay Baluan, General Santos</p>
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative h-[300px] md:h-[500px] w-full">
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
                <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-shadow-lg text-center md:text-left tracking-tight">{event.title}</h1>
                <p className="text-lg md:text-2xl opacity-90 max-w-3xl text-shadow text-center md:text-left leading-relaxed">{event.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
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
                          {/* <p className="font-medium">{event.rsvp.title}</p>
                          <p className="text-sm text-muted-foreground">{event.rsvp.subtitle}</p> */}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center md:text-left tracking-tight">Wedding Timeline</h2>
                <div className="grid grid-cols-1 gap-8 md:gap-10">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-24 md:w-28 text-base font-semibold text-primary">2:00 PM</div>
                      <div className="w-auto">
                        <p className="text-lg md:text-xl font-semibold mb-1">Church Ceremony Begins</p>
                        <p className="text-base text-muted-foreground">ST. MICHAEL THE ARCHANGEL PARISH</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-24 md:w-28 text-base font-semibold text-primary">3:30 PM</div>
                      <div>
                        <p className="text-lg md:text-xl font-semibold mb-1">Photo Session</p>
                        <p className="text-base text-muted-foreground">Church Grounds</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-24 md:w-28 text-base font-semibold text-primary">4:00 PM</div>
                      <div>
                        <p className="text-lg md:text-xl font-semibold mb-1">Reception</p>
                        <p className="text-base text-muted-foreground">GRAND PALMERA HOTEL</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-24 md:w-28 text-base font-semibold text-primary">6:00 PM</div>
                      <div>
                        <p className="text-lg md:text-xl font-semibold mb-1">Dinner</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 md:gap-6">
                      <div className="w-24 md:w-28 text-base font-semibold text-primary">7:00 PM</div>
                      <div>
                        <p className="text-lg md:text-xl font-semibold mb-1">Party</p>
                        <p className="text-base text-muted-foreground">Dance and celebrate with the newlyweds</p>
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
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center tracking-tight">Attire Guide</h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-4 text-center">For Sponsors</h3>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center">
                We would love to see you in your semi-formal / formal that suits in our color motif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative  rounded-lg overflow-hidden">
                <Image src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/f47dce48-fcfa-461b-b3dd-c600aeeeaabc" alt="Attire Guide Example 1" width={800} height={1200} />
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <Image src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/da027bd1-8796-4fe6-a446-99355d31f874" alt="Attire Guide Example 2" width={800} height={1200} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">A Note on Gifts</h3>
              <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                With all that we have, we&apos;ve been truly blessed, your present and prayers are all that we request, but if you desire to give us nonetheless, monetary gift is one we suggest.
              </p>
            </div>
          </motion.div>

          {/* The Finer Section */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold  text-center tracking-tight">The Finer Details</h2>
            <div className="relative w-full rounded-lg ">
              <Image src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/7f1e8413-db4a-4711-adde-a40bd5122cb2" alt="The Finer Details" width={1280} height={650} />
            </div>
          </motion.div>

          {/* Reception Section */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center tracking-tight">Reception</h2>
            <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6 md:p-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <h4 className="text-xl md:text-2xl font-semibold text-primary">Grand Palmera Hotel</h4>
              </div>
              <div className="space-y-3 text-center">
                <p className="text-lg md:text-xl text-muted-foreground">Purok San Vicente, Barangay Baluan, General Santos</p>
              </div>
              <div className="w-full h-[450px] rounded-lg overflow-hidden mt-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3967.08927828654!2d125.21566!3d6.118684!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f775ab46710899%3A0x4ac3bb7c65ff79f6!2sGrand%20Palmera%20Hotel!5e0!3m2!1sen!2sph!4v1750000223346!5m2!1sen!2sph"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Grand Palmera Hotel Location"
                />
              </div>
            </div>
          </motion.div>

          {/* Dress Code Section */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-8 px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center tracking-tight">Dress Code</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4">
                <div className="space-y-4">
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    We kindly encourage our guests to wear semi-formal attire with these colors on our special day. Let&apos;s create a harmonious and elegant atmosphere together by incorporating our
                    chosen color palette into your outfits.
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    For our gentlemen, we suggest a well-tailored suit or a crisp barong paired with dress shoes. Ladies, you may opt for cocktail dresses, elegant skirts, or formal Filipiniana attire
                    that complements our color scheme.
                  </p>
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Your presence and participation in our color theme will make our celebration even more special and create beautiful memories captured in our photographs. We can&apos;t wait to see
                    everyone looking their best in our chosen colors!
                  </p>
                </div>
                <div className="relative w-full rounded-lg">
                  <Image
                    src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/137d0225-d255-4259-ae07-41768a384dcd"
                    alt="Dress Code Colors"
                    width={1105}
                    height={100}
                    className="w-[1105px] h-[140px]"
                  />
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full rounded-lg">
                  <Image
                    src="https://hapi.j9apyz9bfea84.ap-southeast-1.cs.amazonlightsail.com/hapi/assets/64ef708b-a592-4fa7-8b1a-e46a907a9d78"
                    alt="Dress Code Example 2"
                    width={422}
                    height={100}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* A Note on Gifts Section */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-semibold mb-4">A Note on Gifts</h3>
              <div className="space-y-4">
                <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                  With all that we have, we&apos;ve been truly blessed, your present and prayers are all that we request, but if you desire to give us nonetheless, monetary gift is one we suggest.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                  Your presence at our celebration is the greatest gift we could ask for. However, if you wish to give us something more, a monetary gift would be greatly appreciated as we begin our
                  journey together.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground italic leading-relaxed">
                  We are grateful for your love and support as we start this new chapter in our lives. Your blessings and well wishes mean the world to us.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RSVP Section */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center tracking-tight">RSVP</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-8 md:p-10 text-center">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">We have reserved _seats(s) for you.</p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">A favor of your reply is request on or before June 21, 2025.</p>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">Message at +639 984-998-393 or message as thru Facebook or messenger</p>
              </div>
            </div>
          </motion.div>

          {/* Bride - Groom Nuptials */}
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center tracking-tight">Bride - Groom Nuptials</h2>
              <h4 className="text-3xl md:text-4xl font-bold mb-8 md:mb-10 text-center tracking-tight">To guide us in our way</h4>
            </div>
          </motion.div>

          {/* Principal Sponsors Section */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <motion.div variants={fadeInUp} className="space-y-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-primary mb-6">Principal Sponsors</h3>
              <p className="text-lg md:text-xl text-center text-muted-foreground mb-8">To stand as principal witness in our exchange of vows</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4">
                  <div className="space-y-3 text-center">
                    <p className="text-base md:text-lg">Hazel S. Baccarro</p>
                    <p className="text-base md:text-lg">Nita B. Sambile</p>
                    <p className="text-base md:text-lg">Mary Verna Gimena</p>
                    <p className="text-base md:text-lg">Genevhra E. Climaco</p>
                    <p className="text-base md:text-lg">Elva Palma</p>
                    <p className="text-base md:text-lg">Ma. Elena Villanueva</p>
                    <p className="text-base md:text-lg">Joji Huliganga</p>
                    <p className="text-base md:text-lg">Belen Y. Bacongco</p>
                    <p className="text-base md:text-lg">Arlen A. Bañaga</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-3 text-center">
                    <p className="text-base md:text-lg">Chirstian Mondero</p>
                    <p className="text-base md:text-lg">Dee Tan</p>
                    <p className="text-base md:text-lg">Teofilo Palma</p>
                    <p className="text-base md:text-lg">Edwin Bacarro</p>
                    <p className="text-base md:text-lg">Rolly Villanueva</p>
                    <p className="text-base md:text-lg">Leo Huliganga</p>
                    <p className="text-base md:text-lg">Armando Gimena</p>
                    <p className="text-base md:text-lg">Jessie D. Bacongco</p>
                    <p className="text-base md:text-lg">Michel Balabagno</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xl md:text-2xl font-semibold text-center">Best Man</h4>
                  <div className="space-y-2 text-center">
                    <p className="text-base md:text-lg">Billy Soriano</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xl md:text-2xl font-semibold text-center">Maid of Honor</h4>
                  <div className="space-y-2 text-center">
                    <p className="text-base md:text-lg">Rosarie D. Bantolo</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Secondary Sponsors */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="space-y-8 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-primary mb-6">Secondary Sponsors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl md:text-2xl font-semibold text-center">Candle</h4>
                <div className="space-y-2 text-center">
                  <p className="text-lg md:text-xl">Rosarie D. Bantolo</p>
                  <p className="text-lg md:text-xl">Billy Soriano</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl md:text-2xl font-semibold text-center">Cord</h4>
                <div className="space-y-2 text-center">
                  <p className="text-lg md:text-xl">Ronalyn B. Ortiz</p>
                  <p className="text-lg md:text-xl">Mark Ortiz</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl md:text-2xl font-semibold text-center">Veil</h4>
              <div className="space-y-2 text-center">
                <p className="text-lg md:text-xl">Mary Roxanne S. Gonzales</p>
                <p className="text-lg md:text-xl">Rodel Gonzales</p>
              </div>
            </div>
          </motion.div>

          {/* Love, Treasure, and Faith */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="space-y-8 mb-12">
            <h3 className="text-2xl md:text-3xl font-semibold text-center text-primary mb-6">To carry our symbol of Love, Treasure, and Faith</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl md:text-2xl font-semibold text-center">Ring Bearer</h4>
                <div className="space-y-2 text-center">
                  <p className="text-lg md:text-xl">George Phil M. Bobon</p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl md:text-2xl font-semibold text-center">Coin Bearer</h4>
                <div className="space-y-2 text-center">
                  <p className="text-lg md:text-xl">Mekael B. Ortiz</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl md:text-2xl font-semibold text-center">Bible Bearer</h4>
              <div className="space-y-2 text-center">
                <p className="text-lg md:text-xl">Rongelo B. Ortiz</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl md:text-2xl font-semibold text-center">Flower Girls</h4>
              <div className="space-y-2 text-center">
                <p className="text-lg md:text-xl">Gelyn Vankate M. Bobon</p>
                <p className="text-lg md:text-xl">Vonne Trishia Mendoza</p>
              </div>
            </div>
          </motion.div>

          {/* Entourage Section */}
          <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 }} className="container mx-auto py-6 md:py-12 px-4 md:px-6">
            <div className="space-y-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-center text-primary mb-6">Entourage</h3>
              <div className="max-w-2xl mx-auto">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xl md:text-2xl font-semibold text-center">Parents of the Groom</h4>
                    <div className="space-y-2 text-center">
                      <p className="text-lg md:text-xl">Billy Soriano Sr.</p>
                      <p className="text-lg md:text-xl">Virgencita J. Soriano</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl md:text-2xl font-semibold text-center">Parents of the Bride</h4>
                    <div className="space-y-2 text-center">
                      <p className="text-lg md:text-xl">Nelfa D. Bantolo</p>
                      <p className="text-lg md:text-xl">Romeo M. Bantolo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default EventView;
