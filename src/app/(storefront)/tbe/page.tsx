import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/db";
import { BrandHero } from "@/components/brand/BrandHero";
import { BrandStory } from "@/components/brand/BrandStory";
import { BrandCollectionPreview } from "@/components/brand/BrandCollectionPreview";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand("tbe");
  return { title: brand?.name, description: brand?.description };
}

export default async function TbePage() {
  const brand = await getBrand("tbe");
  if (!brand) notFound();

  return (
    <>
      <BrandHero brand={brand} tone="dark" swatch={5} headline="Train Best Ever. Chaque séance compte." />
      <BrandStory brand={brand} />
      <BrandCollectionPreview brand={brand} />
    </>
  );
}
