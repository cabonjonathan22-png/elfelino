import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getBrands } from "@/lib/db";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

export function Footer() {
  const brands = getBrands();

  return (
    <footer className="border-t border-line bg-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-xl italic">MAISON</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ash">
              El Felino, RShadow &amp; TBE — trois univers, une même maison de sportswear.
            </p>
            <div className="mt-6 flex gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60 hover:text-ink"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
              Les Marques
            </p>
            <ul className="mt-5 space-y-3">
              {brands.map((b) => (
                <li key={b.slug}>
                  <Link href={`/${b.slug}`} className="text-sm hover:opacity-60">
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
              La Maison
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <Link href="/shop" className="text-sm hover:opacity-60">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/the-house" className="text-sm hover:opacity-60">
                  The House
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:opacity-60">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:opacity-60">
                  Livraison &amp; Retours
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ash">
              Newsletter
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ash">
              Les prochains drops, avant tout le monde.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-[11px] uppercase tracking-[0.14em] text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Maison — El Felino / RShadow / TBE. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-ink">
              Mentions légales
            </Link>
            <Link href="/contact" className="hover:text-ink">
              CGV
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Confidentialité
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
