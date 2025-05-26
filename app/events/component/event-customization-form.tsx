"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

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

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  dragHandleProps?: {
    attributes: any;
    listeners: any;
  };
}

interface SectionContentProps {
  section: {
    id: string;
    type: "content" | "image";
  };
  index: number;
  onRemove: () => void;
}

function SectionContent({ section, index, onRemove }: SectionContentProps) {
  const { attributes, listeners } = useSortable({ id: section.id });

  return (
    <div className="flex items-center gap-4 mb-4">
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center justify-between w-full">
        <h4 className="font-medium">{section.type === "content" ? "Content Section" : "Image Section"}</h4>
        <Button data-testid={`remove-section`} type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SortableSection({ id, children }: SortableSectionProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("rounded-lg border p-4", isDragging && "border-primary shadow-lg")}>
      {children}
    </div>
  );
}

export function EventCustomizationForm({ onSubmit, defaultValues }: EventCustomizationFormProps) {
  const form = useForm<EventCustomizationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundImage: defaultValues?.backgroundImage || "",
      sections: defaultValues?.sections || [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sections = form.getValues("sections");
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);

      form.setValue("sections", arrayMove(sections, oldIndex, newIndex));
    }
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

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={form.watch("sections").map((section) => section.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {form.watch("sections").map((section, index) => (
                  <SortableSection key={section.id} id={section.id}>
                    <SectionContent section={section} index={index} onRemove={() => removeSection(index)} />
                    <div className="pl-8 space-y-4">
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
                  </SortableSection>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <Button type="submit" className="w-full">
          Create Event
        </Button>
      </form>
    </Form>
  );
}
