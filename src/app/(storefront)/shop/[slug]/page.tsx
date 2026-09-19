import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductsByBrand, getBrand } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatPrice, totalStock } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [brand, brandProducts] = await Promise.all([
    getBrand(product.brand),
    getProductsByBrand(product.brand),
  ]);
  const related = brandProducts.filter((p) => p.id !== product.id).slice(0, 4);
  const stock = totalStock(product);

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ash">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          {brand && (
            <>
              <Link href={`/shop?brand=${brand.slug}`} className="hover:text-ink">
                {brand.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
              {brand?.name}
            </p>
            <h1 className="mt-2 font-display text-3xl italic sm:text-4xl">{product.name}</h1>

            <div className="mt-4 flex items-baseline gap-3">
              {product.compareAtPrice && (
                <span className="text-sm text-ash line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              <span className="text-xl">{formatPrice(product.price)}</span>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-ash">{product.description}</p>

            <div className="mt-8 border-t border-line pt-8">
              <AddToCartForm product={product} />
            </div>

            <dl className="mt-10 space-y-4 border-t border-line pt-8 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ash">Composition</dt>
                <dd className="text-right">{product.composition}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ash">Entretien</dt>
                <dd className="text-right">{product.care}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ash">Disponibilité</dt>
                <dd className="text-right">{stock > 0 ? `${stock} pièce(s) au total` : "Épuisé"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ash">Livraison</dt>
                <dd className="text-right">Expédition en 24 à 48h ouvrées</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="mt-24 border-t border-line bg-smoke py-20 sm:py-24">
          <Container>
            <SectionHeading eyebrow={brand?.name} title="Complète le look" />
            <div className="mt-12">
              <ProductGrid products={related} />
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
