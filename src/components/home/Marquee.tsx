const WORDS = ["EL FELINO", "RSHADOW", "TBE", "TRAIN BEST EVER", "MAISON SPORTSWEAR"];

export function Marquee() {
  const sequence = [...WORDS, ...WORDS];

  return (
    <div className="overflow-hidden border-y border-line bg-white py-5">
      <div className="no-scrollbar flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...sequence, ...sequence].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="font-display text-2xl italic text-ink/80 sm:text-3xl"
          >
            {word}
            <span className="ml-10 text-ink/20">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
