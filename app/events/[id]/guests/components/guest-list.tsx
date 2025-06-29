"use client";

import { useState } from "react";
import { Guest, GuestResponse } from "@/types/schema/Guest.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Edit2, Trash2, Share2, Loader2, CheckCircle2, MoreHorizontal, Image } from "lucide-react";
import { archiveGuest } from "@/requests/guest.request";
import { AddGuestForm } from "./add-guest-form";
import { toast } from "sonner";
import { useEvent } from "../../context/event-context";
import useDisclosure from "@/hooks/useDisclosure";
import { GuestListProvider, useGuestList } from "../context/guest-list-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GuestQRDialog } from "./guest-qr-dialog";
import { GuestImageUploadDialog } from "./guest-image-upload-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const pageSizes = [10, 20, 50, 100];

function GuestListContent({ eventId }: { eventId: string }) {
  const { state, actions, filteredGuests, totalPages } = useGuestList();
  const { state: eventState } = useEvent();
  const router = useRouter();

  const guestForm = useDisclosure();
  const deleteDialog = useDisclosure();
  const qrDialog = useDisclosure();
  const forceAcceptDialog = useDisclosure();
  const imageUploadDialog = useDisclosure();

  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
  const [guestToForceAccept, setGuestToForceAccept] = useState<Guest | null>(null);
  const [qrDialogGuest, setQrDialogGuest] = useState<Guest | null>(null);
  const [qrDialogToken, setQrDialogToken] = useState<string | null>(null);
  const [guestToUploadImages, setGuestToUploadImages] = useState<Guest | null>(null);

  const handleDelete = async (guestId: string) => {
    const res = await archiveGuest(guestId);
    if (res.success) {
      toast.success("Guest removed");
      await actions.loadGuests(eventId);
    } else {
      toast.error(res.message || "Failed to remove guest");
    }
    setGuestToDelete(null);
    deleteDialog.onClose();
  };

  const handleGuestCreated = (guest: Guest, token: string | null) => {
    setQrDialogGuest(guest);
    setQrDialogToken(token);
    if (token) {
      qrDialog.onOpen();
    }
  };

  const handleQRClose = () => {
    qrDialog.onClose();
    setQrDialogGuest(null);
    setQrDialogToken(null);
  };

  const handleShowQR = (guest: Guest) => {
    setQrDialogGuest(guest);
    setQrDialogToken(guest.token || null);
    qrDialog.onOpen();
  };

  const handleForceAccept = async (guestId: string) => {
    await actions.forceAcceptGuest(guestId);
    setGuestToForceAccept(null);
    forceAcceptDialog.onClose();
  };

  const handleUploadImages = (guest: Guest) => {
    setGuestToUploadImages(guest);
    imageUploadDialog.onOpen();
  };

  const handleImageUploadSuccess = async () => {
    await actions.loadGuests(eventId);
    setGuestToUploadImages(null);
  };

  const handleImageUploadClose = () => {
    setGuestToUploadImages(null);
    imageUploadDialog.onClose();
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

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {state.error}</div>
      </div>
    );
  }

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
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/events/${eventId}/guests/attendance`)} disabled={state.loading} variant="outline">
            Track Attendance
          </Button>
          <Button onClick={guestForm.onOpen} disabled={state.loading} variant="default">
            Add Guest
            {state.loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
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
            guestForm={guestForm}
            eventId={eventId}
            editGuest={selectedGuest}
            onSuccess={async () => {
              setSelectedGuest(null);
              guestForm.onClose();
              await actions.loadGuests(eventId);
            }}
            onGuestCreated={handleGuestCreated}
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

      <Dialog open={forceAcceptDialog.isOpen} onOpenChange={forceAcceptDialog.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Accept Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to force accept {guestToForceAccept?.first_name} {guestToForceAccept?.last_name}? This will mark them as accepted without requiring them to use the RSVP system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={forceAcceptDialog.onClose}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => guestToForceAccept && handleForceAccept(guestToForceAccept.id)}>
              Force Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <GuestQRDialog event={eventState.event} guest={qrDialogGuest} token={qrDialogToken} isOpen={qrDialog.isOpen} onClose={handleQRClose} />

      <GuestImageUploadDialog guest={guestToUploadImages} isOpen={imageUploadDialog.isOpen} onClose={handleImageUploadClose} onSuccess={handleImageUploadSuccess} />

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Seat Number</TableHead>
              <TableHead>Response</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedGuests.map((guest) => (
              <TableRow key={guest?.id}>
                <TableCell>
                  {guest?.first_name} {guest?.last_name}
                </TableCell>
                <TableCell>{guest?.email}</TableCell>
                <TableCell>{guest?.seat_number || "-"}</TableCell>
                <TableCell>
                  <span className={getResponseColor(guest?.response)}>{guest?.response ? guest?.response.charAt(0).toUpperCase() + guest?.response.slice(1) : "Pending"}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleShowQR(guest)}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUploadImages(guest)}>
                          <Image className="h-4 w-4 mr-2" />
                          Upload Images
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedGuest(guest);
                            guestForm.onOpen();
                          }}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Guest
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setGuestToForceAccept(guest);
                            forceAcceptDialog.onOpen();
                          }}>
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                          Force Accept
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setGuestToDelete(guest);
                            deleteDialog.onOpen();
                          }}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Guest
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
  return (
    <GuestListProvider eventId={eventId}>
      <GuestListContent eventId={eventId} />
    </GuestListProvider>
  );
}
