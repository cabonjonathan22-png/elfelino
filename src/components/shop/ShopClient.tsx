"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Brand, Product, ProductCategory } from "@/lib/types";
import { ShopFilters, type SortOption } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/product/ProductGrid";

interface ShopClientProps {
  products: Product[];
  brands: Brand[];
}

export function ShopClient({ products, brands }: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeBrand, setActiveBrand] = useState<string | null>(searchParams.get("brand"));
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(
    (searchParams.get("category") as ProductCategory) || null
  );
  const [limitedOnly, setLimitedOnly] = useState(searchParams.get("limited") === "1");
  const [sort, setSort] = useState<SortOption>("featured");

  function syncUrl(next: {
    brand?: string | null;
    category?: ProductCategory | null;
    limited?: boolean;
  }) {
    const params = new URLSearchParams(searchParams.toString());
    const brand = next.brand !== undefined ? next.brand : activeBrand;
    const category = next.category !== undefined ? next.category : activeCategory;
    const limited = next.limited !== undefined ? next.limited : limitedOnly;

    if (brand) params.set("brand", brand);
    else params.delete("brand");
    if (category) params.set("category", category);
    else params.delete("category");
    if (limited) params.set("limited", "1");
    else params.delete("limited");

    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (activeBrand && p.brand !== activeBrand) return false;
      if (activeCategory && p.category !== activeCategory) return false;
      if (limitedOnly && !p.isLimited) return false;
      return true;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [products, activeBrand, activeCategory, limitedOnly, sort]);

  return (
    <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
      <ShopFilters
        brands={brands}
        activeBrand={activeBrand}
        activeCategory={activeCategory}
        limitedOnly={limitedOnly}
        sort={sort}
        onBrandChange={(brand) => {
          setActiveBrand(brand);
          syncUrl({ brand });
        }}
        onCategoryChange={(category) => {
          setActiveCategory(category);
          syncUrl({ category });
        }}
        onLimitedToggle={() => {
          setLimitedOnly((v) => {
            syncUrl({ limited: !v });
            return !v;
          });
        }}
        onSortChange={setSort}
        onReset={() => {
          setActiveBrand(null);
          setActiveCategory(null);
          setLimitedOnly(false);
          setSort("featured");
          router.replace("/shop", { scroll: false });
        }}
        resultCount={filtered.length}
      />

      <ProductGrid products={filtered} />
    </div>
  );
}
