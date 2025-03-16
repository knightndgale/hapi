import { z } from "zod";

export const MediaSchema = z
  .object({
    type: z.enum(["video", "image"]),
    url: z.string(),
  })
  .optional();

export type Media = z.infer<typeof MediaSchema>;
