"use client";

import { useState } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit2, Trash2, Share2 } from "lucide-react";
import { archiveGuest } from "@/requests/guest.request";
import { AddGuestForm } from "./add-guest-form";
import { toast } from "sonner";
import { useEvent } from "../../context/event-context";
import useDisclosure from "@/hooks/useDisclosure";
import { PrintPreview } from "@/components/invitation-card/PrintPreview";
import { GuestListProvider, useGuestList } from "../context/guest-list-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pageSizes = [10, 20, 50, 100];

function GuestListContent({ eventId }: { eventId: string }) {
  const { state, actions, filteredGuests, totalPages } = useGuestList();
  const { state: eventState, actions: eventActions } = useEvent();

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
      eventActions.loadEvent(eventId);
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

  // Calculate paginated guests
  const paginatedGuests = filteredGuests.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize);

  return (
    <div className="space-y-4" data-testid="guest-list">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-1 gap-4">
          <Input placeholder="Search guests..." className="max-w-xs" value={state.search} onChange={(e) => actions.setSearch(e.target.value)} />
          <Select value={state.responseFilter} onValueChange={(value) => actions.setResponseFilter(value as GuestResponse | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by response" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Responses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            onSuccess={async () => {
              setSelectedGuest(null);
              guestForm.onClose();
              await eventActions.loadEvent(eventId);
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
          {selectedGuestForPrint && eventState.event && (
            <PrintPreview
              event={eventState.event}
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
            {paginatedGuests.map((guest) => (
              <TableRow key={guest?.id}>
                <TableCell>
                  {guest?.first_name} {guest?.last_name}
                </TableCell>
                <TableCell>{guest?.email}</TableCell>
                <TableCell>
                  <span className={getResponseColor(guest?.response)}>{guest?.response ? guest?.response.charAt(0).toUpperCase() + guest?.response.slice(1) : "Pending"}</span>
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={state.pageSize.toString()} onValueChange={(value) => actions.setPageSize(parseInt(value))}>
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
            Page {state.currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => actions.setCurrentPage(state.currentPage - 1)} disabled={state.currentPage === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => actions.setCurrentPage(state.currentPage + 1)} disabled={state.currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GuestList({ eventId }: { eventId: string }) {
  const { state } = useEvent();
  const guests = state.event?.guests || [];

  return (
    <GuestListProvider guests={guests}>
      <GuestListContent eventId={eventId} />
    </GuestListProvider>
  );
}
