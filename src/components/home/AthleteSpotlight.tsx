import { PlaceholderVisual } from "@/components/ui/PlaceholderVisual";
import { Container } from "@/components/ui/Container";

const STATS = [
  { value: "47", label: "Combats professionnels" },
  { value: "38", label: "Victoires" },
  { value: "3×", label: "Champion d'Europe EBU" },
  { value: "1991–2008", label: "Carrière professionnelle" },
];

// Real record, cross-checked against BoxRec / Boxerlist / BoxeNet.fr —
// not the mock data used elsewhere on this site.
export function AthleteSpotlight() {
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <PlaceholderVisual
          tone="dark"
          swatch={5}
          monogram="EB"
          ratio="portrait"
          className="order-2 lg:order-1"
        />

        <div className="order-1 lg:order-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/60">
            Ambassadeur Maison
          </p>
          <h2 className="mt-4 font-display text-4xl italic leading-[1.05] sm:text-5xl">
            Erland Betaré
          </h2>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Boxeur professionnel — poids moyens — 3 fois Champion d&apos;Europe EBU
          </p>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/70">
            Champion de France puis triple Champion d&apos;Europe des poids moyens, Erland Betaré a
            porté les couleurs françaises jusqu&apos;au statut de challenger officiel du champion du
            monde unifié Bernard Hopkins en 2000. Aujourd&apos;hui entraîneur et fondateur de son
            propre club à Aix-en-Provence, il incarne l&apos;exigence et la discipline qui animent
            la Maison.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl italic sm:text-4xl">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
