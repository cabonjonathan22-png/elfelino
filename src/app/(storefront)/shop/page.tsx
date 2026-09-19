import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShopClient } from "@/components/shop/ShopClient";
import { getProducts, getBrands } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop",
  description: "La boutique MAISON — El Felino, RShadow et TBE. Filtrez par marque et par catégorie.",
};

export default async function ShopPage() {
  const [products, brands] = await Promise.all([getProducts(), getBrands()]);

  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="La Boutique" title="Toute la collection" />

        <div className="mt-12">
          <Suspense fallback={null}>
            <ShopClient products={products} brands={brands} />
          </Suspense>
        </div>
      </Container>
    </div>
  );
}
