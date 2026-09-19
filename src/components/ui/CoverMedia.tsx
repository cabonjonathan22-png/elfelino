import Image from "next/image";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { cn } from "@/lib/utils";

interface CoverMediaProps {
  image?: string;
  tone: "light" | "dark";
  swatch: number;
  monogram?: string;
  ratio?: "square" | "portrait" | "wide";
  className?: string;
  sizes?: string;
}

// Full-bleed cover variant of ProductMedia, for brand heroes and homepage
// banners that need "absolute inset-0" placement behind overlaid text.
export function CoverMedia({
  image,
  tone,
  swatch,
  monogram,
  ratio = "portrait",
  className,
  sizes,
}: CoverMediaProps) {
  if (!image) {
    return (
      <PlaceholderVisual
        tone={tone}
        swatch={swatch}
        monogram={monogram}
        ratio={ratio}
        className={className}
      />
    );
  }

  // Same cascade-order pitfall as PlaceholderVisual: omit "relative"
  // entirely when the caller supplies "absolute" so it can't win.
  const callerSetsPosition = className?.includes("absolute");

  return (
    <div
      className={cn(
        "overflow-hidden bg-smoke",
        !callerSetsPosition && "relative",
        ratio === "square" && "aspect-square",
        ratio === "portrait" && "aspect-[4/5]",
        ratio === "wide" && "aspect-[16/9]",
        className
      )}
    >
      <Image src={image} alt="" fill sizes={sizes ?? "100vw"} className="object-cover" priority />
    </div>
  );
}
