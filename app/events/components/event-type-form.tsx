"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { EventTypeSchema } from "@/types/schema/Event.schema";
import { Cake, GraduationCap, Heart } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  type: EventTypeSchema,
});

export type EventTypeFormData = z.infer<typeof formSchema>;

interface EventTypeFormProps {
  onSubmit: (data: EventTypeFormData) => void;
  defaultValues?: Partial<EventTypeFormData>;
}

const eventTypes = [
  {
    id: "wedding",
    name: "Wedding",
    description: "Perfect for celebrating love and commitment",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "birthday",
    name: "Birthday",
    description: "Celebrate special moments and milestones",
    icon: Cake,
    image: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "seminar",
    name: "Seminar",
    description: "Professional events for learning and networking",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export function EventTypeForm({ onSubmit, defaultValues }: EventTypeFormProps) {
  const form = useForm<EventTypeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultValues?.type,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Choose Your Event Type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <FormItem key={type.id}>
                        <FormControl>
                          <RadioGroupItem value={type.id} className="peer sr-only" />
                        </FormControl>
                        <FormLabel className="flex flex-col cursor-pointer rounded-lg border-2 border-muted overflow-hidden hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <div className="relative h-48 w-full">
                            <Image src={type.image} alt={type.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-5 w-5" />
                              <p className="font-medium">{type.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </FormLabel>
                      </FormItem>
                    );
                  })}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </Form>
  );
}
