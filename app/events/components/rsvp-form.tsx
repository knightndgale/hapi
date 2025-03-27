"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { RSVP, RSVPSchema } from "@/types/schema/Event.schema";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface RSVPFormProps {
  onSubmit: (data: RSVP) => void;
  defaultValues: RSVP;
}

export function RSVPForm({ onSubmit, defaultValues }: RSVPFormProps) {
  const form = useForm<RSVP>({
    resolver: zodResolver(RSVPSchema),
    defaultValues: {
      title: defaultValues?.title,
      subtitle: defaultValues?.subtitle,
      invitation: defaultValues?.invitation,
      accept_text: defaultValues?.accept_text,
      decline_text: defaultValues?.decline_text,
      deadline: defaultValues?.deadline,
      logo: undefined,
      title_as_image: undefined,
      backgroundImage: undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem data-testid="title">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input data-testid="title-input" placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem data-testid="subtitle">
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input data-testid="subtitle-input" placeholder="Enter subtitle" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem data-testid="deadline">
                      <FormLabel>RSVP Deadline</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input data-testid="deadline-input" type="datetime-local" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Response Options</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accept_text"
                  render={({ field }) => (
                    <FormItem data-testid="accept_text">
                      <FormLabel>Accept Button Text</FormLabel>
                      <FormControl>
                        <Input data-testid="accept_text-input" placeholder="e.g., Yes, I'll be there!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="decline_text"
                  render={({ field }) => (
                    <FormItem data-testid="decline_text">
                      <FormLabel>Decline Button Text</FormLabel>
                      <FormControl>
                        <Input data-testid="decline_text-input" placeholder="e.g., Sorry, can't make it" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Invitation Message</h3>
            <FormField
              control={form.control}
              name="invitation"
              render={({ field }) => (
                <FormItem data-testid="invitation">
                  <FormControl>
                    <textarea
                      data-testid="invitation-input"
                      className="w-full min-h-[150px] p-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your invitation message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visual Elements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem data-testid="logo">
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange(undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title_as_image"
                render={({ field }) => (
                  <FormItem data-testid="title_as_image">
                    <FormLabel>Title as Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange(undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backgroundImage"
                render={({ field }) => (
                  <FormItem data-testid="backgroundImage">
                    <FormLabel>Background Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange(undefined)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Next
        </Button>
      </form>
    </Form>
  );
}
