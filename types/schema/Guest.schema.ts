import { z } from "zod";

export const GuestResponseSchema = z.enum(["pending", "accepted", "declined"]);

export const GuestSchema = z.object({
  id: z.string().readonly(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email().optional(),
  response: GuestResponseSchema,
  type: z.enum(["regular", "entourage", "sponsor"]),
  phone_number: z.string().optional(),
  dietary_requirements: z.string().optional(),
  message: z.string().optional(),
  token: z.string().optional(),
});

export type GuestResponse = z.infer<typeof GuestResponseSchema>;
export type Guest = z.infer<typeof GuestSchema>;
