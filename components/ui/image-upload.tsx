"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);
        const file = acceptedFiles[0];
        // TODO: Implement actual image upload logic here
        // For now, we'll just create a fake URL
        const fakeUrl = URL.createObjectURL(file);
        onChange(fakeUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setIsUploading(false);
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

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image src={value} alt="Uploaded image" fill className="object-cover" />
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
