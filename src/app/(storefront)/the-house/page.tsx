import type { Metadata } from "next";
import Link from "next/link";
import { getBrands } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "The House",
  description:
    "The House — la vision qui réunit El Felino, RShadow et TBE : une même exigence, trois écritures.",
};

const PILLARS = [
  {
    title: "Exigence",
    text: "Chaque pièce, chaque marque, répond au même standard : une matière juste, une coupe pensée, une finition qui ne souffre aucune approximation.",
  },
  {
    title: "Noir & Blanc",
    text: "Le langage visuel de la maison ne change jamais. Le contraste comme signature, l'épure comme discipline créative.",
  },
  {
    title: "Ancrage",
    text: "Trois marques nées du même terrain — le mouvement, l'effort, la ville — et construites pour durer au-delà des saisons.",
  },
];

const BRAND_TONE: Record<string, "light" | "dark"> = {
  "el-felino": "light",
  rshadow: "dark",
  tbe: "dark",
};

const BRAND_SWATCH: Record<string, number> = {
  "el-felino": 6,
  rshadow: 2,
  tbe: 4,
};

export default function TheHousePage() {
  const brands = getBrands();

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-ink">
        <PlaceholderVisual tone="dark" swatch={3} ratio="wide" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <Container className="relative z-10 py-16 sm:py-20">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
            The House
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl italic leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Une maison. Trois écritures. Une seule exigence.
          </h1>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="max-w-3xl">
          <p className="font-display text-2xl italic leading-relaxed sm:text-3xl">
            EL FELINO, RSHADOW et TBE ne sont pas trois marques qui cohabitent — elles sont trois
            réponses à une même question : comment habiller le mouvement sans jamais trahir
            l&apos;allure.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-ash sm:text-base">
            La Maison est née de cette conviction. Chacune de ses lignes explore un territoire
            différent — la grâce féline, l&apos;intensité de l&apos;entraînement dans l&apos;ombre,
            la discipline de la performance — mais toutes partagent le même socle : une exigence de
            matière, une écriture noir et blanc, et un ancrage commun dans le mouvement réel, celui
            de la rue comme celui de la salle.
          </p>
        </Container>
      </section>

      <section className="border-t border-line bg-smoke py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Le Socle Commun" title="Ce qui relie les trois marques" />
          <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <div key={pillar.title} className="bg-white p-8">
                <span className="font-display text-3xl italic text-ash">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-sm font-medium uppercase tracking-[0.14em]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{pillar.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Trois Écritures" title="Une identité pour chaque univers" />

          <div className="mt-14 space-y-20">
            {brands.map((brand, i) => (
              <div
                key={brand.slug}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <PlaceholderVisual
                  tone={BRAND_TONE[brand.slug]}
                  swatch={BRAND_SWATCH[brand.slug]}
                  monogram={brand.shortName[0]}
                  ratio="wide"
                />
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
                    {brand.heroLabel}
                  </p>
                  <h3 className="mt-3 font-display text-3xl italic sm:text-4xl">{brand.name}</h3>
                  <p className="mt-2 text-sm font-medium text-ash">{brand.positioning}</p>
                  <p className="mt-5 text-sm leading-relaxed text-ash sm:text-base">
                    {brand.description}
                  </p>
                  <Link
                    href={`/${brand.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] underline"
                  >
                    Découvrir {brand.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
