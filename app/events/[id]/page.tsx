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
import React, { Suspense, use } from "react";
import EventView from "./component/EventView";
// Dummy data following the updated schema
export const dummyEvent: Event = {
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
      icon: "church",
    },
    {
      title: "Cocktail Hour",
      description: "Drinks and appetizers",
      dateTime: "2024-12-31T19:00",
      icon: "glasses",
    },
    {
      title: "Reception",
      description: "Dinner and celebration",
      dateTime: "2024-12-31T20:00",
      icon: "book",
    },
    {
      title: "First Dance",
      description: "Our special moment",
      dateTime: "2024-12-31T21:00",
      icon: "book",
    },
  ],
  theme: {
    primary: "#FF4081",
    secondary: "#2196F3",
    accent: "#FFC107",
    background: "#FFFFFF",
  },
};

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

export default function EventPage({ params }: { params: Promise<{ id: number | undefined }> }) {
  const id = use(params);
  const router = useRouter();

  return (
    <Suspense>
      <EventView event={dummyEvent} id={Number(id)} />
    </Suspense>
  );
}
