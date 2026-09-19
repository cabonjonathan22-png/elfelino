import type { Brand } from "@/lib/types";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface BrandHeroProps {
  brand: Brand;
  tone: "light" | "dark";
  swatch: number;
  headline: string;
}

export function BrandHero({ brand, tone, swatch, headline }: BrandHeroProps) {
  const dark = tone === "dark";

  return (
    <section className={cn("relative flex min-h-[80vh] items-end overflow-hidden", dark ? "bg-ink" : "bg-smoke")}>
      <PlaceholderVisual
        tone={tone}
        swatch={swatch}
        monogram={brand.shortName[0]}
        ratio="wide"
        className="absolute inset-0 h-full w-full"
      />
      <div
        className={cn(
          "absolute inset-0",
          dark
            ? "bg-gradient-to-t from-black/85 via-black/25 to-black/10"
            : "bg-gradient-to-t from-white/90 via-white/20 to-transparent"
        )}
      />

      <Container className="relative z-10 flex w-full flex-col gap-6 py-16 sm:py-20">
        <p
          className={cn(
            "text-[11px] font-medium uppercase tracking-[0.3em]",
            dark ? "text-white/70" : "text-ink/60"
          )}
        >
          {brand.heroLabel}
        </p>
        <h1
          className={cn(
            "max-w-3xl font-display text-5xl italic leading-[1.05] sm:text-6xl lg:text-7xl",
            dark ? "text-white" : "text-ink"
          )}
        >
          {headline}
        </h1>
        <p className={cn("max-w-md text-sm sm:text-base", dark ? "text-white/70" : "text-ink/70")}>
          {brand.tagline}
        </p>
        <div className="flex gap-4 pt-2">
          <Button
            href={`/shop?brand=${brand.slug}`}
            size="lg"
            variant={dark ? "outline-light" : "primary"}
            className={dark ? "border-white text-white" : undefined}
          >
            Voir la collection
          </Button>
        </div>
      </Container>
    </section>
  );
}
