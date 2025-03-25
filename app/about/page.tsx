"use client";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" data-testid="about-page">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[400px] w-full">
          <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" alt="Hapi Team" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">About Hapi</h1>
              <p className="text-xl">Revolutionizing event management with beautiful, intuitive solutions</p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Mission Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-muted-foreground">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Our Mission" fill className="object-cover" />
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">User-First</h3>
                <p className="text-muted-foreground">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-muted-foreground">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Our Team</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  name: "John Doe",
                  position: "CEO",
                  image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80",
                },
                {
                  name: "Jane Smith",
                  position: "CTO",
                  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
                },
                {
                  name: "Mike Johnson",
                  position: "Design Lead",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
                },
                {
                  name: "Sarah Williams",
                  position: "Product Manager",
                  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80",
                },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative h-[200px] w-[200px] mx-auto mb-4 rounded-full overflow-hidden">
                    <Image src={member.image} alt={`${member.name} - ${member.position}`} fill className="object-cover" />
                  </div>
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.position}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
