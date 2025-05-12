"use client";

import { useState, useEffect, useMemo } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Edit2, Trash2, Share2 } from "lucide-react";
import { getGuests, archiveGuest } from "@/requests/guest.request";
import { AddGuestForm } from "./add-guest-form";
import { toast } from "sonner";
import { getEventById } from "@/requests/event.request";
import { useEvent } from "../../context/event-context";
import useDisclosure from "@/hooks/useDisclosure";

export function GuestList({ eventId }: { eventId: string }) {
  const { state, actions } = useEvent();

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showQR, setShowQR] = useState(false);

  const handleDelete = async (guestId: string) => {
    if (!window.confirm("Are you sure you want to remove this guest?")) return;
    const res = await archiveGuest(guestId);
    if (res.success) {
      toast.success("Guest removed");
    } else {
      toast.error(res.message || "Failed to remove guest");
    }
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
        <Button onClick={createModal.onOpen} variant="default">
          Add Guest
        </Button>
      </div>

      <Dialog open={createModal.isOpen} onOpenChange={createModal.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Guest</DialogTitle>
          </DialogHeader>
          <AddGuestForm
            eventId={eventId}
            onSuccess={() => {
              createModal.onClose();
              actions.loadEvent();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editModal.isOpen} onOpenChange={editModal.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Guest</DialogTitle>
          </DialogHeader>
          {/* {selectedGuest && (
            <AddGuestForm
              eventId={eventId}
              editGuest={selectedGuest}
              onSuccess={() => {
                setShowEditModal(false);
              }}
            />
          )} */}
        </DialogContent>
      </Dialog>

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
            {state.event?.guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  {guest.first_name} {guest.last_name}
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
                          <div className="flex justify-center">{guest.token && <QRCodeCanvas value={guest.token} size={256} level="H" />}</div>
                          <Input readOnly value={guest.token || "No token"} />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedGuest(guest);
                        editModal.onOpen();
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
