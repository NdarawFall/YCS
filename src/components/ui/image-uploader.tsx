"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ZoomIn } from "lucide-react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
        
        // Dimension check
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => (img.onload = resolve));
        if (img.width !== 1280 || img.height !== 720) {
          throw new Error("La miniature doit être en 1280×720px.");
        }

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

  const handleRemove = async (index: number) => {
    const urlToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    if (urlToRemove && urlToRemove.includes("cloudinary.com")) {
      try {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlToRemove }),
        });
      } catch (err) {
        console.error("Erreur suppression Cloudinary:", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone — only shown when under limit */}
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

      {/* Preview Grid — single display, with delete + zoom modal */}
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
                alt={`Miniature ${idx + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />

              {/* Zoom button — click to open modal */}
              <button
                type="button"
                onClick={() => setPreviewUrl(url)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Voir en grand"
              >
                <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors shadow z-10"
                title="Supprimer"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {/* Index badge */}
              <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
                {idx + 1}/{maxImages}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-5xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Aperçu miniature"
              className="w-full h-auto rounded-2xl shadow-2xl border border-white/10"
            />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
              title="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
