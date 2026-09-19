import Image from "next/image";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { cn } from "@/lib/utils";

interface ProductMediaProps {
  image?: string;
  tone: "light" | "dark";
  swatch: number;
  label?: string;
  monogram?: string;
  ratio?: "square" | "portrait" | "wide";
  className?: string;
  sizes?: string;
}

// Renders the real uploaded product photo when one exists, falling back to
// the abstract studio panel for products that don't have media yet.
export function ProductMedia({
  image,
  tone,
  swatch,
  label,
  monogram,
  ratio = "portrait",
  className,
  sizes,
}: ProductMediaProps) {
  if (!image) {
    return (
      <PlaceholderVisual
        tone={tone}
        swatch={swatch}
        label={label}
        monogram={monogram}
        ratio={ratio}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-smoke",
        ratio === "square" && "aspect-square",
        ratio === "portrait" && "aspect-[4/5]",
        ratio === "wide" && "aspect-[16/9]",
        className
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        sizes={sizes ?? "(max-width: 768px) 50vw, 25vw"}
        className="object-cover"
      />
      {label && (
        <span className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink/70">
          {label}
        </span>
      )}
    </div>
  );
}
