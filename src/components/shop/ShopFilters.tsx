"use client";

import type { Brand, ProductCategory } from "@/lib/types";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

export type SortOption = "featured" | "price-asc" | "price-desc";

interface ShopFiltersProps {
  brands: Brand[];
  activeBrand: string | null;
  activeCategory: ProductCategory | null;
  limitedOnly: boolean;
  sort: SortOption;
  onBrandChange: (brand: string | null) => void;
  onCategoryChange: (category: ProductCategory | null) => void;
  onLimitedToggle: () => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  resultCount: number;
}

const CATEGORY_ENTRIES = Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][];

export function ShopFilters({
  brands,
  activeBrand,
  activeCategory,
  limitedOnly,
  sort,
  onBrandChange,
  onCategoryChange,
  onLimitedToggle,
  onSortChange,
  onReset,
  resultCount,
}: ShopFiltersProps) {
  const hasActiveFilters = activeBrand || activeCategory || limitedOnly;

  return (
    <div className="space-y-8 lg:sticky lg:top-24">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">Marque</p>
        <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-2.5">
          <FilterPill active={!activeBrand} onClick={() => onBrandChange(null)}>
            Toutes les marques
          </FilterPill>
          {brands.map((brand) => (
            <FilterPill
              key={brand.slug}
              active={activeBrand === brand.slug}
              onClick={() => onBrandChange(brand.slug)}
            >
              {brand.name}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">Catégorie</p>
        <div className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:items-start lg:gap-2.5">
          <FilterPill active={!activeCategory} onClick={() => onCategoryChange(null)}>
            Toutes les catégories
          </FilterPill>
          {CATEGORY_ENTRIES.map(([key, label]) => (
            <FilterPill key={key} active={activeCategory === key} onClick={() => onCategoryChange(key)}>
              {label}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">Drops</p>
        <div className="mt-4">
          <FilterPill active={limitedOnly} onClick={onLimitedToggle}>
            Éditions limitées uniquement
          </FilterPill>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">Trier par</p>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="mt-4 w-full border border-mist bg-white px-3 py-2 text-sm focus:outline-none"
        >
          <option value="featured">Mise en avant</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      <div className="flex items-center justify-between border-t border-line pt-5 text-xs text-ash">
        <span>{resultCount} article(s)</span>
        {hasActiveFilters && (
          <button type="button" onClick={onReset} className="underline hover:text-ink">
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors",
        active ? "border-ink bg-ink text-white" : "border-mist text-ink/70 hover:border-ink"
      )}
    >
      {children}
    </button>
  );
}
