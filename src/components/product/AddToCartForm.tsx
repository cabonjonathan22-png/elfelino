"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { SizeSelector } from "@/components/product/SizeSelector";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { StockBadge } from "@/components/ui/StockBadge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { totalStock } from "@/data/products";

export function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0].size : null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const stockForSize = useMemo(() => {
    if (!selectedSize) return null;
    return product.sizes.find((s) => s.size === selectedSize)?.stock ?? 0;
  }, [selectedSize, product.sizes]);

  const soldOut = totalStock(product) === 0;

  function handleAddToCart() {
    if (!selectedSize) {
      setError("Merci de sélectionner une taille.");
      return;
    }
    if (!stockForSize || stockForSize < quantity) {
      setError("Stock insuffisant pour cette taille.");
      return;
    }
    setError(null);
    addItem(product, selectedSize, quantity);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ash">Taille</p>
          {stockForSize !== null && <StockBadge stock={stockForSize} />}
        </div>
        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onSelect={(size) => {
            setSelectedSize(size);
            setError(null);
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ash">Quantité</p>
        <QuantitySelector quantity={quantity} onChange={(q) => setQuantity(Math.max(1, q))} max={stockForSize ?? 99} />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button
        type="button"
        onClick={handleAddToCart}
        disabled={soldOut}
        size="lg"
        className="w-full"
      >
        {soldOut ? "Épuisé" : confirmed ? "Ajouté au panier ✓" : "Ajouter au panier"}
      </Button>
    </div>
  );
}
