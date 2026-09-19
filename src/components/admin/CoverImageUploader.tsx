"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

const UPLOAD_URL = "/api/admin/upload";

interface CoverImageUploaderProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}

export function CoverImageUploader({ label, value, onChange, folder }: CoverImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const blob = await upload(`${folder}/${crypto.randomUUID()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: UPLOAD_URL,
      });
      onChange(blob.url);
    } catch {
      setError("Échec de l'envoi. Réessaie.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash">{label}</span>
        <label className="cursor-pointer text-[11px] font-medium uppercase tracking-[0.14em] underline">
          {uploading ? "Envoi…" : value ? "Remplacer" : "+ Ajouter une image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {value && (
        <div className="group relative mt-3 aspect-video w-full max-w-sm overflow-hidden border border-mist">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-white/90 text-sm opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Retirer l'image"
          >
            ×
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
