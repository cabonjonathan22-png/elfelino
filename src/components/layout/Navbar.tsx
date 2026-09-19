"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS } from "@/data/navigation";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="font-display text-lg italic tracking-wide sm:text-xl"
          onClick={() => setMobileOpen(false)}
        >
          MAISON
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60",
                  active ? "text-ink" : "text-ink/55"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={openCart}
            aria-label="Ouvrir le panier"
            className="relative flex items-center text-[11px] font-medium uppercase tracking-[0.18em]"
          >
            <span className="hidden sm:inline">Panier</span>
            <span className="sm:hidden" aria-hidden>
              Bag
            </span>
            <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
              {itemCount}
            </span>
          </button>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-ink transition-transform",
                mobileOpen && "translate-y-[3px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-ink transition-transform",
                mobileOpen && "-translate-y-[3px] -rotate-45"
              )}
            />
          </button>
        </div>
      </Container>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
