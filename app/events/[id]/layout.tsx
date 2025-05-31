import { EventProvider } from "./context/event-context";
import { Navigation } from "@/components/navigation";
import { getMe } from "@/requests/auth.request";
export default async function EventLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const parameters = await params;
  const me = await getMe();
  return (
    <>
      {me.success && "data" in me && <Navigation />}
      <EventProvider eventId={parameters.id}>{children}</EventProvider>
    </>
  );
}
