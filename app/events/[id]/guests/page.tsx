"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { GuestList } from "@/components/guests/guest-list"
import { AddGuestForm } from "@/components/guests/add-guest-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function GuestsPage({ params }: { params: { id: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
  )
}