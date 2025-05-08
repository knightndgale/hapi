"use client";

import { useState, useEffect } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Edit2, Trash2, Share2 } from "lucide-react";

export function GuestList({ eventId }: { eventId: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showQR, setShowQR] = useState(false);

  // TODO: Replace with actual data fetching
  useEffect(() => {
    // Mock data for now
    setGuests([
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        response: "pending",
        type: "regular",
      },
    ]);
  }, [eventId]);

  const handleDelete = async (guestId: string) => {
    // TODO: Implement delete functionality
    setGuests(guests.filter((guest) => guest.id !== guestId));
  };

  const getResponseColor = (response: GuestResponse) => {
    switch (response) {
      case "accepted":
        return "text-green-600";
      case "declined":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="space-y-4" data-testid="guest-list">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search guests..."
          className="max-w-sm"
          onChange={(e) => {
            // TODO: Implement search
          }}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  {guest.firstName} {guest.lastName}
                </TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>
                  <span className={getResponseColor(guest.response)}>{guest.response.charAt(0).toUpperCase() + guest.response.slice(1)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedGuest(guest)}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Share Invitation</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <QRCodeCanvas value={`${window.location.origin}/invite/${eventId}/${guest.id}`} size={256} level="H" />
                          </div>
                          <Input readOnly value={`${window.location.origin}/invite/${eventId}/${guest.id}`} />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // TODO: Implement edit
                      }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(guest.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
