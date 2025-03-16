import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Calendar, Users, QrCode } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Manage Your Events with Ease
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create, manage, and track attendance for your events using QR codes. Make event management simple and efficient.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6">
                <Calendar className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Event Management</h3>
                <p className="text-muted-foreground">Create and manage events with ease. Keep track of all your upcoming events in one place.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <QrCode className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">QR Code Check-in</h3>
                <p className="text-muted-foreground">Generate unique QR codes for each event. Simplify the check-in process for your attendees.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Attendee Tracking</h3>
                <p className="text-muted-foreground">Monitor attendance in real-time. Get insights about your event participation.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}