"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bulkDeleteProductsAction } from "@/app/admin/(protected)/products/actions";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

export interface ProductRow {
  id: string;
  name: string;
  brandName?: string;
  category: ProductCategory;
  price: number;
  stock: number;
  isNew?: boolean;
  isLimited?: boolean;
  thumbnail?: string;
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const allSelected = products.length > 0 && selected.size === products.length;
  const someSelected = selected.size > 0 && !allSelected;

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    const count = selected.size;
    if (count === 0) return;
    if (!confirm(`Supprimer définitivement ${count} produit(s) sélectionné(s) ?`)) return;

    setDeleting(true);
    try {
      await bulkDeleteProductsAction(Array.from(selected));
      setSelected(new Set());
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-3">
      {selected.size > 0 && (
        <div className="flex items-center justify-between border border-ink bg-smoke px-4 py-3">
          <span className="text-sm">{selected.size} produit(s) sélectionné(s)</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={deleting}
              className="bg-red-600 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Suppression…" : "Supprimer la sélection"}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-line bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] uppercase tracking-[0.12em] text-ash">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-black"
                  aria-label="Tout sélectionner"
                />
              </th>
              <th className="px-4 py-3 font-medium">Produit</th>
              <th className="px-4 py-3 font-medium">Marque</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((product) => (
              <tr key={product.id} className={selected.has(product.id) ? "bg-smoke" : undefined}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleOne(product.id)}
                    className="h-4 w-4 accent-black"
                    aria-label={`Sélectionner ${product.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="h-10 w-10 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 shrink-0 bg-smoke" />
                    )}
                    <div>
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
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ash">{product.brandName}</td>
                <td className="px-4 py-3 text-ash">{PRODUCT_CATEGORY_LABELS[product.category]}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-ink" : "text-ash"
                    }
                  >
                    {product.stock === 0 ? "Épuisé" : product.stock}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
