"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createDirectusClient } from "@/lib/directus";
import { getAssetURL } from "@/lib/directus";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

type GuestImage = {
  id: number;
  guests_id: number;
  directus_files_id: string;
};

export function AddGuestForm({ eventId, onSuccess, editGuest, guestForm, onGuestCreated }: AddGuestFormProps) {
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
      const res = editGuest
        ? await updateGuest(editGuest.id, data)
        : await createGuest(
            {
              ...data,
              status: Status.Enum.published,
              attendance_status: "not_admitted",
            },
            eventId
          );

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

  const getResponseColor = (response: string) => {
    switch (response) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const slides =
    editGuest?.images?.map((image) => {
      const imageObj = image as unknown as GuestImage;
      return {
        src: `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${imageObj.directus_files_id}`,
      };
    }) || [];

  return (
    <div className={editGuest && editGuest.response !== "pending" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "w-full"}>
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

      {editGuest && editGuest.response !== "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <Badge className={getResponseColor(editGuest.response)}>{editGuest.response.charAt(0).toUpperCase() + editGuest.response.slice(1)}</Badge>
            </div>
            {editGuest.phone_number && (
              <div>
                <span className="font-medium">Phone Number:</span>
                <p className="text-sm text-gray-600">{editGuest.phone_number}</p>
              </div>
            )}
            {editGuest.dietary_requirements && (
              <div>
                <span className="font-medium">Dietary Requirements:</span>
                <p className="text-sm text-gray-600">{editGuest.dietary_requirements}</p>
              </div>
            )}
            {editGuest.message && (
              <div>
                <span className="font-medium">Message:</span>
                <p className="text-sm text-gray-600">{editGuest.message}</p>
              </div>
            )}
            {editGuest.images && editGuest.images.length > 0 && (
              <div>
                <span className="font-medium mb-2 block">Attached Images:</span>
                <div className="grid grid-cols-3 gap-2">
                  {editGuest.images.map((image, index) => {
                    const imageObj = image as unknown as GuestImage;
                    const url = `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${imageObj.directus_files_id}`;

                    return (
                      <div key={index} className="relative aspect-square cursor-pointer overflow-hidden rounded-md border" onClick={() => handleImageClick(index)}>
                        <img src={url} alt={`Guest image ${index + 1}`} className="h-full w-full object-cover transition-transform hover:scale-105" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Lightbox open={lightboxOpen} close={() => setLightboxOpen(false)} slides={slides} index={selectedImageIndex} carousel={{ finite: true }} />
    </div>
  );
}
