"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { createGuest, updateGuest } from "@/requests/guest.request";
import { Guest, GuestSchema } from "@/types/schema/Guest.schema";
import { toast } from "sonner";
import { Status } from "@/types/index.types";

const AddGuestFormSchema = GuestSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  type: true,
}).partial({ email: true });

type AddGuestFormData = z.infer<typeof AddGuestFormSchema>;

interface AddGuestFormProps {
  eventId: string;
  onSuccess: () => void;
  editGuest?: Guest | null;
}

export function AddGuestForm({ eventId, onSuccess, editGuest }: AddGuestFormProps) {
  const [showQR, setShowQR] = useState(false);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<AddGuestFormData>({
    resolver: zodResolver(AddGuestFormSchema),
    defaultValues: {
      first_name: editGuest?.first_name || "",
      last_name: editGuest?.last_name || "",
      email: editGuest?.email || undefined,
      type: editGuest?.type || "regular",
    },
  });

  const handleSubmit = async (data: AddGuestFormData) => {
    setLoading(true);
    try {
      const res = editGuest ? await updateGuest(editGuest.id, data) : await createGuest({ ...data, status: Status.Enum.published }, eventId);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (!editGuest && res.data && res.data.token) {
        setCreatedToken(res.data.token);
        setShowQR(true);
        return;
      }

      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleQRClose = () => {
    setShowQR(false);
    setCreatedToken(null);
    onSuccess();
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" data-testid="add-guest-form">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attendee Type</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select guest type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular Attendee</SelectItem>
                      <SelectItem value="entourage">Entourage</SelectItem>
                      <SelectItem value="sponsor">Sponsor</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Optional)</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {editGuest ? "Update Attendee" : "Add Attendee"}
          </Button>
        </form>
      </Form>
      <Dialog
        open={showQR}
        onOpenChange={(open) => {
          if (!open) {
            handleQRClose();
          }
        }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guest QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {createdToken && <QRCodeCanvas value={`${process.env.NEXT_PUBLIC_URL}/invite/validate/${createdToken}`} size={256} level="H" />}
            <Input readOnly value={createdToken || "No token"} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
