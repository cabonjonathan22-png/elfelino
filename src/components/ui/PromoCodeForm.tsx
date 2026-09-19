"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

export function PromoCodeForm() {
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    const result = await applyPromo(code);
    setMessage({ text: result.message, ok: result.success });
    if (result.success) setCode("");
  }

  if (promo) {
    return (
      <div className="flex items-center justify-between border border-ink/10 bg-smoke px-4 py-3 text-sm">
        <span>
          Code <span className="font-medium">{promo.code}</span> appliqué — {promo.description}
        </span>
        <button
          type="button"
          onClick={() => {
            removePromo();
            setMessage(null);
          }}
          className="text-[11px] font-medium uppercase tracking-[0.14em] text-ash hover:text-ink"
        >
          Retirer
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex border-b border-ink pb-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Code promo"
          className="w-full bg-transparent text-sm uppercase placeholder:text-ash placeholder:normal-case focus:outline-none"
        />
        <button type="submit" className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em]">
          Appliquer
        </button>
      </div>
      {message && (
        <p className={`text-xs ${message.ok ? "text-ink" : "text-red-600"}`}>{message.text}</p>
      )}
    </form>
  );
}
