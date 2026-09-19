import type { Metadata } from "next";
import { getBrands } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Nouveau produit</h1>
        <p className="mt-1 text-sm text-ash">Ajouter un article au catalogue MAISON.</p>
      </div>
      <ProductForm brands={brands} />
    </div>
  );
}
