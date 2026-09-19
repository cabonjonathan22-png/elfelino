import { cn } from "@/lib/utils";

export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  let label = "En stock";
  let tone = "text-ink/70";

  if (stock <= 0) {
    label = "Épuisé";
    tone = "text-ash";
  } else if (stock <= 3) {
    label = `Plus que ${stock} en stock`;
    tone = "text-ink";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.16em]",
        tone,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          stock <= 0 ? "bg-mist" : stock <= 3 ? "bg-ink" : "bg-ink/60"
        )}
      />
      {label}
    </span>
  );
}
