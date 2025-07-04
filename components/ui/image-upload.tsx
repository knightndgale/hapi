"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { upload } from "@/requests/file.request";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
}

export function ImageUpload({ value, onChange, onRemove, maxFiles = 1 }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Normalize value to array for internal logic
  const valueArray: string[] = typeof value === "string" ? (value ? [value] : []) : Array.isArray(value) ? value : [];

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (valueArray.length >= maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} image${maxFiles > 1 ? "s" : ""}.`);
        return;
      }
      try {
        setIsLoading(true);
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("file", file);

        const response = await upload(formData);

        if (!response.success || !response.data) {
          toast.error(response?.message || "Failed to upload file");
          return;
        }

        let newValue: string[];
        if (maxFiles === 1) {
          newValue = [response.data.id];
        } else {
          newValue = [...valueArray, response.data.id];
        }
        onChange(maxFiles === 1 ? newValue[0] : newValue);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, valueArray, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    multiple: false,
    disabled: valueArray.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        {valueArray.map((id, idx) => {
          const imageUrl = id ? `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${id}` : undefined;
          return (
            <div key={id} className="relative aspect-video w-32 h-20 overflow-hidden rounded-lg">
              {imageUrl && <Image src={imageUrl} alt="Uploaded image" fill className="object-cover" />}
              <Button type="button" variant="destructive" size="icon" className="absolute right-2 top-2 rounded-full w-5 h-5" onClick={() => onRemove(idx)}>
                <X className="h-2 w-2 p-0 m-0" />
              </Button>
            </div>
          );
        })}
      </div>
      {valueArray.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
          <input {...getInputProps()} disabled={isLoading} />
          {isLoading ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Uploading..." : isDragActive ? `Drop the image here` : `Drag and drop an image, or click to select${maxFiles > 1 ? ` (max ${maxFiles})` : ""}`}
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
