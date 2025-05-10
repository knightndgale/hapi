"use client";

import { useState, use } from "react";
import { GuestList } from "@/components/guest/guest-list";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddGuestForm } from "@/components/guest/add-guest-form";

export default function GuestsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Guest List</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Guest</DialogTitle>
                </DialogHeader>
                <AddGuestForm eventId={params.id} onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <GuestList eventId={params.id} />
        </div>
      </main>
    </div>
  );
}
