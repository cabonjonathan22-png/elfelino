"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "pending") as OrderStatus;
  updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}
