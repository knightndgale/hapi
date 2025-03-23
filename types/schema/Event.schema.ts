import { z } from "zod";
import { MediaSchema } from "./MediaSchema";
import { ProgramItemSchema } from "./Program.schema";
import { ThemeSchema } from "./Theme.schema";

export const EventTypeSchema = z.enum(["wedding", "birthday", "seminar"]);

export type EventType = z.infer<typeof EventTypeSchema>;

const RSVPSchema = z.object({
  logo: z.string().url().optional(),
  title_as_image: z.string().url().optional(),
  title: z.string(),
  subtitle: z.string(),
  invitation: z.string(),
  accept_text: z.string(),
  decline_text: z.string(),
  backgroundImage: z.string().url().optional(),
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
  media: MediaSchema,
  program: z.array(ProgramItemSchema),
  attendees: z.number(),
  maxAttendees: z.number(),
  rsvp: RSVPSchema.optional(),
});

export type Event = z.infer<typeof EventSchema>;
export type RSVP = z.infer<typeof RSVPSchema>;

export const EventTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["wedding", "birthday", "seminar"]),
  description: z.string(),
  preview: z.string().url(),
  theme: ThemeSchema,
});

export type EventTemplate = z.infer<typeof EventTemplateSchema>;
