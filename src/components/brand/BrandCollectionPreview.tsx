import Link from "next/link";
import type { Brand } from "@/lib/types";
import { getProductsByBrand } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export function BrandCollectionPreview({ brand }: { brand: Brand }) {
  const products = getProductsByBrand(brand.slug).slice(0, 8);

  return (
    <section className="border-t border-line bg-smoke py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Collection Phare" title={`L'univers ${brand.name}`} />
          <Link
            href={`/shop?brand=${brand.slug}`}
            className="text-[11px] font-medium uppercase tracking-[0.16em] underline"
          >
            Voir toute la collection
          </Link>
        </div>

        <div className="mt-12">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
