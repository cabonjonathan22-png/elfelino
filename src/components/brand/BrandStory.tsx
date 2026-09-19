import type { Brand } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BrandStory({ brand }: { brand: Brand }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <SectionHeading eyebrow={brand.positioning} title="L'esprit de la marque" />

        <div className="space-y-6">
          {brand.story.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-ash sm:text-base">
              {paragraph}
            </p>
          ))}
        </div>
      </Container>

      <Container className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {brand.values.map((value, i) => (
          <div key={value.title} className="bg-white p-8">
            <span className="font-display text-3xl italic text-ash">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-sm font-medium uppercase tracking-[0.14em]">{value.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-ash">{value.description}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}
