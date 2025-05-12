"use client";

import { useState, use } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddGuestForm } from "./components/add-guest-form";
import { GuestList } from "./components/guest-list";

export default function GuestsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Guest List</h1>
          </div>
          <GuestList eventId={params.id} />
        </div>
      </main>
    </div>
  );
}
