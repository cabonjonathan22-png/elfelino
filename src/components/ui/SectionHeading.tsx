import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-[11px] font-medium uppercase tracking-[0.28em]",
            tone === "dark" ? "text-ash" : "text-white/60"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl italic leading-[1.05] sm:text-4xl lg:text-5xl",
          tone === "dark" ? "text-ink" : "text-white"
        )}
      >
        {title}
      </h2>
    </div>
  );
}
