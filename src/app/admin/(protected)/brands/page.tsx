import Link from "next/link";
import type { Metadata } from "next";
import { getBrands } from "@/lib/db";

export const metadata: Metadata = { title: "Marques" };

export default function AdminBrandsPage() {
  const brands = getBrands();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-medium">Marques</h1>
        <p className="mt-1 text-sm text-ash">Contenu éditorial des 3 marques de la maison.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/admin/brands/${brand.slug}`}
            className="border border-line bg-white p-5 hover:border-ink"
          >
            <p className="font-display text-xl italic">{brand.name}</p>
            <p className="mt-2 text-sm text-ash">{brand.tagline}</p>
            <span className="mt-4 inline-block text-[11px] font-medium uppercase tracking-[0.14em] underline">
              Modifier
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
