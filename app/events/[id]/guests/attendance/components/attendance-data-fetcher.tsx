"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Camera, CheckCircle2, XCircle, Search, Mail, User, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAttendance } from "../../context/attendance-context";
import { Guest, GuestAttendanceStatus } from "@/types/schema/Guest.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRScanner } from "../../components/qr-scanner";

const pageSizes = [10, 20, 50, 100];

function AttendanceDataFetcherContent({ eventId }: { eventId: string }) {
  const { state, actions, filteredGuests, totalPages } = useAttendance();
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [guestToAdmit, setGuestToAdmit] = useState<Guest | null>(null);
  const [admitDialogOpen, setAdmitDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [admittedGuest, setAdmittedGuest] = useState<Guest | null>(null);

  const handleAdmitGuest = async (guestId: string) => {
    try {
      await actions.updateAttendanceStatus(guestId, "admitted");
      const guest = filteredGuests.find((g) => g.id === guestId);
      if (guest) {
        setAdmittedGuest(guest);
        setSuccessDialogOpen(true);
      }
      toast.success("Guest admitted successfully");
      setGuestToAdmit(null);
      setAdmitDialogOpen(false);
    } catch (error) {
      toast.error("Failed to admit guest");
    }
  };

  const handleGuestFound = async (guest: Guest) => {
    try {
      await actions.updateAttendanceStatus(guest.id, "admitted");
      setAdmittedGuest(guest);
      setSuccessDialogOpen(true);
      toast.success(`${guest.first_name} ${guest.last_name} admitted successfully`);
    } catch (error) {
      toast.error("Failed to admit guest");
    }
  };

  const getAttendanceStatusColor = (status: GuestAttendanceStatus) => {
    switch (status) {
      case "admitted":
        return "text-green-600";
      case "not_admitted":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getAttendanceStatusIcon = (status: GuestAttendanceStatus) => {
    switch (status) {
      case "admitted":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "not_admitted":
        return <XCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case "accepted":
        return "text-green-600";
      case "declined":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const paginatedGuests = filteredGuests.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize);

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error: {state.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="attendance-tracking">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Mobile: Stacked layout */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search guests..." className="pl-10 w-full" value={state.search} onChange={(e) => actions.setSearch(e.target.value)} />
          </div>
          <Select value={state.attendanceFilter} onValueChange={(value) => actions.setAttendanceFilter(value as GuestAttendanceStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="not_admitted">Not Admitted</SelectItem>
              <SelectItem value="admitted">Admitted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* QR Scanner Button - Full width on mobile */}
        <Button onClick={() => setQrScannerOpen(true)} disabled={state.loading} variant="default" className="w-full sm:w-auto">
          <Camera className="mr-2 h-4 w-4" />
          Scan QR Code
          {state.loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>

      {/* Dialogs */}
      <Dialog open={admitDialogOpen} onOpenChange={setAdmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admit Guest</DialogTitle>
            <DialogDescription>
              Are you sure you want to admit {guestToAdmit?.first_name} {guestToAdmit?.last_name} to the reception?
              {guestToAdmit?.seat_number && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-blue-900">Seat Number:</span>
                    <span className="text-blue-700 font-semibold">{guestToAdmit.seat_number}</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setAdmitDialogOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button variant="default" onClick={() => guestToAdmit && handleAdmitGuest(guestToAdmit.id)} className="w-full sm:w-auto">
              Admit Guest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QRScanner isOpen={qrScannerOpen} onClose={() => setQrScannerOpen(false)} onGuestFound={handleGuestFound} />

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Guest Admitted Successfully
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {admittedGuest?.first_name} {admittedGuest?.last_name}
                  </div>
                  <div className="text-sm text-gray-600">has been admitted to the reception</div>
                </div>
                {admittedGuest?.seat_number && (
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="font-medium text-blue-900 text-sm">Seat Number:</span>
                      <span className="text-blue-700 font-bold text-3xl tracking-wide">{admittedGuest.seat_number}</span>
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="default" onClick={() => setSuccessDialogOpen(false)} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guest List */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Seat Number</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Attendance Status</TableHead>
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
                    <span className={getResponseColor(guest?.response || "pending")}>{guest?.response ? guest?.response.charAt(0).toUpperCase() + guest?.response.slice(1) : "Pending"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getAttendanceStatusIcon(guest?.attendance_status || "not_admitted")}
                      <span className={getAttendanceStatusColor(guest?.attendance_status || "not_admitted")}>{guest?.attendance_status === "admitted" ? "Admitted" : "Not Admitted"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {guest?.attendance_status !== "admitted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGuestToAdmit(guest);
                            setAdmitDialogOpen(true);
                          }}
                          disabled={state.loading}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Admit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {paginatedGuests.map((guest) => (
            <Card key={guest?.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      {guest?.first_name} {guest?.last_name}
                    </CardTitle>
                    {guest?.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3" />
                        {guest.email}
                      </div>
                    )}
                    {guest?.seat_number && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
                        <span className="font-medium">Seat:</span>
                        <span className="font-semibold">{guest.seat_number}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {getAttendanceStatusIcon(guest?.attendance_status || "not_admitted")}
                    <span className={`text-sm font-medium ${getAttendanceStatusColor(guest?.attendance_status || "not_admitted")}`}>
                      {guest?.attendance_status === "admitted" ? "Admitted" : "Not Admitted"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className={`text-sm ${getResponseColor(guest?.response || "pending")}`}>
                      {guest?.response ? guest?.response.charAt(0).toUpperCase() + guest?.response.slice(1) : "Pending"}
                    </span>
                  </div>
                  {guest?.attendance_status !== "admitted" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGuestToAdmit(guest);
                        setAdmitDialogOpen(true);
                      }}
                      disabled={state.loading}
                      className="flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Admit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2">
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
          <Button variant="outline" onClick={() => actions.setCurrentPage(state.currentPage - 1)} disabled={state.currentPage === 1} className="flex-1 sm:flex-none">
            Previous
          </Button>
          <Button variant="outline" onClick={() => actions.setCurrentPage(state.currentPage + 1)} disabled={state.currentPage === totalPages} className="flex-1 sm:flex-none">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AttendanceDataFetcher({ eventId }: { eventId: string }) {
  return <AttendanceDataFetcherContent eventId={eventId} />;
}
