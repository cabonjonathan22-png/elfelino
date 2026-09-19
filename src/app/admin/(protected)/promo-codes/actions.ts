"use server";

import { revalidatePath } from "next/cache";
import { savePromoCode, deletePromoCode } from "@/lib/db";
import type { PromoCode } from "@/lib/types";

export async function savePromoCodeAction(formData: FormData): Promise<void> {
  const previousCode = String(formData.get("previousCode") || "");
  const promo: PromoCode = {
    code: String(formData.get("code") || "").trim().toUpperCase(),
    type: String(formData.get("type") || "percent") as PromoCode["type"],
    value: Number(formData.get("value")) || 0,
    description: String(formData.get("description") || ""),
  };
  if (!promo.code) return;
  await savePromoCode(promo, previousCode || undefined);
  revalidatePath("/", "layout");
}

export async function deletePromoCodeAction(formData: FormData): Promise<void> {
  const code = String(formData.get("previousCode") || formData.get("code") || "");
  await deletePromoCode(code);
  revalidatePath("/", "layout");
}
