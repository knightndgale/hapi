import { Suspense } from "react";
import { DashboardContent } from "./components/dashboard-content";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getEvents } from "@/actions/event.action";

/**
 * Renders the dashboard page with a loading spinner while content is loading.
 *
 * Displays the {@link DashboardContent} component inside a styled container. Shows the {@link LoadingSpinner} as a fallback while the content is being loaded asynchronously.
 */
export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
