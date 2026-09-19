import Link from "next/link";
import { getBrands } from "@/lib/db";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

const BRAND_TONE: Record<string, "light" | "dark"> = {
  "el-felino": "light",
  rshadow: "dark",
  tbe: "light",
};

const BRAND_SWATCH: Record<string, number> = {
  "el-felino": 4,
  rshadow: 3,
  tbe: 5,
};

export async function BrandShowcase() {
  const brands = await getBrands();

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Trois Univers" title="Une même exigence, trois écritures" />

        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/${brand.slug}`}
              className="group relative flex min-h-[480px] flex-col justify-end bg-white"
            >
              <CoverMedia
                image={brand.coverImage}
                tone={BRAND_TONE[brand.slug]}
                swatch={BRAND_SWATCH[brand.slug]}
                monogram={brand.shortName[0]}
                ratio="portrait"
                className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div
                className={`relative z-10 p-8 ${
                  BRAND_TONE[brand.slug] === "dark" ? "text-white" : "text-ink"
                }`}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] opacity-60">
                  {brand.heroLabel}
                </p>
                <h3 className="mt-3 font-display text-3xl italic">{brand.name}</h3>
                <p className="mt-2 text-sm opacity-70">{brand.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em]">
                  Découvrir
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
