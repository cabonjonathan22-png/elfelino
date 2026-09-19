"use client";

import Link from "next/link";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

const BRAND_LABEL: Record<CartItem["brand"], string> = {
  "el-felino": "El Felino",
  rshadow: "RShadow",
  tbe: "TBE",
};

export function CartItemRow({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 py-5">
      <Link
        href={`/shop/${item.slug}`}
        onClick={onNavigate}
        className="block h-24 w-20 shrink-0 overflow-hidden"
      >
        <ProductMedia
          image={item.image}
          tone={item.tone}
          swatch={item.swatch}
          ratio="portrait"
          className="h-full w-full"
          sizes="80px"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-ash">
              {BRAND_LABEL[item.brand]}
            </p>
            <Link
              href={`/shop/${item.slug}`}
              onClick={onNavigate}
              className="text-sm font-medium hover:opacity-60"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-xs text-ash">Taille {item.size}</p>
          </div>
          <p className="whitespace-nowrap text-sm">{formatPrice(item.price * item.quantity)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            onChange={(next) => updateQuantity(item.slug, item.size, next)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.slug, item.size)}
            className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
          >
            Retirer
          </button>
        </div>
      </div>
    </div>
  );
}
