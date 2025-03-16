import { z } from "zod";

export const ThemeSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
});

export type Theme = z.infer<typeof ThemeSchema>;
