import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getBrands } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Modifier le produit" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">{product.name}</h1>
        <p className="mt-1 text-sm text-ash">Modifier ce produit.</p>
      </div>
      <ProductForm product={product} brands={getBrands()} />
    </div>
  );
}
