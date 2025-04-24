import { Suspense } from "react";
import { DashboardContent } from "./components/dashboard-content";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getEvents } from "@/actions/event.action";

export default async function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
