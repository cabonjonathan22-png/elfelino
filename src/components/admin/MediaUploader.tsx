"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

const UPLOAD_URL = "/api/admin/upload";

interface MediaUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  video: string | null;
  onVideoChange: (video: string | null) => void;
}

export function MediaUploader({ images, onImagesChange, video, onVideoChange }: MediaUploaderProps) {
  const [uploadingImages, setUploadingImages] = useState(0);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const fileArray = Array.from(files);
    setUploadingImages((n) => n + fileArray.length);

    for (const file of fileArray) {
      try {
        const blob = await upload(`products/${crypto.randomUUID()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: UPLOAD_URL,
        });
        onImagesChange([...images, blob.url]);
      } catch {
        setError("Échec de l'envoi d'une image. Réessaie.");
      } finally {
        setUploadingImages((n) => n - 1);
      }
    }
  }

  async function handleVideoFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploadingVideo(true);
    try {
      const blob = await upload(`products/${crypto.randomUUID()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: UPLOAD_URL,
      });
      onVideoChange(blob.url);
    } catch {
      setError("Échec de l'envoi de la vidéo. Réessaie.");
    } finally {
      setUploadingVideo(false);
    }
  }

  function removeImage(url: string) {
    onImagesChange(images.filter((i) => i !== url));
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Photos du produit
          </span>
          <label className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.14em] underline">
            {uploadingImages > 0 ? `Envoi en cours (${uploadingImages})…` : "+ Ajouter des photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void handleImageFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {images.map((url, i) => (
              <div key={url} className="group relative aspect-square overflow-hidden border border-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                {i === 0 && (
                  <span className="absolute left-1 top-1 bg-ink px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-white">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-white/90 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Retirer cette photo"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">
            Vidéo du produit
          </span>
          <label className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.14em] underline">
            {uploadingVideo ? "Envoi en cours…" : video ? "Remplacer la vidéo" : "+ Ajouter une vidéo"}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                void handleVideoFile(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>

        {video && (
          <div className="relative mt-3 w-48 overflow-hidden border border-mist">
            <video src={video} className="w-full" controls />
            <button
              type="button"
              onClick={() => onVideoChange(null)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-white/90 text-xs"
              aria-label="Retirer la vidéo"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
