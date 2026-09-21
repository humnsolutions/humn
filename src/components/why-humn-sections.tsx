import { Kicker, Check, Cross } from "@/components/ui";
import { FluidSmoke } from "@/components/fluid-smoke";

const reasons = [
  {
    num: "01",
    tag: "The humans",
    title: "Zero monotone slide-readers, ever.",
    body: "Your facilitator is chosen because they can read a room, hold attention, and take a joke. If they can't keep you awake and thinking, they don't get to run a session.",
  },
  {
    num: "02",
    tag: "The material",
    title: "Rooted in your actual workplace chaos.",
    body: "No abstract theories that look great in a textbook and are useless by Monday. We build from the mess you're actually living in: your cases, your conflicts, your culture.",
  },
  {
    num: "03",
    tag: "The format",
    title: "Interactive, and slightly unhinged (in a good way).",
    body: "Shockingly, people retain information better when they aren't dying of boredom. Expect to talk, practice, mess up, and laugh at yourself. That's the point.",
  },
];

const comparison = [
  {
    label: "The delivery",
    bad: "A slide deck read aloud for three hours",
    good: "Zero decks. Live, messy, real.",
  },
  {
    label: "The theory",
    bad: "Textbook models nobody asked for",
    good: "Your actual workplace chaos",
  },
  {
    label: "The energy",
    bad: "Praying for the fire alarm",
    good: "Awake, talking, occasionally laughing",
  },
  {
    label: "The takeaway",
    bad: "A certificate you'll lose",
    good: "Skills you use on Monday morning",
  },
  {
    label: "You",
    bad: "Pinching yourself to stay awake",
    good: "Present, because it's worth it",
  },
];

const beliefs = [
  {
    num: "01",
    title: "You're an adult.",
    body: "We run sessions like it. No participation trophies, no trust falls, no dumbing things down.",
  },
  {
    num: "02",
    title: "Monday is the test.",
    body: "If a skill can't survive the real work week, it doesn't make the agenda. Full stop.",
  },
  {
    num: "03",
    title: "Energy is a tool.",
    body: "People retain more when they aren't fighting to stay awake. That's science, not spin.",
  },
];

export function Manifesto() {
  return (
    <section className="bg-ink text-paper">
      <FluidSmoke />
      <div className="scroll-rise wrap py-14 md:py-20">
        <p className="inline-flex items-center gap-2.5 font-sans text-sm font-bold tracking-[0.16em] text-signal-soft uppercase">
          <span aria-hidden="true" className="anim-spin inline-block text-lg">
            ✳
          </span>
          The manifesto
        </p>

        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,1.1rem+3vw,3.6rem)] leading-[1.05] font-medium tracking-tight">
          We&apos;ve officially declared war on soul-crushing corporate HR
          workshops. You know the ones: the endurance tests where everyone
          silently rehearses their exit.
        </h2>

        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper/75">
          We think professional growth should feel like it was designed for
          actual humans. So we built HUMN on a simple swap: take the content
          that matters, drop the corporate theatre, and run it like real people
          are in the room.
        </p>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border-2 border-paper/20 bg-paper/20 md:grid-cols-3">
          {beliefs.map((belief) => (
            <li
              key={belief.num}
              className="flex flex-col gap-3 bg-ink p-7 transition-colors hover:bg-ink-deep"
            >
              <span
                aria-hidden="true"
                className="font-display-italic text-lg text-signal-soft"
              >
                {belief.num}
              </span>
              <h3 className="font-display text-xl font-semibold">
                {belief.title}
              </h3>
              <p className="text-sm leading-relaxed text-paper/70">
                {belief.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center font-display text-3xl font-medium md:text-4xl">
          HUMN{" "}
          <span aria-hidden="true" className="text-signal-soft">
            →
          </span>{" "}
          <em className="font-display-italic">People, but better.</em>
        </p>
      </div>
    </section>
  );
}

export function WhyHumn({ anchor = false }: { anchor?: boolean }) {
  return (
    <section id={anchor ? "why-humn" : undefined} className="scroll-mt-24">
      <div className="scroll-rise wrap py-14 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Kicker>Why it doesn&apos;t suck</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,1.2rem+3vw,3.6rem)] leading-[1.02] font-medium tracking-tight">
              Three reasons people stay awake and{" "}
              <em className="font-display-italic">actually</em> learn.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            We&apos;re not going to pretend training is easy. We just refuse to
            make it boring.
          </p>
        </div>

        <ol className="mt-10">
          {reasons.map((reason) => (
            <li
              key={reason.num}
              className="group grid gap-5 border-t-2 border-ink py-8 transition-colors last:border-b-2 md:grid-cols-[0.9fr_2fr] md:gap-12"
            >
              <div className="flex items-start justify-between gap-6 md:block">
                <span className="font-display-italic text-[clamp(3rem,6vw,5rem)] leading-none text-signal-deep">
                  {reason.num}
                </span>
                <span className="chip md:mt-6" aria-hidden="true">
                  {reason.tag}
                </span>
              </div>
              <div className="max-w-2xl">
                <h3 className="font-display text-[clamp(1.5rem,0.8rem+2vw,2.4rem)] leading-tight font-semibold tracking-tight">
                  {reason.title}
                </h3>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
                  {reason.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Comparison() {
  return (
    <section className="border-y-2 border-ink bg-paper-deep">
      <div className="scroll-rise wrap py-14 md:py-20">
        <div className="max-w-2xl">
          <Kicker>Side by side</Kicker>
          <h2 className="mt-5 font-display text-[clamp(2.1rem,1.2rem+3vw,3.6rem)] leading-[1.02] font-medium tracking-tight">
            Suffered through vs. actually useful.
          </h2>
        </div>

        <div className="mt-10 rounded-2xl border-2 border-ink bg-paper p-5 shadow-pop sm:p-8">
          <div className="grid grid-cols-2 gap-x-6 pb-6 md:grid-cols-[0.9fr_1.1fr_1.1fr] md:gap-x-8">
            <p className="hidden text-sm font-bold text-muted md:block" />
            <p className="inline-flex w-fit items-center gap-2 rounded-full border-2 border-ink/40 px-3.5 py-1 text-xs font-bold text-muted sm:text-sm">
              Your average workshop
              <Cross className="size-3.5 text-signal-deep" />
            </p>
            <p className="inline-flex w-fit items-center gap-2 justify-self-end rounded-full border-2 border-ink bg-ink px-3.5 py-1 text-xs font-bold text-paper sm:text-sm">
              A HUMN session
              <Check className="size-3.5 text-lime" />
            </p>
          </div>
          <ul>
            {comparison.map((row) => (
              <li
                key={row.label}
                className="grid grid-cols-2 gap-x-6 border-t border-ink/15 py-5 md:grid-cols-[0.9fr_1.1fr_1.1fr] md:gap-x-8"
              >
                <span className="hidden font-display text-lg italic text-muted md:block">
                  {row.label}
                </span>
                <p className="flex items-start gap-3 text-[15px] leading-snug text-muted md:items-center">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 border-ink/30 text-signal-deep md:mt-0"
                  >
                    <Cross className="size-3" />
                  </span>
                  {row.bad}
                </p>
                <p className="flex items-start gap-3 text-[15px] leading-snug font-semibold md:items-center">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ok text-paper md:mt-0"
                  >
                    <Check className="size-3" />
                  </span>
                  {row.good}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
