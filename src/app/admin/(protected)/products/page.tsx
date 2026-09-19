import Link from "next/link";
import type { Metadata } from "next";
import { getProducts, getBrand } from "@/lib/db";
import { totalStock, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";

export const metadata: Metadata = { title: "Produits" };

export default function AdminProductsPage() {
  const products = getProducts();

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

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.12em] text-ash">
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Marque</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => {
              const stock = totalStock(product);
              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <div className="mt-1 flex gap-1.5">
                      {product.isNew && (
                        <span className="bg-smoke px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                          Nouveau
                        </span>
                      )}
                      {product.isLimited && (
                        <span className="bg-ink px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white">
                          Limité
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ash">{getBrand(product.brand)?.name}</td>
                  <td className="px-4 py-3 text-ash">{PRODUCT_CATEGORY_LABELS[product.category]}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <span className={stock === 0 ? "text-red-600" : stock <= 5 ? "text-ink" : "text-ash"}>
                      {stock === 0 ? "Épuisé" : stock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-[11px] font-medium uppercase tracking-[0.14em] underline"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
