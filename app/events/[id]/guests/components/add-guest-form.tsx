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
import { PrintPreview } from "@/components/invitation-card/PrintPreview";
import { useEvent } from "../../context/event-context";
import { useGuestList } from "../context/guest-list-context";
import useDisclosure, { IUseDisclosure } from "@/hooks/useDisclosure";

const AddGuestFormSchema = GuestSchema.pick({
  first_name: true,
  last_name: true,
  type: true,
  email: true,
});

type AddGuestFormData = z.infer<typeof AddGuestFormSchema>;

interface AddGuestFormProps {
  eventId: string;
  onSuccess: () => void;
  editGuest?: Guest | null;
  guestForm: IUseDisclosure;
  onGuestCreated: (guest: Guest, token: string | null) => void;
}

export function AddGuestForm({ eventId, onSuccess, editGuest, guestForm, onGuestCreated }: AddGuestFormProps) {
  const [loading, setLoading] = useState(false);
  const { state } = useEvent();
  const { actions: guestListActions } = useGuestList();

  const form = useForm<AddGuestFormData>({
    resolver: zodResolver(AddGuestFormSchema),
    defaultValues: {
      first_name: editGuest?.first_name || "",
      last_name: editGuest?.last_name || "",
      email: editGuest?.email || "",
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

      if (!editGuest && res.data) {
        onGuestCreated(res.data, res.data.token || null);
      }

      await guestListActions.loadGuests(eventId);
      guestForm.onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
