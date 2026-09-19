"use client";

export function QuantitySelector({
  quantity,
  onChange,
  max = 99,
}: {
  quantity: number;
  onChange: (next: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-mist">
      <button
        type="button"
        aria-label="Diminuer la quantité"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        className="flex h-9 w-9 items-center justify-center text-sm hover:bg-smoke"
      >
        −
      </button>
      <span className="flex h-9 w-9 items-center justify-center text-sm">{quantity}</span>
      <button
        type="button"
        aria-label="Augmenter la quantité"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        className="flex h-9 w-9 items-center justify-center text-sm hover:bg-smoke"
      >
        +
      </button>
    </div>
  );
}
