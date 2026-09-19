"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice, cn } from "@/lib/utils";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { PromoCodeForm } from "@/components/ui/PromoCodeForm";
import { FREE_SHIPPING_THRESHOLD } from "@/data/commerce";

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal, discount, total } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden
        className={cn(
          "fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em]">
            Votre Panier ({items.length})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="text-lg leading-none"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-ash">Votre panier est vide.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="text-xs font-medium uppercase tracking-[0.16em] underline"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              {remainingForFreeShipping > 0 ? (
                <p className="border-b border-line py-3 text-xs text-ash">
                  Plus que{" "}
                  <span className="font-medium text-ink">
                    {formatPrice(remainingForFreeShipping)}
                  </span>{" "}
                  pour la livraison offerte.
                </p>
              ) : (
                <p className="border-b border-line py-3 text-xs text-ink">
                  Livraison offerte débloquée.
                </p>
              )}
              <div className="divide-y divide-line">
                {items.map((item) => (
                  <CartItemRow key={`${item.slug}-${item.size}`} item={item} onNavigate={closeCart} />
                ))}
              </div>
            </div>

            <div className="border-t border-line px-6 py-5">
              <PromoCodeForm />

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ash">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-ink">
                    <span>Réduction</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-line pt-2 text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center bg-ink px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white hover:bg-graphite"
              >
                Passer la commande
              </Link>
              <p className="mt-3 text-center text-[11px] text-ash">
                Frais de livraison calculés à l&apos;étape suivante.
              </p>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
