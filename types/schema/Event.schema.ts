import { z } from "zod";
import { MediaSchema } from "./MediaSchema";
import { ProgramItemSchema } from "./Program.schema";
import { ThemeSchema } from "./Theme.schema";

export const EventTypeSchema = z.enum(["wedding", "birthday", "seminar"]);

export type EventType = z.infer<typeof EventTypeSchema>;

export const EventStatusSchema = z.enum(["draft", "published", "archived"]);

export type EventStatus = z.infer<typeof EventStatusSchema>;

export const RSVPSchema = z.object({
  logo: z.string().url().optional(),
  title_as_image: z.string().url().optional(),
  title: z.string(),
  subtitle: z.string(),
  invitation: z.string(),
  accept_text: z.string(),
  decline_text: z.string(),
  backgroundImage: z.string().url().optional(),
  deadline: z.string().optional(),
});

export const SectionSchema = z.object({
  id: z.string(),
  type: z.enum(["content", "image"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const EventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  type: EventTypeSchema,
  templateId: z.string(),
  attendees: z.number(),
  maxAttendees: z.number(),
  rsvp: RSVPSchema.optional(),
  status: EventStatusSchema,
  backgroundImage: z.string().url().optional(),
  pageBanner: z.string().url().optional(),
  sections: z.array(SectionSchema).default([]),
  theme: ThemeSchema.optional(),
  program: z.array(ProgramItemSchema),
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
