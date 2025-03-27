"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramItemSchema } from "@/types/schema/Program.schema";
import type { ProgramItem } from "@/types/schema/Program.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProgramItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProgramItem) => void;
}

export function ProgramItemModal({ open, onOpenChange, onSubmit }: ProgramItemModalProps) {
  const form = useForm<ProgramItem>({
    resolver: zodResolver(ProgramItemSchema),
    defaultValues: {
      title: "",
      description: "",
      dateTime: "",
    },
  });

  const handleSubmit = (data: ProgramItem) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Program Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter program item title" {...field} />
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
                    <Textarea placeholder="Enter program item description" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date and Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Optional Speaker Details</h3>
              <FormField
                control={form.control}
                name="speaker.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speaker Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter speaker name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker.bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speaker Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter speaker bio" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker.image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speaker Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter speaker image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Program Item</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
