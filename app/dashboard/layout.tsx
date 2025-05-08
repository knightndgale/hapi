import { DashboardProvider } from "./context/dashboard-context";
import { loadEvents } from "@/actions/event.action";
import { Navigation } from "@/components/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <DashboardProvider
        actions={{
          loadEvents,
        }}>
        {children}
      </DashboardProvider>
    </>
  );
}
