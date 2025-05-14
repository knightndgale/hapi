"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { createGuest, updateGuest } from "@/requests/guest.request";
import { Guest } from "@/types/schema/Guest.schema";

interface AddGuestFormProps {
  eventId: string;
  onSuccess: () => void;
  editGuest?: Guest | null;
}

export function AddGuestForm({ eventId, onSuccess, editGuest }: AddGuestFormProps) {
  const [first_name, setFirst_name] = useState(editGuest?.first_name || "");
  const [last_name, setLast_name] = useState(editGuest?.last_name || "");
  const [email, setEmail] = useState(editGuest?.email || "");
  const [type, setType] = useState<"regular" | "entourage" | "sponsor">(editGuest?.type || "regular");
  const [showQR, setShowQR] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (editGuest) {
        // Edit mode
        response = await updateGuest(editGuest.id, {
          first_name,
          last_name,
          email,
          type,
        });
      } else {
        // Create mode
        response = await createGuest(
          {
            first_name,
            last_name,
            email,
            type,
          },
          eventId
        );
      }

      if (response.success) {
        // Call onSuccess first to close the modal and refresh the table
        onSuccess();

        // If it's a new guest and we have a token, show the QR code
        if (!editGuest && response.data?.token) {
          setCreatedToken(response.data.token);
          setShowQR(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQRClose = () => {
    setShowQR(false);
    setCreatedToken(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4" data-testid="add-guest-form">
        <div className="space-y-2">
          <Label htmlFor="type">Guests Type</Label>
          <Select value={type} onValueChange={(val) => setType(val as "regular" | "entourage" | "sponsor")}>
            <SelectTrigger>
              <SelectValue placeholder="Select guest type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Regular Attendee</SelectItem>
              <SelectItem value="entourage">Entourage</SelectItem>
              <SelectItem value="sponsor">Sponsor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={first_name} onChange={(e) => setFirst_name(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" value={last_name} onChange={(e) => setLast_name(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {editGuest ? "Update Guest" : "Add Guest"}
        </Button>
      </form>
      <Dialog open={showQR} onOpenChange={handleQRClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guest QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {createdToken && <QRCodeCanvas value={createdToken} size={256} level="H" />}
            <Input readOnly value={createdToken || "No token"} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
