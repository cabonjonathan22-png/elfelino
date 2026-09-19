import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez la Maison — El Felino, RShadow, TBE.",
};

export default function ContactPage() {
  return (
    <div className="py-14 sm:py-20">
      <Container>
        <SectionHeading eyebrow="Contact" title="Parlons-en" />

        <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_360px]">
          <ContactForm />

          <div className="space-y-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
                Showroom
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                12 rue de la Maison
                <br />
                75008 Paris, France
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
                Horaires
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                Lundi — Samedi
                <br />
                11h00 – 19h30
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
                Service Client
              </p>
              <p className="mt-3 text-sm leading-relaxed">
                contact@maison-sportswear.com
                <br />
                +33 1 23 45 67 89
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
                Réseaux
              </p>
              <div className="mt-3 flex gap-4">
                {["Instagram", "TikTok", "Pinterest"].map((s) => (
                  <a key={s} href="#" className="text-sm underline">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
