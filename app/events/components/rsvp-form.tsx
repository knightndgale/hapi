"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { RSVP, RSVPSchema } from "@/types/schema/Event.schema";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem data-testid={`title`}>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input data-testid={`title-input`} placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem data-testid={`subtitle`}>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input data-testid={`subtitle-input`} placeholder="Enter subtitle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          data-testid={`invitation`}
          control={form.control}
          name="invitation"
          render={({ field }) => (
            <FormItem data-testid={`invitation`}>
              <FormLabel>Invitation Message</FormLabel>
              <FormControl>
                <Input data-testid={`invitation-input`} placeholder="Enter invitation message" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            data-testid={`accept_text`}
            control={form.control}
            name="accept_text"
            render={({ field }) => (
              <FormItem data-testid={`accept_text`}>
                <FormLabel>Accept Button Text</FormLabel>
                <FormControl>
                  <Input data-testid={`accept_text-input`} placeholder="Enter accept button text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decline_text"
            render={({ field }) => (
              <FormItem data-testid={`decline_text`}>
                <FormLabel>Decline Button Text</FormLabel>
                <FormControl>
                  <Input data-testid={`decline_text-input`} placeholder="Enter decline button text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem data-testid={`deadline`}>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input data-testid={`deadline-input`} type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem data-testid={`logo`}>
              <FormLabel>Logo</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title_as_image"
          render={({ field }) => (
            <FormItem data-testid={`title_as_image`}>
              <FormLabel>Title as Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem data-testid={`backgroundImage`}>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
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
