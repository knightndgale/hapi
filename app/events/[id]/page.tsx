import React, { Suspense } from "react";
import EventView from "./component/EventView";
import { dummyEvent } from "@/constants/dummyData";
import { getGuests } from "@/requests/guest.request";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <EventView event={dummyEvent} id={Number(id)} />
    </Suspense>
  );
}
