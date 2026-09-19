import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/db";
import { BrandHero } from "@/components/brand/BrandHero";
import { BrandStory } from "@/components/brand/BrandStory";
import { BrandCollectionPreview } from "@/components/brand/BrandCollectionPreview";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand("rshadow");
  return { title: brand?.name, description: brand?.description };
}

export default async function RShadowPage() {
  const brand = await getBrand("rshadow");
  if (!brand) notFound();

  return (
    <>
      <BrandHero
        brand={brand}
        tone="dark"
        swatch={1}
        headline="Entraîne-toi dans l'ombre. Brille sous la lumière."
      />
      <BrandStory brand={brand} />
      <BrandCollectionPreview brand={brand} />
    </>
  );
}
