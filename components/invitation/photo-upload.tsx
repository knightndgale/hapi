"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImagePreview {
  id: string;
  url: string;
  file: File;
}

interface PhotoUploadProps {
  onImagesChange: (images: File[]) => void;
}

export function PhotoUpload({ onImagesChange }: PhotoUploadProps) {
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setError("");

    // Check if adding new images would exceed the limit
    if (images.length + files.length > 3) {
      setError("You can only upload up to 3 images");
      return;
    }

    Array.from(files).forEach((file) => {
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [
          ...images,
          {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            file,
          },
        ];
        setImages(newImages);
        onImagesChange(newImages.map((img) => img.file));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);
    onImagesChange(newImages.map((img) => img.file));
  };

  return (
    <div className="space-y-2">
      <Label className="text-black font-medium">Upload Photos (Optional)</Label>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" id="image-upload" />
          <Label htmlFor="image-upload" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <Upload className="text-black w-4 h-4" />
            <span className="text-sm text-black">Upload Pre-Wedding Memories</span>
          </Label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{images.length}/3 images (max 5MB each)</span>
            <span className="text-xs text-gray-500 italic">These photos will be displayed during the event!</span>
          </div>
          <p className="text-sm text-gray-600">Upload images of cherished moments with the bride or groom before the wedding. We&apos;d love to see old pictures of you with them! 📸</p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image src={image.url} alt="Preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
