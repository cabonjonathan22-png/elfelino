import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink">
      <PlaceholderVisual
        tone="dark"
        swatch={2}
        ratio="wide"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      <Container className="relative z-10 flex w-full flex-col gap-10 py-16 sm:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/70">
          Maison de Sportswear — El Felino · RShadow · TBE
        </p>

        <h1 className="max-w-4xl font-display text-5xl italic leading-[1.02] text-white sm:text-6xl lg:text-7xl">
          Le mouvement, sans compromis.
        </h1>

        <p className="max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
          Trois marques, une même exigence. Une maison de sportswear premium construite en noir
          et blanc, pour ceux qui s&apos;entraînent avec autant d&apos;allure que d&apos;intensité.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button href="/shop" variant="outline-light" size="lg" className="border-white text-white">
            Découvrir le Shop
          </Button>
          <Button href="/the-house" variant="ghost" size="lg" className="text-white">
            La Maison →
          </Button>
        </div>
      </Container>
    </section>
  );
}
