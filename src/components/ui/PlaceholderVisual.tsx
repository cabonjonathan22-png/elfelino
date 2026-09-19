import { cn } from "@/lib/utils";

// No product photography exists yet for this mock catalog, so every visual
// slot in the app renders one of these abstract monochrome studio panels
// instead. They are deterministic (driven by `swatch` + `tone`) so the same
// product always renders the same panel, and they lean into the brand's
// black/white editorial language rather than looking like a broken image.

const DARK_VARIANTS = [
  "radial-gradient(circle at 25% 15%, #2b2b2b 0%, #0a0a0a 55%, #000000 100%)",
  "linear-gradient(155deg, #1f1f1f 0%, #050505 60%, #000000 100%)",
  "radial-gradient(circle at 75% 80%, #262626 0%, #0a0a0a 60%, #000000 100%)",
];

const LIGHT_VARIANTS = [
  "linear-gradient(160deg, #ffffff 0%, #efeee9 45%, #d9d6cd 100%)",
  "radial-gradient(circle at 30% 20%, #ffffff 0%, #eeece6 55%, #cfccc2 100%)",
  "linear-gradient(200deg, #f7f6f2 0%, #e4e1d8 50%, #c9c6bc 100%)",
];

interface PlaceholderVisualProps {
  tone: "light" | "dark";
  swatch: number;
  label?: string;
  monogram?: string;
  className?: string;
  ratio?: "square" | "portrait" | "wide";
}

export function PlaceholderVisual({
  tone,
  swatch,
  label,
  monogram,
  className,
  ratio = "portrait",
}: PlaceholderVisualProps) {
  const variants = tone === "dark" ? DARK_VARIANTS : LIGHT_VARIANTS;
  const background = variants[(swatch - 1 + variants.length) % variants.length];
  const textColor = tone === "dark" ? "text-white/70" : "text-ink/50";
  // Tailwind's cascade order (not className order) decides which
  // position utility wins, so "relative" must be omitted entirely when
  // the caller supplies "absolute" — otherwise it can silently win and
  // pull the panel back into normal flow.
  const callerSetsPosition = className?.includes("absolute");

  return (
    <div
      className={cn(
        "overflow-hidden",
        !callerSetsPosition && "relative",
        ratio === "square" && "aspect-square",
        ratio === "portrait" && "aspect-[4/5]",
        ratio === "wide" && "aspect-[16/9]",
        className
      )}
      style={{ backgroundImage: background }}
    >
      <div className="grain" />
      {monogram && (
        <span
          aria-hidden
          className={cn(
            "absolute -right-4 -top-6 select-none font-display text-[9rem] italic leading-none",
            tone === "dark" ? "text-white/[0.06]" : "text-ink/[0.06]"
          )}
        >
          {monogram}
        </span>
      )}
      {label && (
        <span
          className={cn(
            "absolute bottom-4 left-4 text-[10px] font-medium uppercase tracking-[0.22em]",
            textColor
          )}
        >
          {label}
        </span>
      )}
      <div
        className={cn(
          "absolute inset-0 border",
          tone === "dark" ? "border-white/[0.06]" : "border-black/[0.04]"
        )}
      />
    </div>
  );
}
