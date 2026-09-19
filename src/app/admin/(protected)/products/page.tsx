import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getBrands } from "@/lib/db";
import { totalStock } from "@/lib/utils";
import { ProductsTable, type ProductRow } from "@/components/admin/ProductsTable";

export const metadata: Metadata = { title: "Produits" };

export default async function AdminProductsPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);
  const brandName = (slug: string) => brands.find((b) => b.slug === slug)?.name;

  const rows: ProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    brandName: brandName(product.brand),
    category: product.category,
    price: product.price,
    stock: totalStock(product),
    isNew: product.isNew,
    isLimited: product.isLimited,
    thumbnail: product.images?.[0],
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Produits</h1>
          <p className="mt-1 text-sm text-ash">{products.length} article(s) au catalogue.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.16em] text-white hover:bg-graphite"
        >
          + Nouveau produit
        </Link>
      </div>

      <ProductsTable products={rows} />
    </div>
  );
}
