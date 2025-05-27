"use client";

import { useEvent } from "../context/event-context";
import { EventCustomizationForm } from "@/app/events/component/event-customization-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addEventSection } from "@/requests/event.request";
import { Section } from "@/types/schema/Event.schema";

export default function EventEditView() {
  const { state, actions } = useEvent();
  const router = useRouter();
  console.log(state.event?.sections);

  const handleSectionSubmit = async (data: Section) => {
    try {
      // Ensure we have all required fields
      const sectionData = {
        type: data.type,
        title: data.title,
        description: data.description || "",
        image: data.image || "",
        status: "published",
      };

      const res = await addEventSection(state.event?.id || "", sectionData);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      // Reload the event data to get the updated sections
      await actions.loadEvent(state.event?.id || "");
      toast.success("Section added successfully");
    } catch (error) {
      toast.error("Failed to add section");
    }
  };

  // Transform sections data to match the expected format
  const transformedSections =
    state.event?.sections.map((section) => {
      const sectionData = section.sections_id;
      return {
        id: sectionData.id,
        section_id: sectionData.id || "",
        type: sectionData.type || "content",
        title: sectionData.title || "",
        description: sectionData.description || "",
        image: sectionData.image || "",
      };
    }) || [];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Event Sections</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <EventCustomizationForm
          onSectionSubmit={handleSectionSubmit}
          defaultValues={{
            sections: transformedSections,
            backgroundImage: state.event?.backgroundImage || "",
          }}
        />
      </div>
    </div>
  );
}
