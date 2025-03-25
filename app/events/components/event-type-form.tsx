"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { EventTypeSchema } from "@/types/schema/Event.schema";
import { Cake, GraduationCap, Heart } from "lucide-react";

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
  },
  {
    id: "birthday",
    name: "Birthday",
    description: "Celebrate special moments and milestones",
    icon: Cake,
  },
  {
    id: "seminar",
    name: "Seminar",
    description: "Professional events for learning and networking",
    icon: GraduationCap,
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
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4">
                  {eventTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <FormItem key={type.id}>
                        <FormControl>
                          <RadioGroupItem value={type.id} className="peer sr-only" />
                        </FormControl>
                        <FormLabel className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                          <div className="flex items-center gap-4">
                            <Icon className="h-6 w-6" />
                            <div>
                              <p className="font-medium">{type.name}</p>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
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
