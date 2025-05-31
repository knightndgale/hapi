import { Church, Utensils, Music, Heart, Camera, Gift, Star, Trophy, Cake, Glasses, Mic, Book, Calendar, type LucideIcon } from "lucide-react";
import { z } from "zod";

export const programIcons = {
  church: Church,
  school: Utensils,
  hospital: Music,
  business: Heart,
  other: Camera,
  gift: Gift,
  star: Star,
  trophy: Trophy,
  cake: Cake,
  glasses: Glasses,
  mic: Mic,
  book: Book,
  calendar: Calendar,
} as const;

export type ProgramIcon = keyof typeof programIcons;

export const ProgramIconSchema = z.object({
  name: z.enum(Object.keys(programIcons) as [ProgramIcon, ...ProgramIcon[]]),
});

export const getProgramIcon = (icon: ProgramIcon): LucideIcon => programIcons[icon];
