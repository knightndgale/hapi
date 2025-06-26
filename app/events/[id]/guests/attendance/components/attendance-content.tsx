"use client";

import { useParams } from "next/navigation";
import { AttendanceProvider } from "../../context/attendance-context";
import { AttendanceDataFetcher } from "./attendance-data-fetcher";

export function AttendanceContent() {
  const params = useParams();
  const eventId = params.id as string;

  return (
    <AttendanceProvider eventId={eventId}>
      <AttendanceDataFetcher eventId={eventId} />
    </AttendanceProvider>
  );
}
