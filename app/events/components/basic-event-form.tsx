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
import { Event, EventSchema } from "@/types/schema/Event.schema";

interface BasicEventFormProps {
  onSubmit: (data: Event) => void;
  defaultValues: Event;
}

export function BasicEventForm({ onSubmit, defaultValues }: BasicEventFormProps) {
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const form = useForm<Event>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: defaultValues?.title,
      description: defaultValues?.description,
      location: defaultValues?.location,
      startDate: defaultValues?.startDate,
      endDate: defaultValues?.endDate,
      startTime: defaultValues?.startTime,
      endTime: defaultValues?.endTime,
      program: defaultValues?.program,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input data-testid="event-title" placeholder="Enter event title" {...field} />
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
            <FormItem className="md:col-span-2">
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
                            <h4 className="font-semibold text-lg" data-testid="program-title">
                              {item.title}
                            </h4>
                            <div className="text-sm px-2 py-1 bg-secondary text-secondary-foreground rounded-md" data-testid="program-date-time">
                              {format(new Date(item.dateTime), "h:mm a")}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground" data-testid="program-date">
                            {format(new Date(item.dateTime), "EEEE, MMMM d, yyyy")}
                          </div>
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
                        <div data-testid="program-description" dangerouslySetInnerHTML={{ __html: item.description }} />
                      </div>

                      {item.speaker && (
                        <div className="border-t pt-4 mt-2">
                          <div className="flex items-start gap-3">
                            {item.speaker.image && <img src={item.speaker.image} alt={item.speaker.name} className="w-12 h-12 rounded-full object-cover" data-testid="program-speaker-image" />}
                            <div className="flex-1">
                              <div className="font-medium text-sm">Speaker</div>
                              <div className="font-semibold" data-testid="program-speaker-name">
                                {item.speaker.name}
                              </div>
                              {item.speaker.bio && (
                                <div className="prose prose-sm mt-2 text-muted-foreground" data-testid="program-speaker-bio" dangerouslySetInnerHTML={{ __html: item.speaker.bio }} />
                              )}
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
