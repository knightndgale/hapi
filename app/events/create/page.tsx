"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EventTypeForm, EventTypeFormData } from "@/app/events/components/event-type-form";
import { RSVPForm } from "@/app/events/components/rsvp-form";
import { EventCustomizationForm, EventCustomizationFormData } from "@/app/events/components/event-customization-form";
import { BasicEventForm } from "@/app/events/components/basic-event-form";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { RSVP, Event } from "@/types/schema/Event.schema";

const steps = [
  {
    id: "type",
    title: "Event Type",
  },
  {
    id: "basic",
    title: "Basic Information",
  },
  {
    id: "rsvp",
    title: "RSVP Form",
  },
  {
    id: "customize",
    title: "Customize",
  },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: {} as EventTypeFormData,
    basic: {} as Event,
    rsvp: {} as RSVP,
    customize: {} as EventCustomizationFormData,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement event creation logic
      console.log("Form data:", formData);
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <EventTypeForm
            onSubmit={(data) => {
              setFormData((prev) => ({ ...prev, type: data }));
              handleNext();
            }}
            defaultValues={formData.type}
          />
        );
      case 1:
        return (
          <BasicEventForm
            onSubmit={(data) => {
              setFormData((prev) => ({ ...prev, basic: data }));
              handleNext();
            }}
            defaultValues={formData.basic}
          />
        );
      case 2:
        return (
          <RSVPForm
            onSubmit={(data) => {
              setFormData((prev) => ({ ...prev, rsvp: data }));
              handleNext();
            }}
            defaultValues={formData.rsvp}
          />
        );
      case 3:
        return (
          <EventCustomizationForm
            onSubmit={(data) => {
              setFormData((prev) => ({ ...prev, customize: data }));
              handleSubmit();
            }}
            defaultValues={formData.customize}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold">Create Event</h1>
          <p className="text-muted-foreground">Follow the steps below to create your event</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    index <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/25 text-muted-foreground"
                  }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && <div className={`mx-4 h-0.5 w-8 ${index < currentStep ? "bg-primary" : "bg-muted-foreground/25"}`} />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            {steps.map((step) => (
              <span key={step.id} className="text-sm text-muted-foreground">
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <Card className="p-6">{renderStep()}</Card>

        {currentStep > 0 && (
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
