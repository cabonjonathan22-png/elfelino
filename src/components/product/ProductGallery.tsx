"use client";

import { useState } from "react";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const VIEW_LABELS = ["Face", "Dos", "Détail", "Porté"];

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  // Simulated multi-angle gallery: same abstract visual system, rotated
  // through neighbouring swatch variants so each "photo" reads distinctly.
  const views = VIEW_LABELS.map((_, i) => ((product.swatch - 1 + i) % 6) + 1);

  return (
    <div>
      <div className="overflow-hidden bg-smoke">
        <PlaceholderVisual
          tone={product.tone}
          swatch={views[active]}
          monogram={product.name[0]}
          ratio="portrait"
          className="w-full"
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3">
        {VIEW_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "overflow-hidden border transition-colors",
              active === i ? "border-ink" : "border-transparent"
            )}
          >
            <PlaceholderVisual tone={product.tone} swatch={views[i]} label={label} ratio="square" />
          </button>
        ))}
      </div>
    </div>
  );
}
