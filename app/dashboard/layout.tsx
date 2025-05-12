import { DashboardProvider } from "./context/dashboard-context";
import { getEvents } from "@/requests/event.request";
import { Navigation } from "@/components/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <DashboardProvider>{children}</DashboardProvider>
    </>
  );
}
