"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUploader({
  images = [],
  onChange,
  maxImages = 3,
  label = "Glissez vos images ou cliquez pour uploader",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!cloudName || !uploadPreset) {
      setError("Configuration Cloudinary manquante dans .env.local");
      return;
    }

    if (images.length + files.length > maxImages) {
      setError(`Vous pouvez uploader au maximum ${maxImages} image(s).`);
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else if (data.error) {
          throw new Error(data.error.message || "Échec de l'upload Cloudinary");
        }
      }

      onChange([...images, ...uploadedUrls]);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/30 hover:border-primary/60 bg-primary/5 hover:bg-primary/10 transition-colors p-6 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer text-center"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={maxImages > 1}
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm font-medium text-muted-foreground">Upload vers Cloudinary en cours...</span>
            </div>
          ) : (
            <>
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WebP (Max {maxImages} image{maxImages > 1 ? "s" : ""} - {images.length}/{maxImages})
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-lg overflow-hidden border border-border/80 bg-muted/40 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-destructive text-white rounded-full transition-colors shadow"
                title="Supprimer l'image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/60 hover:bg-black/80 text-[10px] text-white rounded backdrop-blur-xs transition-colors"
              >
                Ouvrir ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
