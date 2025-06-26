import { z } from "zod";
import { Status } from "../index.types";

export const GuestResponseSchema = z.enum(["pending", "accepted", "declined"]);

export const GuestAttendanceStatusSchema = z.enum(["not_admitted", "admitted"]);

export const GuestSchema = z.object({
  id: z.string().readonly(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  response: GuestResponseSchema,
  type: z.enum(["regular", "entourage", "sponsor"]),
  phone_number: z.string().optional(),
  dietary_requirements: z.string().optional(),
  message: z.string().optional(),
  token: z.string().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(Status.options as [string, ...string[]]),
  attendance_status: GuestAttendanceStatusSchema.optional().default("not_admitted"),
});

export type GuestResponse = z.infer<typeof GuestResponseSchema>;
export type GuestAttendanceStatus = z.infer<typeof GuestAttendanceStatusSchema>;
export type Guest = z.infer<typeof GuestSchema>;
