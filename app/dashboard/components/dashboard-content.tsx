/* eslint-disable @next/next/no-img-element */
"use client";

import { useDashboard } from "../context/dashboard-context";
import { Event } from "@/types/schema/Event.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid2X2, List, Calendar, MapPin, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Status } from "@/constants/status.enum";
import { Guest } from "@/types/schema/Guest.schema";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const eventTypes = ["all", "wedding", "birthday", "seminar"];
const eventStatuses = ["all", "draft", "published", "archived"];
const pageSizes = [10, 20, 50, 100];

type TGuests = {
  event_id: string | number;
  guests_id: Guest;
};
type ExtendedEvent = Omit<Event, "guests"> & {
  guests: TGuests[];
};

const statusColors: Record<string, string> = {
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-800",
};

export function DashboardContent() {
  const {
    state: { loading, error, currentPage, pageSize, viewMode, filters },
    totalPages,
    filteredEvents,
    actions,
  } = useDashboard();
  const router = useRouter();

  // Handle loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <Button onClick={() => actions.loadEvents()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-gray-500 mb-4">No events found</div>
          <Button onClick={() => router.push("/events/create")}>
            <Plus /> Create Your First Event
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-4">
            <Input placeholder="Search events..." value={filters.search} onChange={(e) => actions.setFilters({ search: e.target.value })} className="max-w-xs" />
            <Select value={filters.type} onValueChange={(value) => actions.setFilters({ type: value as any })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(value) => actions.setFilters({ status: value as any })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {eventStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => actions.setViewMode("grid")}>
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => actions.setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => router.push("/events/create")}>
              <Plus /> Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Events Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredEvents as unknown as ExtendedEvent[]).map((event) => {
            // Safe fallback for image URL
            const imageUrl = event.pageBanner ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL || ""}/assets/${event.pageBanner}` : `https://picsum.photos/seed/${event.id}/400/300`;

            return (
              <Link href={`/events/${event.id}`} key={event.id}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardHeader className="relative h-48 p-0">
                    <img
                      src={imageUrl}
                      alt={event.title || "Event image"}
                      className="object-cover rounded-t-lg w-full h-full"
                      onError={(e) => {
                        // Fallback to placeholder image on error
                        e.currentTarget.src = `https://picsum.photos/seed/${event.id}/400/300`;
                      }}
                    />
                    <Badge className={`${statusColors[event.status] || "bg-gray-100 text-gray-800"} absolute top-4 right-4`}>{event.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-4">{event.title}</CardTitle>
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.startDate ? format(new Date(event.startDate), "PPP") : "Date TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location || "Location TBD"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {event?.guest_count || 0} / {event?.maxAttendees || 0} guests
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Attendees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event: Event) => (
                <TableRow key={event.id} className="cursor-pointer hover:bg-gray-50" onClick={() => (window.location.href = `/events/${event.id}`)}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[event.status] || "bg-gray-100 text-gray-800"}>{event.status}</Badge>
                  </TableCell>
                  <TableCell>{event.startDate ? format(new Date(event.startDate), "PPP") : "Date TBD"}</TableCell>
                  <TableCell>{event.location || "Location TBD"}</TableCell>
                  <TableCell>
                    {event.guests?.length || 0} / {event.maxAttendees || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => actions.setPageSize(parseInt(value))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => actions.setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => actions.setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
