"use server";

import { revalidatePath } from "next/cache";
import { createAccessCode, revokeAccessCode } from "@/lib/db";

export async function createAccessCodeAction(formData: FormData): Promise<void> {
  const label = String(formData.get("label") || "");
  createAccessCode(label);
  revalidatePath("/admin/access-codes");
}

export async function revokeAccessCodeAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  revokeAccessCode(id);
  revalidatePath("/admin/access-codes");
}
