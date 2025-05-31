"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProgramItemSchema } from "@/types/schema/Program.schema";
import type { ProgramItem } from "@/types/schema/Program.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgramIcon, programIcons, IconsListSchema, IconsListType } from "@/constants/program-icons";

interface ProgramItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProgramItem) => void;
}

export function ProgramItemModal({ open, onOpenChange, onSubmit }: ProgramItemModalProps) {
  const form = useForm<ProgramItem>({
    resolver: zodResolver(ProgramItemSchema.omit({ icon: true }).extend({ icon: IconsListSchema })),
    defaultValues: {
      title: undefined,
      description: undefined,
      dateTime: undefined,
      icon: "church",
      speaker: undefined,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input data-testid="program-title" placeholder="Enter program item title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem data-testid="program-icon">
                    <FormLabel>Icon</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as IconsListType}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon">
                            {field.value && (
                              <div className="flex items-center gap-2">
                                {React.createElement(programIcons[field.value as ProgramIcon], { className: "h-4 w-4" })}
                                <span>{(field.value as IconsListType).toLocaleUpperCase()}</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="grid grid-cols-2 gap-2 p-2">
                          {Object.entries(programIcons).map(([name, Icon]) => (
                            <SelectItem key={name} value={name} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-secondary">
                              <Icon className="h-4 w-4" />
                              <span>{name}</span>
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea data-testid="program-description" placeholder="Enter program item description" className="min-h-[100px]" {...field} />
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
                    <Input data-testid="program-date-time" type="datetime-local" {...field} />
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="cancel-program-item">
                Cancel
              </Button>
              <Button type="submit" data-testid="add-program-item-modal-button">
                Add Program Item
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
