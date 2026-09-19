"use client";

import { useState } from "react";
import Image from "next/image";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const VIEW_LABELS = ["Face", "Dos", "Détail", "Porté"];

type Slide = { type: "image"; url: string } | { type: "video"; url: string };

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const hasMedia = (product.images && product.images.length > 0) || product.video;

  if (hasMedia) {
    const slides: Slide[] = [
      ...(product.images ?? []).map((url) => ({ type: "image" as const, url })),
      ...(product.video ? [{ type: "video" as const, url: product.video }] : []),
    ];
    const activeSlide = slides[Math.min(active, slides.length - 1)];

    return (
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-smoke">
          {activeSlide.type === "image" ? (
            <Image
              src={activeSlide.url}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <video
              src={activeSlide.url}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
            />
          )}
        </div>

        {slides.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-3">
            {slides.map((slide, i) => (
              <button
                key={slide.url}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-square overflow-hidden border transition-colors",
                  active === i ? "border-ink" : "border-transparent"
                )}
              >
                {slide.type === "image" ? (
                  <Image src={slide.url} alt="" fill sizes="120px" className="object-cover" />
                ) : (
                  <>
                    <video src={slide.url} className="h-full w-full object-cover" muted />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-lg text-white">
                      ▶
                    </span>
                  </>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback for products without uploaded media yet: simulated multi-angle
  // gallery using the abstract studio panel system.
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
