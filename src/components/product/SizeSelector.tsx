"use client";

import type { ProductSizeStock } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: {
  sizes: ProductSizeStock[];
  selected: string | null;
  onSelect: (size: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {sizes.map(({ size, stock }) => {
        const disabled = stock <= 0;
        return (
          <button
            key={size}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(size)}
            title={disabled ? "Épuisé" : `${stock} en stock`}
            className={cn(
              "relative flex h-11 min-w-11 items-center justify-center border px-3 text-xs font-medium uppercase tracking-wide transition-colors",
              disabled
                ? "cursor-not-allowed border-line text-ash/50 line-through"
                : selected === size
                ? "border-ink bg-ink text-white"
                : "border-mist hover:border-ink"
            )}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
