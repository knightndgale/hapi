import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Calendar, Users, QrCode, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Navigation } from "@/components/navigation";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          </div>
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-left space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>Simplify Your Event Management</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">Create Memorable Events with Ease</h1>
                <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Transform your event planning experience with our comprehensive platform. From creation to attendance tracking, we&apos;ve got you covered.
                </p>
                <div className="flex gap-4 items-center">
                  <Link href="/signup">
                    <Button size="lg" className="group">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  {/* <Link href="/login">
                    <Button size="lg" variant="outline">
                      View Demo
                    </Button>
                  </Link> */}
                </div>
                {/* <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm">Secure Platform</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-sm">10k+ Users</span>
                  </div>
                </div> */}
              </div>
              <div className="relative hidden lg:block">
                <div className="relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Dashboard Preview" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg">Powerful features to make your event management seamless and professional</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Calendar,
                  title: "Event Management",
                  description: "Create and manage events with ease. Customize every detail and keep track of all your upcoming events in one place.",
                  features: ["Custom Templates", "Real-time Updates", "Dynamic Scheduling"],
                },
                {
                  icon: QrCode,
                  title: "QR Code Check-in",
                  description: "Generate unique QR codes for each event. Simplify the check-in process and enhance the attendee experience.",
                  features: ["Instant Generation", "Secure Validation", "Offline Support"],
                },
                {
                  icon: Users,
                  title: "Attendee Tracking",
                  description: "Monitor attendance in real-time. Get valuable insights about participation and engagement at your events.",
                  features: ["Live Analytics", "Export Reports", "Attendee Management"],
                },
              ].map((feature, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-8 space-y-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto">
            <div className="relative rounded-3xl bg-primary/5 p-12 overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="relative max-w-2xl mx-auto text-center space-y-8">
                <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                <p className="text-lg text-muted-foreground">Join thousands of event organizers who trust our platform for their events.</p>
                <div className="flex justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="group">
                      Create Your First Event
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline">
                      Contact Sales
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
