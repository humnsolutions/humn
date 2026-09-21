const items = [
  "No zoning out",
  "No monotone slide-readers",
  "No death by PowerPoint",
  "No Monday-morning amnesia",
  "No corporate roleplay yoga",
];

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-display text-xl font-semibold whitespace-nowrap md:px-8 md:text-2xl">
            {item}
          </span>
          <span
            className="anim-twinkle inline-block text-paper/80"
            aria-hidden="true"
            style={{ animationDelay: `${i * 0.45}s` }}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <section
      aria-label="The HUMN promise"
      className="marquee overflow-hidden border-y-2 border-ink bg-signal py-3.5 text-paper md:py-4"
    >
      <div className="marquee-track flex w-max">
        <Group />
        <Group hidden />
      </div>
    </section>
  );
}
