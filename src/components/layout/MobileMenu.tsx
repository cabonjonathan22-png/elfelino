"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "grid overflow-hidden bg-white transition-[grid-template-rows] duration-300 lg:hidden",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
    >
      <nav className="min-h-0 border-t border-line px-5 py-2">
        {NAV_LINKS.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "block border-b border-line py-4 text-sm font-medium uppercase tracking-[0.16em]",
                active ? "text-ink" : "text-ink/60"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
