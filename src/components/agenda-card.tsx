const agenda = [
  { time: "09:30", item: "Coffee, chaos & an honest check-in" },
  { time: "09:50", item: "Feedback without the cringe — the starter" },
  { time: "11:00", item: "Break (snacks, not slide-buffering)" },
  { time: "11:15", item: "The conversation you've been avoiding — rehearsed live" },
  { time: "12:30", item: "Lunch. No networking bingo, we promise" },
  { time: "13:30", item: "Your actual current mess, workshopped" },
  { time: "15:00", item: "The Monday plan — written, owned, real" },
];

export function AgendaCard() {
  return (
    <figure className="relative mx-auto w-full max-w-md -rotate-2 transition-transform duration-500 ease-out hover:rotate-0">
      <div className="absolute -inset-2 -z-10 rounded-3xl bg-lime" aria-hidden="true" />
      <div className="overflow-hidden rounded-2xl border-2 border-ink bg-paper-deep shadow-pop">
        <figcaption className="flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-3">
          <span className="font-display text-sm font-bold tracking-wide uppercase">
            A HUMN session
          </span>
          <span className="font-mono text-xs text-muted">Tuesday, 9:30am</span>
        </figcaption>
        <ol className="px-5 py-4">
          {agenda.map(({ time, item }) => (
            <li
              key={time}
              className="flex items-baseline gap-4 border-b border-dashed border-ink/20 py-2.5 last:border-b-0"
            >
              <time className="font-mono text-xs text-muted">{time}</time>
              <span className="text-sm leading-snug font-medium">{item}</span>
            </li>
          ))}
        </ol>
        <p className="border-t-2 border-ink bg-signal px-5 py-2.5 text-center font-display text-sm font-bold tracking-wide text-paper uppercase">
          Zero slides were harmed
        </p>
      </div>

      {/* Stickers */}
      <span
        aria-hidden="true"
        className="anim-bob absolute -top-5 -right-3 md:-right-8"
        style={{ animationDelay: "0.3s" }}
      >
        <span className="block rotate-6 rounded-full border-2 border-ink bg-paper px-4 py-2 font-display text-sm font-bold shadow-pop-sm">
          Certified non-snooze
        </span>
      </span>
      <span
        aria-hidden="true"
        className="anim-bob absolute -bottom-4 -left-3 md:-left-8"
        style={{ animationDelay: "1.4s" }}
      >
        <span className="block -rotate-6 rounded-full border-2 border-ink bg-lime px-4 py-2 font-display text-sm font-bold shadow-pop-sm">
          You, awake
        </span>
      </span>
    </figure>
  );
}
