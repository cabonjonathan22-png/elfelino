"use server";

import { revalidatePath } from "next/cache";
import { saveHomeContent } from "@/lib/db";
import type { HomeContent } from "@/lib/types";

export async function saveHomeContentAction(formData: FormData): Promise<void> {
  const content: HomeContent = {
    heroImage: String(formData.get("heroImage") || "").trim() || undefined,
    storyImage: String(formData.get("storyImage") || "").trim() || undefined,
    athleteImage: String(formData.get("athleteImage") || "").trim() || undefined,
  };

  await saveHomeContent(content);
  revalidatePath("/", "layout");
}
