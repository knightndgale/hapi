import { z } from "zod";

import { ProgramItemSchema } from "./Program.schema";
import { ThemeSchema } from "./Theme.schema";
import { GuestSchema } from "./Guest.schema";

export const EventTypeSchema = z.enum(["wedding", "birthday", "seminar"], { message: "Please select an event type" });

export type EventType = z.infer<typeof EventTypeSchema>;

export const EventStatusSchema = z.enum(["draft", "published", "archived"]);

export type EventStatus = z.infer<typeof EventStatusSchema>;

export const RSVPSchema = z.object({
  id: z.string().readonly().optional(),
  logo: z.string().uuid().optional(),
  title_as_image: z.string().uuid().optional(),
  title: z.string({ message: "Title is required" }),
  subtitle: z.string({ message: "Subtitle is required" }),
  invitation: z.string({ message: "Invitation message is required" }),
  accept_text: z.string({ message: "Accept text is required" }),
  decline_text: z.string({ message: "Decline text is required" }),
  backgroundImage: z.string().uuid().optional(),
  deadline: z.string().optional(),
});

export const SectionSchema = z.object({
  id: z.string().readonly().optional().nullable(),
  section_id: z.string(),
  type: z.enum(["content", "image"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const EventSchema = z.object({
  id: z.string().readonly(),
  title: z.string({ message: "Title is required" }).min(1, "Title is required"),
  description: z.string({ message: "Description is required" }).min(1, "Description is required"),
  location: z.string({ message: "Location is required" }).min(1, "Location is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  startTime: z.string({ message: "Start time is required" }),
  endTime: z.string({ message: "End time is required" }),
  type: EventTypeSchema,
  templateId: z.string(),
  guests: z.array(GuestSchema).default([]),
  maxAttendees: z.number(),
  rsvp: RSVPSchema.optional(),
  status: EventStatusSchema,
  pageBanner: z.string().uuid().optional(),
  sections: z.array(SectionSchema).default([]),
  theme: ThemeSchema.optional(),
  backgroundImage: z.string().url().optional(),
  programs: z.array(ProgramItemSchema).default([]),
  created_by: z.string(),
});

export type Event = z.infer<typeof EventSchema>;
export type RSVP = z.infer<typeof RSVPSchema>;
export type Section = z.infer<typeof SectionSchema>;

export const EventTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: EventTypeSchema,
  description: z.string(),
  preview: z.string().url(),
  theme: ThemeSchema,
});

export type EventTemplate = z.infer<typeof EventTemplateSchema>;
