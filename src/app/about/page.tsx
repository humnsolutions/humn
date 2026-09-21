import type { Metadata } from "next";
import Image from "next/image";
import { FluidSmoke } from "@/components/fluid-smoke";
import { Kicker, LinkButton, ArrowUpRight } from "@/components/ui";
import { site, founder } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "HUMN is a crew of recruiters, former HR folks and recovering corporate trainers who got tired of watching good businesses run on chaos.",
};

const beliefs = [
  {
    title: "People are the point",
    body: "Processes, policies and slide decks exist to serve the humans, never the other way around.",
  },
  {
    title: "Boring is expensive",
    body: "A session people sleep through costs the hours in the room plus the weeks of nothing changing after.",
  },
  {
    title: "Real beats theoretical",
    body: "Adults learn by doing, on their own material, in a room that feels safe enough to get it wrong.",
  },
  {
    title: "Laughter is a learning tool",
    body: "You remember what you felt. We'd rather you laugh at a hard truth than nod at a platitude.",
  },
  {
    title: "Monday is the only test that matters",
    body: "If it doesn't survive contact with the real work week, it wasn't training, it was a field trip.",
  },
];

const audience = [
  {
    title: "HR & People teams",
    body: "The ones defending the budget to a CFO who's sat through one too many bad hires and bad sessions.",
  },
  {
    title: "Hiring managers & founders",
    body: "Who need the right person in the seat, not just someone filling it by Friday.",
  },
  {
    title: "Growing teams without HR",
    body: "Scaling fast and drowning in payroll, policies and paperwork that nobody actually owns.",
  },
  {
    title: "L&D leaders & team leads",
    body: "Rebuilding programs that lost the room years ago, and managing a team without guessing.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="anim-float pointer-events-none absolute -bottom-6 -right-6 -z-10 hidden select-none font-display text-[20vw] leading-none font-bold text-ink/[0.035] lg:block"
        >
          human.
        </span>
        <div className="wrap max-w-4xl pt-12 pb-14 md:pt-16 md:pb-20">
          <Kicker>About HUMN</Kicker>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,1.2rem+5vw,4.8rem)] leading-[1] font-medium tracking-tight">
            We make the people side of work{" "}
            <em className="font-display-italic text-signal-deep">better</em>.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            HUMN is a crew of recruiters, former HR folks and recovering
            corporate trainers who got tired of watching good businesses run on
            chaos. We kept the stuff that actually works and burned the rest:
            the ghosted candidates, the unread policies, the slide decks, the
            jargon.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="scroll-rise wrap grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <div>
            <Kicker>The war we&apos;re fighting</Kicker>
            <h2 className="mt-5 font-display text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Professional growth shouldn&apos;t be an endurance test.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-ink/80">
            <p>
              Somewhere along the way, corporate training became something
              people endure rather than something people use. Rooms full of
              adults pinching themselves awake while a monotone voice works
              through slide forty-two. Everyone nods, everyone forgets, and
              nothing changes by Monday.
            </p>
            <p>
              We think that&apos;s a waste of people&apos;s time and a waste of
              your budget. So HUMN does the people side of work the way it
              should have been done all along: recruitment that doesn&apos;t
              ghost, HR that doesn&apos;t drown one overworked person, and
              training rooted in your actual workplace chaos.
            </p>
            <blockquote className="border-l-4 border-signal pl-6 font-display text-2xl font-medium italic md:text-3xl">
              HUMN is short for human. People, but better.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Beliefs */}
      <section>
        <div className="scroll-rise wrap py-12 md:py-16">
          <div className="max-w-2xl">
            <Kicker>What we believe</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.03] font-medium tracking-tight">
              Five opinions we&apos;re happy to defend.
            </h2>
          </div>
          <ol className="mt-10 grid gap-x-10 md:grid-cols-2">
            {beliefs.map((belief, i) => (
              <li
                key={belief.title}
                className="flex gap-6 border-t-2 border-ink py-8 md:gap-8"
              >
                <span
                  aria-hidden="true"
                  className="font-display-italic text-2xl text-signal-deep"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold">
                    {belief.title}
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-muted">
                    {belief.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-ink text-paper">
        <FluidSmoke />
        <div className="scroll-rise wrap py-12 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2.5 font-sans text-sm font-bold tracking-[0.16em] text-signal-soft uppercase">
                Who we work with
              </p>
              <h2 className="mt-5 font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.03] font-medium tracking-tight">
                Teams who&apos;ve had enough of the old way.
              </h2>
            </div>
          </div>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border-2 border-paper/20 bg-paper/20 md:grid-cols-2">
            {audience.map((item) => (
              <li key={item.title} className="bg-ink p-8">
                <ArrowUpRight className="size-5 text-signal-soft" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-semibold text-paper">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-md leading-relaxed text-paper/70">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Founder */}
      <section
        id="founder"
        className="scroll-mt-24 border-t-2 border-ink bg-ink text-paper"
      >
        <FluidSmoke />
        <div className="scroll-rise wrap grid gap-10 py-12 md:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="inline-flex items-center gap-2.5 font-sans text-sm font-bold tracking-[0.16em] text-signal-soft uppercase">
              {founder.kicker}
            </p>
            <p className="mt-6 font-display text-[clamp(1.7rem,1rem+2.2vw,2.6rem)] leading-tight font-medium tracking-tight">
              &ldquo;Do I regret it?
              <br />
              Also no.&rdquo;
            </p>

            <Image
              src="/founder.jpeg"
              alt="Abdullah Qamar, founder of HUMN"
              width={400}
              height={400}
              className="mt-8 h-auto w-full max-w-[18rem] rounded-2xl border-2 border-paper/20"
            />
          </div>

          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-paper/80">
            <p className="font-display text-xl leading-relaxed font-medium text-paper md:text-2xl">
              {founder.lead}
            </p>
            {founder.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3">
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-paper underline decoration-signal-soft decoration-2 underline-offset-4 hover:text-lime"
              >
                {site.email}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="font-semibold text-paper underline decoration-signal-soft decoration-2 underline-offset-4 hover:text-lime"
              >
                {site.phone}
              </a>
            </div>

            <p className="pt-2 font-display text-xl font-medium italic">
              {founder.signoff}
              <span className="ml-2 font-sans text-base font-normal not-italic text-paper/60">
                — {founder.signoffNote}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="wrap flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.9rem,1.1rem+2.6vw,3.2rem)] leading-[1.05] font-medium tracking-tight">
              Sound like your kind of people?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-muted">
              Tell us what&apos;s broken and we&apos;ll tell you honestly how
              we&apos;d fix it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/contact" arrow>
              Start the conversation
            </LinkButton>
            <a
              href={`mailto:${site.email}`}
              className="font-display-italic text-lg underline decoration-signal decoration-2 underline-offset-4"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
