import { z } from "zod";

export const SpeakerSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
});

export type Speaker = z.infer<typeof SpeakerSchema>;
