import { Suspense } from "react";
import { Navigation } from "@/components/navigation";

export default function AttendanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Attendance Tracking</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Track guest attendance and manage reception entry</p>
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px] sm:min-h-[400px]">
                <div className="text-muted-foreground">Loading attendance data...</div>
              </div>
            }>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
}
