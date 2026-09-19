"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Tableau de bord", href: "/admin" },
  { label: "Page d'accueil", href: "/admin/homepage" },
  { label: "Produits", href: "/admin/products" },
  { label: "Commandes", href: "/admin/orders" },
  { label: "Codes Promo", href: "/admin/promo-codes" },
  { label: "Codes d'accès", href: "/admin/access-codes" },
  { label: "Marques", href: "/admin/brands" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-3 py-2 text-[13px] font-medium transition-colors",
              active ? "bg-ink text-white" : "text-ink/70 hover:bg-mist/40"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
