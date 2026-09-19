import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { DropSection } from "@/components/home/DropSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <BrandShowcase />
      <DropSection />

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <PlaceholderVisual tone="dark" swatch={6} monogram="M" ratio="wide" className="order-2 lg:order-1" />
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="La Maison" title="Une même exigence, trois écritures distinctes" />
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-ash sm:text-base">
              El Felino, RShadow et TBE partagent un socle commun — une esthétique noir et blanc,
              une exigence de matière et de coupe — tout en cultivant chacune une identité propre :
              la grâce féline, l&apos;intensité de l&apos;ombre, la discipline de la performance.
            </p>
            <div className="mt-8">
              <Button href="/the-house" size="lg">
                Découvrir The House
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
