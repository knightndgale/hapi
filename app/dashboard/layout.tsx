import { DashboardProvider } from "./context/dashboard-context";
import { getEvents } from "@/actions/event.action";
import { Navbar } from "@/components/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <DashboardProvider
        actions={{
          getEvents,
        }}>
        {children}
      </DashboardProvider>
    </>
  );
}
