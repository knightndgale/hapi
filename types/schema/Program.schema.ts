import { z } from "zod";
import { SpeakerSchema } from "./Speaker.schema";

export const ProgramItemSchema = z.object({
  title: z.string({ message: "Title is required" }),
  description: z.string({ message: "Description is required" }),
  dateTime: z.string({ message: "Date and time is required" }),
  speaker: SpeakerSchema.optional(),
});

export type ProgramItem = z.infer<typeof ProgramItemSchema>;
