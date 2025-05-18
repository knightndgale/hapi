"use client";

import { useState, useEffect, useMemo } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Edit2, Trash2, Share2 } from "lucide-react";
import { getGuests, archiveGuest } from "@/requests/guest.request";
import { AddGuestForm } from "./add-guest-form";
import { toast } from "sonner";
import { getEventById } from "@/requests/event.request";
import { useEvent } from "../../context/event-context";
import useDisclosure from "@/hooks/useDisclosure";
import { Status } from "@/types/index.types";
import { PrintPreview } from "@/components/invitation-card/PrintPreview";

export function GuestList({ eventId }: { eventId: string }) {
  const { state, actions } = useEvent();

  const guestForm = useDisclosure();
  const deleteDialog = useDisclosure();

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedGuestForPrint, setSelectedGuestForPrint] = useState<Guest | null>(null);

  const handleDelete = async (guestId: string) => {
    const res = await archiveGuest(guestId);
    if (res.success) {
      toast.success("Guest removed");
      actions.loadEvent(eventId);
    } else {
      toast.error(res.message || "Failed to remove guest");
    }
    setGuestToDelete(null);
    deleteDialog.onClose();
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
        <Button onClick={guestForm.onOpen} variant="default">
          Add Guest
        </Button>
      </div>

      <Dialog
        open={guestForm.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedGuest(null);
          }
          guestForm.onClose();
        }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGuest ? "Edit Guest" : "Add Guest"}</DialogTitle>
          </DialogHeader>
          <AddGuestForm
            eventId={eventId}
            editGuest={selectedGuest}
            onSuccess={() => {
              setSelectedGuest(null);
              guestForm.onClose();
              actions.loadEvent(eventId);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.isOpen} onOpenChange={deleteDialog.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {guestToDelete?.first_name} {guestToDelete?.last_name} from the guest list? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={deleteDialog.onClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => guestToDelete && handleDelete(guestToDelete.id)}>
              Remove Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPrintPreview}
        onOpenChange={(open) => {
          if (!open) {
            setShowPrintPreview(false);
            setSelectedGuestForPrint(null);
          }
        }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Guest Invitation Card</DialogTitle>
          </DialogHeader>
          {selectedGuestForPrint && state.event && (
            <PrintPreview
              event={state.event}
              guest={selectedGuestForPrint}
              qrCodeUrl={`${process.env.NEXT_PUBLIC_URL}/invite/validate/${selectedGuestForPrint.token}`}
              onClose={() => {
                setShowPrintPreview(false);
                setSelectedGuestForPrint(null);
              }}
            />
          )}
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
                  <span className={getResponseColor(guest.response)}>{guest.response ? guest.response.charAt(0).toUpperCase() + guest.response.slice(1) : "Pending"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedGuestForPrint(guest);
                        setShowPrintPreview(true);
                      }}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedGuest(guest);
                        guestForm.onOpen();
                      }}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setGuestToDelete(guest);
                        deleteDialog.onOpen();
                      }}>
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
