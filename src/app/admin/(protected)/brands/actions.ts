"use server";

import { revalidatePath } from "next/cache";
import { saveBrand } from "@/lib/db";
import type { Brand, BrandValue } from "@/lib/types";

export async function saveBrandAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") || "") as Brand["slug"];
  if (!slug) return;

  let values: BrandValue[] = [];
  try {
    values = JSON.parse(String(formData.get("valuesJson") || "[]")) as BrandValue[];
  } catch {
    values = [];
  }

  const story = String(formData.get("story") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const brand: Brand = {
    slug,
    name: String(formData.get("name") || ""),
    shortName: String(formData.get("shortName") || ""),
    tagline: String(formData.get("tagline") || ""),
    positioning: String(formData.get("positioning") || ""),
    description: String(formData.get("description") || ""),
    heroLabel: String(formData.get("heroLabel") || ""),
    story,
    values: values.filter((v) => v.title.trim()),
  };

  saveBrand(brand);
  revalidatePath("/", "layout");
}
