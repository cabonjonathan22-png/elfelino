import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/db";
import { BrandHero } from "@/components/brand/BrandHero";
import { BrandStory } from "@/components/brand/BrandStory";
import { BrandCollectionPreview } from "@/components/brand/BrandCollectionPreview";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand("el-felino");
  return { title: brand?.name, description: brand?.description };
}

export default async function ElFelinoPage() {
  const brand = await getBrand("el-felino");
  if (!brand) notFound();

  return (
    <>
      <BrandHero brand={brand} tone="light" swatch={4} headline="La grâce ne fait aucun bruit." />
      <BrandStory brand={brand} />
      <BrandCollectionPreview brand={brand} />
    </>
  );
}
