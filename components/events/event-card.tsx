"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";

import { useRouter } from "next/navigation";
import { Event } from "@/types/schema/Event.schema";
import formatDate from "@/helpers/formatDate";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter();

  const getEventStyles = (type: string) => {
    switch (type) {
      case "wedding":
        return "bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-background";
      case "birthday":
        return "bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-background";
      case "seminar":
        return "bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background";
      default:
        return "";
    }
  };

  return (
    <Card data-testid="event-card" className={`group cursor-pointer transition-all hover:shadow-lg ${getEventStyles(event.type)}`} onClick={() => router.push(`/events/${event.id}`)}>
      {event.pageBanner && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={event.pageBanner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=80"}
            alt={event.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>

        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(String(event.startDate))}
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            <span>
              {event.attendees.length} / {event.maxAttendees} attendees
            </span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking QR button
                }}>
                <QrCode className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Event QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center p-4">
                <QRCodeCanvas value={`https://yourdomain.com/events/${event.id}`} size={256} level="H" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
