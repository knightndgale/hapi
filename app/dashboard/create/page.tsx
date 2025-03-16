import { Navbar } from "@/components/navbar"
import { CreateEventForm } from "@/components/events/create-event-form"

export default function CreateEventPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          <CreateEventForm />
        </div>
      </main>
    </div>
  )
}