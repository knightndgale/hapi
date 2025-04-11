import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email("Invalid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export const SignUpSchema = UserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignUp = z.infer<typeof SignUpSchema>;

export const AuthSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type User = z.infer<typeof UserSchema>;
export type Auth = z.infer<typeof AuthSchema>;
