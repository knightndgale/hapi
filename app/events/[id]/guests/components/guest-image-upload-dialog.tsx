"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Guest } from "@/types/schema/Guest.schema";
import { updateGuest } from "@/requests/guest.request";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import Image from "next/image";

interface GuestImageUploadDialogProps {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type GuestImage = {
  id: number;
  guests_id: number;
  directus_files_id: string;
};

export function GuestImageUploadDialog({ guest, isOpen, onClose, onSuccess }: GuestImageUploadDialogProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Calculate how many images can still be uploaded
  const maxUploadableImages = 3 - (existingImages.length + uploadedImages.length);
  const canUploadMore = maxUploadableImages > 0;

  useEffect(() => {
    if (guest && isOpen) {
      // Extract existing image IDs from guest.images
      const images =
        guest.images?.map((image) => {
          const imageObj = image as unknown as GuestImage;
          return imageObj.directus_files_id;
        }) || [];
      setExistingImages(images);
      setUploadedImages([]);
    }
  }, [guest, isOpen]);

  const handleImagesChange = (images: string | string[]) => {
    const newImages = Array.isArray(images) ? images : images ? [images] : [];
    setUploadedImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!guest) return;

    try {
      setLoading(true);
      const result = await updateGuest(guest.id, {
        images: uploadedImages,
      });

      if (!result?.success) {
        toast.error(result?.message || "Failed to upload images");
        return;
      }

      toast.success("Images uploaded successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUploadedImages([]);
    setExistingImages([]);
    onClose();
  };

  if (!guest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Upload Images for {guest.first_name} {guest.last_name}
          </DialogTitle>
          <DialogDescription>Upload images for this guest. You can upload up to 3 images total.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Existing Images ({existingImages.length}/3)</h4>
              <div className="grid grid-cols-3 gap-3">
                {existingImages.map((imageId, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${imageId}`}
                      alt={`Existing image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                    <Button type="button" variant="destructive" size="icon" className="absolute right-1 top-1 rounded-full w-6 h-6" onClick={() => handleRemoveExistingImage(index)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          {canUploadMore && (
            <div className="space-y-3">
              <h4 className="font-medium">
                Upload New Images ({uploadedImages.length}/{maxUploadableImages})
              </h4>
              <ImageUpload value={uploadedImages} onChange={handleImagesChange} onRemove={handleRemoveImage} maxFiles={maxUploadableImages} />
            </div>
          )}

          {/* Summary */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Total images: {existingImages.length + uploadedImages.length}/3
              {!canUploadMore && uploadedImages.length === 0 && <span className="text-red-500 ml-2">Maximum images reached</span>}
            </p>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || uploadedImages.length === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Images"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
