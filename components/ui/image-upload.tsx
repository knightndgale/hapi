"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { upload } from "@/requests/file.request";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        const response = await upload(formData);

        if (!response.success || !response.data) {
          toast.error(response?.message || "Failed to upload file");
          return;
        }

        onChange(response.data.id);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  });

  const imageUrl = value ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${value}` : undefined;

  return (
    <div className="space-y-4">
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image src={imageUrl} alt="Uploaded image" fill className="object-cover" />
          <Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary"
          }`}>
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{isDragActive ? "Drop the image here" : "Drag and drop an image, or click to select"}</p>
          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
