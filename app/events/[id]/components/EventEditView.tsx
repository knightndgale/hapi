"use client";

import { useEvent } from "../context/event-context";
import { EventCustomizationForm } from "@/app/events/component/event-customization-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateEvent } from "@/requests/event.request";

export default function EventEditView() {
  const { state, dispatch } = useEvent();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const res = await updateEvent(state.event?.id || "", {
        sections: data.sections,
        backgroundImage: data.backgroundImage,
      });

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      dispatch({ type: "SET_EVENT", payload: res.data });
      toast.success("Event updated successfully");
      router.push(`/events/${state.event?.id}`);
    } catch (error) {
      toast.error("Failed to update event");
    }
  };

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
          onSubmit={handleSubmit}
          defaultValues={{
            sections: state.event?.sections || [],
            backgroundImage: state.event?.backgroundImage || "",
          }}
        />
      </div>
    </div>
  );
}
