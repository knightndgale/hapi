"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sectionSchema = z.object({
  id: z.string(),
  type: z.enum(["content", "image"]),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().optional(),
});

const formSchema = z.object({
  backgroundImage: z.string().optional(),
  sections: z.array(sectionSchema),
});

export type EventCustomizationFormData = z.infer<typeof formSchema>;

interface EventCustomizationFormProps {
  onSubmit: (data: EventCustomizationFormData) => void;
  defaultValues?: Partial<EventCustomizationFormData>;
}

export function EventCustomizationForm({ onSubmit, defaultValues }: EventCustomizationFormProps) {
  const form = useForm<EventCustomizationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundImage: defaultValues?.backgroundImage || "",
      sections: defaultValues?.sections || [],
    },
  });

  const addSection = (type: "content" | "image") => {
    const currentSections = form.getValues("sections");
    form.setValue("sections", [
      ...currentSections,
      {
        id: Math.random().toString(36).substr(2, 9),
        type,
        title: "",
        description: type === "content" ? "" : undefined,
        image: type === "image" ? "" : undefined,
      },
    ]);
  };

  const removeSection = (index: number) => {
    const currentSections = form.getValues("sections");
    form.setValue(
      "sections",
      currentSections.filter((_, i) => i !== index)
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sections = Array.from(form.getValues("sections"));
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    form.setValue("sections", sections);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="backgroundImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Image</FormLabel>
              <FormControl>
                <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Page Sections</h3>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => addSection("content")} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Content Section
              </Button>
              <Button type="button" variant="outline" onClick={() => addSection("image")} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Image Section
              </Button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {form.watch("sections").map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} className={cn("rounded-lg border p-4", snapshot.isDragging && "border-primary shadow-lg")}>
                          <div className="flex items-center gap-4">
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <h4 className="font-medium">{section.type === "content" ? "Content Section" : "Image Section"}</h4>
                            <Button data-testid={`remove-section`} type="button" variant="ghost" size="icon" onClick={() => removeSection(index)} className="ml-auto">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-4 space-y-4">
                            <FormField
                              control={form.control}
                              name={`sections.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter section title" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {section.type === "content" && (
                              <FormField
                                control={form.control}
                                name={`sections.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Enter section description" className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}

                            {section.type === "image" && (
                              <FormField
                                control={form.control}
                                name={`sections.${index}.image`}
                                render={({ field }) => (
                                  <FormItem data-testid={`upload-image`}>
                                    <FormLabel>Image</FormLabel>
                                    <FormControl>
                                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </Form>
  );
}
