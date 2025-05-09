"use client";

import { useEvent } from "./context/event-context";
import { LoadingSpinner } from "./components/loading-spinner";
import EventView from "./components/EventView";

export default function EventPage() {
  return <EventView />;
}
