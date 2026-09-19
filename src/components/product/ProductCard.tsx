import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductMedia } from "@/components/ui/ProductMedia";
import { formatPrice, totalStock } from "@/lib/utils";

const BRAND_LABEL: Record<Product["brand"], string> = {
  "el-felino": "El Felino",
  rshadow: "RShadow",
  tbe: "TBE",
};

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = totalStock(product) === 0;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-smoke">
        <ProductMedia
          image={product.images?.[0]}
          tone={product.tone}
          swatch={product.swatch}
          label={BRAND_LABEL[product.brand]}
          ratio="portrait"
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
              Nouveau
            </span>
          )}
          {product.isLimited && (
            <span className="bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
              Édition limitée
            </span>
          )}
          {outOfStock && (
            <span className="bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-ash">
              Épuisé
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-ash">
            {BRAND_LABEL[product.brand]}
          </p>
          <h3 className="mt-1 text-sm font-medium">{product.name}</h3>
        </div>
        <div className="text-right text-sm">
          {product.compareAtPrice && (
            <p className="text-xs text-ash line-through">{formatPrice(product.compareAtPrice)}</p>
          )}
          <p>{formatPrice(product.price)}</p>
        </div>
      </div>
    </Link>
  );
}
