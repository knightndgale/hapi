"use client";

import { Suspense } from "react";
import { AttendanceContent } from "./components/attendance-content";

export default function AttendancePage() {
  return (
    <Suspense fallback={<div>Loading attendance tracking...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}
