import { z } from "zod";
import { Status } from "../index.types";

export const GuestResponseSchema = z.enum(["pending", "accepted", "declined"]);

export const GuestSchema = z.object({
  id: z.string().readonly(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().min(1).email().optional(),
  response: GuestResponseSchema,
  type: z.enum(["regular", "entourage", "sponsor"]),
  phone_number: z.string().optional(),
  dietary_requirements: z.string().optional(),
  message: z.string().optional(),
  token: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(Status.options as [string, ...string[]]),
});

export type GuestResponse = z.infer<typeof GuestResponseSchema>;
export type Guest = z.infer<typeof GuestSchema>;
