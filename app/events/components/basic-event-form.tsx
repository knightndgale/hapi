"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramItemModal } from "./program-item-modal";
import { ProgramItem, ProgramItemSchema } from "@/types/schema/Program.schema";

const formSchema = z.object({
  name: z.string({ required_error: "Event name is required" }),
  description: z.string({ required_error: "Description is required" }),
  location: z.string({ required_error: "Location is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string({ required_error: "Start time is required" }),
  endTime: z.string({ required_error: "End time is required" }),
  program: z.array(ProgramItemSchema),
});

export type FormData = z.infer<typeof formSchema>;

interface BasicEventFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: Partial<FormData>;
}

export function BasicEventForm({ onSubmit, defaultValues }: BasicEventFormProps) {
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      location: defaultValues?.location || "",
      startDate: defaultValues?.startDate || new Date(),
      endDate: defaultValues?.endDate || new Date(),
      startTime: defaultValues?.startTime || "09:00",
      endTime: defaultValues?.endTime || "17:00",
      program: defaultValues?.program || [],
    },
  });

  const handleProgramItemSubmit = (item: ProgramItem) => {
    const currentProgram = form.getValues("program") || [];
    form.setValue("program", [...currentProgram, item], { shouldValidate: true });
  };

  const removeProgramItem = (index: number) => {
    const currentProgram = form.getValues("program") || [];
    form.setValue(
      "program",
      currentProgram.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input data-testid="event-name" placeholder="Enter event name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea data-testid="description" placeholder="Enter event description" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem data-testid="location" className="md:col-span-2">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input data-testid="location" placeholder="Enter event location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Program Items</h3>
            <Button type="button" variant="outline" size="sm" data-testid="add-program-item" onClick={() => setProgramModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-4">
            {!form.watch("program")?.length ? (
              <div className="text-center p-8 border-2 border-dashed rounded-lg">
                <div className="text-muted-foreground">No program items added yet</div>
              </div>
            ) : (
              form.watch("program")?.map((item: ProgramItem, index: number) => (
                <Card key={index} className="group relative hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <div className="text-sm px-2 py-1 bg-secondary text-secondary-foreground rounded-md">{format(new Date(item.dateTime), "h:mm a")}</div>
                          </div>
                          <div className="text-sm text-muted-foreground">{format(new Date(item.dateTime), "EEEE, MMMM d, yyyy")}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid="remove-program-item"
                          onClick={() => removeProgramItem(index)}>
                          <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/90" />
                        </Button>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: item.description }} />
                      </div>

                      {item.speaker && (
                        <div className="border-t pt-4 mt-2">
                          <div className="flex items-start gap-3">
                            {item.speaker.image && <img src={item.speaker.image} alt={item.speaker.name} className="w-12 h-12 rounded-full object-cover" />}
                            <div className="flex-1">
                              <div className="font-medium text-sm">Speaker</div>
                              <div className="font-semibold">{item.speaker.name}</div>
                              {item.speaker.bio && <div className="prose prose-sm mt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: item.speaker.bio }} />}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>

      <ProgramItemModal open={programModalOpen} onOpenChange={setProgramModalOpen} onSubmit={handleProgramItemSubmit} />
    </Form>
  );
}
