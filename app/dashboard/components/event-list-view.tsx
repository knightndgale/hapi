"use client";

import { Event } from "@/types/schema/Event.schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import formatDate from "@/helpers/formatDate";

interface EventListViewProps {
  events: Event[];
}

export function EventListView({ events }: EventListViewProps) {
  const router = useRouter();

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="capitalize">{event.type}</TableCell>
              <TableCell>{formatDate(String(event.startDate))}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell className="capitalize">{event.status}</TableCell>
              <TableCell>
                {event.attendees.length}/{event.maxAttendees}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/events/${event.id}`)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/events/${event.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
