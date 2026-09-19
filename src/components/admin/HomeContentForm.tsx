"use client";

import { useState } from "react";
import type { HomeContent } from "@/lib/types";
import { CoverImageUploader } from "@/components/admin/CoverImageUploader";
import { saveHomeContentAction } from "@/app/admin/(protected)/homepage/actions";

export function HomeContentForm({ content }: { content: HomeContent }) {
  const [heroImage, setHeroImage] = useState<string | null>(content.heroImage ?? null);
  const [storyImage, setStoryImage] = useState<string | null>(content.storyImage ?? null);
  const [athleteImage, setAthleteImage] = useState<string | null>(content.athleteImage ?? null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={saveHomeContentAction}
      onSubmit={() => setSaved(true)}
      className="max-w-2xl space-y-10"
    >
      <input type="hidden" name="heroImage" value={heroImage ?? ""} />
      <input type="hidden" name="storyImage" value={storyImage ?? ""} />
      <input type="hidden" name="athleteImage" value={athleteImage ?? ""} />

      <CoverImageUploader
        label="Bannière d'accueil (hero plein écran)"
        value={heroImage}
        onChange={setHeroImage}
        folder="home"
      />
      <CoverImageUploader
        label="Section « La Maison »"
        value={storyImage}
        onChange={setStoryImage}
        folder="home"
      />
      <CoverImageUploader
        label="Portrait ambassadeur (Erland Betaré)"
        value={athleteImage}
        onChange={setAthleteImage}
        folder="home"
      />

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="submit"
          className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-graphite"
        >
          Enregistrer
        </button>
        {saved && <span className="text-xs text-ash">Modifications enregistrées.</span>}
      </div>
    </form>
  );
}
