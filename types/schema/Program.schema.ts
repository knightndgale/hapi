import { z } from "zod";
import { SpeakerSchema } from "./Speaker.schema";

export const ProgramItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  dateTime: z.string(),
  speaker: SpeakerSchema,
});

export type ProgramItem = z.infer<typeof ProgramItemSchema>;
