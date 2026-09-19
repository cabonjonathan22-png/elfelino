import Link from "next/link";
import { getLimitedProducts } from "@/lib/db";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";

export function DropSection() {
  const drops = getLimitedProducts(4);

  return (
    <section className="border-t border-line bg-smoke py-20 sm:py-28">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Le Drop du Moment" title="Éditions limitées" />
          <Link
            href="/shop?limited=1"
            className="text-[11px] font-medium uppercase tracking-[0.16em] underline"
          >
            Voir toute la collection
          </Link>
        </div>

        <div className="mt-12">
          <ProductGrid products={drops} />
        </div>
      </Container>
    </section>
  );
}
