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
import { GripVertical, Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SectionSchema } from "@/types/schema/Event.schema";
import { toast } from "sonner";
import { useEvent } from "@/app/events/[id]/context/event-context";

const formSchema = z.object({
  backgroundImage: z.string().optional(),
  sections: z.array(SectionSchema),
});

export type EventCustomizationFormData = z.infer<typeof formSchema>;

interface EventCustomizationFormProps {
  onSectionSubmit: (data: z.infer<typeof SectionSchema>) => void;
  defaultValues?: Partial<EventCustomizationFormData>;
}

interface SectionModalProps {
  section?: z.infer<typeof SectionSchema>;
  onSubmit: (data: z.infer<typeof SectionSchema>) => void;
  onClose: () => void;
  isOpen: boolean;
}

function SectionModal({ section, onSubmit, onClose, isOpen }: SectionModalProps) {
  const form = useForm<z.infer<typeof SectionSchema>>({
    resolver: zodResolver(SectionSchema),
    defaultValues: section || {
      section_id: Math.random().toString(36).substr(2, 9),
      type: "content",
      title: "",
      description: "",
      image: "",
    },
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      if (section) {
        form.reset(section);
      } else {
        form.reset({
          section_id: Math.random().toString(36).substr(2, 9),
          type: "content",
          title: "",
          description: "",
          image: "",
        });
      }
    }
  }, [isOpen, section, form]);

  const handleSubmit = (data: z.infer<typeof SectionSchema>) => {
    // Ensure we have all required fields
    const sectionData = {
      section_id: data.section_id,
      type: data.type,
      title: data.title,
      description: data.description || "",
      image: data.image || "",
    };
    onSubmit(sectionData);
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{section ? "Edit Section" : "Add New Section"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Type</FormLabel>
                  <FormControl>
                    <select className="w-full p-2 border rounded-md" {...field} disabled={!!section}>
                      <option value="content">Content</option>
                      <option value="image">Image</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
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

            {form.watch("type") === "content" && (
              <FormField
                control={form.control}
                name="description"
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

            {form.watch("type") === "image" && (
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">{section ? "Save Changes" : "Add Section"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface SortableRowProps {
  section: z.infer<typeof SectionSchema>;
  onEdit: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

function SortableRow({ section, onEdit, onRemove }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.section_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={cn("group hover:bg-muted/50 transition-colors", isDragging && "bg-muted shadow-lg")}>
      <TableCell className="w-10">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-primary transition-colors">
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {section.type === "content" ? <div className="h-2 w-2 rounded-full bg-blue-500" /> : <div className="h-2 w-2 rounded-full bg-green-500" />}
          {section.title}
        </div>
      </TableCell>
      <TableCell>
        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", section.type === "content" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700")}>
          {section.type === "content" ? "Content" : "Image"}
        </span>
      </TableCell>
      <TableCell className="w-[120px]">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit} className="hover:bg-primary/10 hover:text-primary">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function EventCustomizationForm({ onSectionSubmit, defaultValues }: EventCustomizationFormProps) {
  const { actions } = useEvent();
  const form = useForm<EventCustomizationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      backgroundImage: defaultValues?.backgroundImage || "",
      sections: defaultValues?.sections || [],
    },
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingSection, setEditingSection] = React.useState<z.infer<typeof SectionSchema> | undefined>();
  const [sectionToDelete, setSectionToDelete] = React.useState<z.infer<typeof SectionSchema> | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddSection = () => {
    setEditingSection(undefined);
    setIsModalOpen(true);
  };

  const handleEditSection = (section: z.infer<typeof SectionSchema>) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleSectionSubmit = (data: z.infer<typeof SectionSchema>) => {
    onSectionSubmit(data);
  };

  const handleRemoveSection = async (section: z.infer<typeof SectionSchema>) => {
    setSectionToDelete(section);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSection = async () => {
    if (!sectionToDelete) return;

    const res = await actions.deleteSection(sectionToDelete.section_id);
    if (res.success) {
      toast.success("Section deleted successfully");
    } else {
      toast.error(res.message || "Failed to delete section");
    }
    setIsDeleteDialogOpen(false);
    setSectionToDelete(undefined);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sections = form.getValues("sections");
      const oldIndex = sections.findIndex((section) => section.section_id === active.id);
      const newIndex = sections.findIndex((section) => section.section_id === over.id);

      form.setValue("sections", arrayMove(sections, oldIndex, newIndex));
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Page Sections</h3>
              <p className="text-sm text-muted-foreground">Add and organize your event sections. Drag to reorder.</p>
            </div>
            <Button type="button" onClick={handleAddSection} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          <div className="rounded-lg border">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={defaultValues?.sections?.map((section) => section.section_id) || []} strategy={verticalListSortingStrategy}>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="w-[120px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {defaultValues?.sections?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <p>No sections added yet</p>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddSection} className="gap-2">
                              <Plus className="h-4 w-4" />
                              Add your first section
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      defaultValues?.sections?.map((section) => (
                        <SortableRow key={section.section_id} section={section} onEdit={() => handleEditSection(section)} onRemove={() => handleRemoveSection(section)} />
                      ))
                    )}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <SectionModal section={editingSection} onSubmit={handleSectionSubmit} onClose={() => setIsModalOpen(false)} isOpen={isModalOpen} />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Section</DialogTitle>
              <DialogDescription>Are you sure you want to delete this section? This action cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteSection}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
