import { DashboardProvider } from "./context/dashboard-context";
import { getEvents } from "@/actions/event.action";
import { Navigation } from "@/components/navigation";

/**
 * Provides the main layout for the dashboard, including navigation and context for dashboard actions.
 *
 * Renders the {@link Navigation} component and wraps the provided {@link children} with {@link DashboardProvider}, supplying dashboard-related actions.
 *
 * @param children - The content to display within the dashboard layout.
 */
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
