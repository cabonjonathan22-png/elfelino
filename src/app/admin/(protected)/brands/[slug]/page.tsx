import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBrand } from "@/lib/db";
import { BrandForm } from "@/components/admin/BrandForm";

export const metadata: Metadata = { title: "Modifier la marque" };

interface EditBrandPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { slug } = await params;
  const brand = await getBrand(slug);
  if (!brand) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">{brand.name}</h1>
        <p className="mt-1 text-sm text-ash">Contenu éditorial de la page marque.</p>
      </div>
      <BrandForm brand={brand} />
    </div>
  );
}
