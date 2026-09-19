import { ProductMedia } from "@/components/ui/ProductMedia";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export function OrderSummary({ shippingCost }: { shippingCost: number }) {
  const { items, subtotal, discount, promo } = useCart();
  const total = Math.max(subtotal - discount, 0) + shippingCost;

  return (
    <div className="border border-line bg-smoke p-6">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ash">
        Récapitulatif ({items.length})
      </h2>

      <div className="mt-5 max-h-72 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.slug}-${item.size}`} className="flex gap-3">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden">
              <ProductMedia
                image={item.image}
                tone={item.tone}
                swatch={item.swatch}
                ratio="portrait"
                className="h-full w-full"
                sizes="56px"
              />
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">{item.name}</p>
              <p className="text-[11px] text-ash">Taille {item.size}</p>
            </div>
            <p className="text-xs">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-mist pt-4 text-sm">
        <div className="flex justify-between text-ash">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promo && discount > 0 && (
          <div className="flex justify-between text-ink">
            <span>Réduction ({promo.code})</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-ash">
          <span>Livraison</span>
          <span>{shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-mist pt-2 text-base font-medium text-ink">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
