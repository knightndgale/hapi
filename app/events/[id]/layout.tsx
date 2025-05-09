import { EventProvider } from "./context/event-context";
import { Navigation } from "@/components/navigation";

export default async function EventLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const parameters = await params;
  return (
    <>
      <Navigation />
      <EventProvider eventId={parameters.id}>{children}</EventProvider>
    </>
  );
}
