"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveProduct, deleteProduct } from "@/lib/db";
import type { Product, ProductCategory, ProductSizeStock } from "@/lib/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveProductAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "") || randomUUID();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || name);

  let sizes: ProductSizeStock[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("sizesJson") || "[]")) as ProductSizeStock[];
    sizes = parsed
      .filter((s) => s.size && s.size.trim())
      .map((s) => ({ size: s.size.trim(), stock: Math.max(0, Number(s.stock) || 0) }));
  } catch {
    sizes = [];
  }

  const compareAtPriceRaw = String(formData.get("compareAtPrice") || "").trim();

  const product: Product = {
    id,
    slug,
    brand: String(formData.get("brand") || "el-felino") as Product["brand"],
    name,
    category: String(formData.get("category") || "accessoire") as ProductCategory,
    price: Number(formData.get("price")) || 0,
    compareAtPrice: compareAtPriceRaw ? Number(compareAtPriceRaw) : undefined,
    currency: "EUR",
    description: String(formData.get("description") || ""),
    composition: String(formData.get("composition") || ""),
    care: String(formData.get("care") || ""),
    sizes,
    isNew: formData.get("isNew") === "on",
    isLimited: formData.get("isLimited") === "on",
    tone: (String(formData.get("tone") || "light") as Product["tone"]),
    swatch: Number(formData.get("swatch")) || 1,
  };

  saveProduct(product);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  deleteProduct(id);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
