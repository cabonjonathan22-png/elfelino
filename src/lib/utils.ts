import type { Product } from "@/lib/types";

export function totalStock(product: Product): number {
  return product.sizes.reduce((sum, s) => sum + s.stock, 0);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
