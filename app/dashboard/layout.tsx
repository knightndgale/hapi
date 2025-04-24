import { DashboardProvider } from "./context/dashboard-context";
import { getEvents } from "@/actions/event.action";
import { Navigation } from "@/components/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <DashboardProvider
        actions={{
          getEvents,
        }}>
        {children}
      </DashboardProvider>
    </>
  );
}
