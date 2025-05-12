import { z } from "zod";

export const GuestResponseSchema = z.enum(["pending", "accepted", "declined"]);

export const GuestSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email().optional(),
  response: GuestResponseSchema,
  type: z.enum(["regular", "entourage", "sponsor"]),
  phoneNumber: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  message: z.string().optional(),
});

export type GuestResponse = z.infer<typeof GuestResponseSchema>;
export type Guest = z.infer<typeof GuestSchema>;
