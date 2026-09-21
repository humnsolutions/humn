import type { Metadata } from "next";
import { AgendaCard } from "@/components/agenda-card";
import { FluidSmoke } from "@/components/fluid-smoke";
import { Marquee } from "@/components/marquee";
import { Kicker, LinkButton, Scribble, ArrowUpRight } from "@/components/ui";
import { Manifesto, WhyHumn, Comparison } from "@/components/why-humn-sections";
import { services, site, founder } from "@/lib/site";

export const metadata: Metadata = {
  description:
    "HUMN builds stronger teams through recruitment and headhunting, HR outsourcing, and corporate training that treats adults like adults: real problems, real conversation, zero slide-reading.",
};

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-signal text-paper">
      {/* giant ghost word */}
      <span
        aria-hidden="true"
        className="anim-float pointer-events-none absolute -right-8 bottom-0 -z-10 hidden select-none font-display text-[22vw] leading-none font-bold text-paper/[0.07] lg:block"
      >
        people.
      </span>

      {/* exit sign, for anyone already considering it */}
      <span
        aria-hidden="true"
        className="anim-flicker exit-sign pointer-events-none absolute top-6 right-6 hidden -rotate-6 items-center gap-2 rounded-md border-2 border-ink bg-lime px-3 py-1.5 font-mono text-xs font-bold tracking-[0.2em] text-ink uppercase lg:inline-flex xl:right-10"
      >
        Exit
        <span className="text-base leading-none">→</span>
      </span>

      <div className="wrap grid items-center gap-10 pt-10 pb-14 md:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-20">
        <div className="max-w-2xl">
          <p className="reveal inline-flex items-center gap-2.5 rounded-full border-2 border-ink bg-lime px-4 py-1.5 text-sm font-bold text-ink">
            <span
              aria-hidden="true"
              className="anim-pulse inline-block size-2 rounded-full bg-signal"
            />
            Recruitment, HR &amp; training — for people with places to be
          </p>

          <h1 className="reveal mt-7 font-display text-[clamp(2.7rem,6.4vw,5.2rem)] leading-[0.98] font-medium tracking-tight [animation-delay:80ms]">
            Training that doesn&apos;t make you want to{" "}
            <em className="hover-wiggle font-display-italic relative inline-block font-medium text-lime">
              stare at the exit sign
              <Scribble className="scribble-draw absolute -bottom-2 left-0 w-full text-lime" />
            </em>
            .
          </h1>

          <p className="reveal mt-7 max-w-[46ch] text-lg leading-relaxed text-paper/80 [animation-delay:160ms] md:text-xl">
            HUMN helps organizations build stronger teams: recruitment, HR
            outsourcing, and training that treats grown adults like grown
            adults. Real problems, real conversation, zero slide-reading — and
            it all starts by sitting down with you.
          </p>

          <div className="reveal mt-9 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
            <LinkButton href="/contact" variant="paper" arrow>
              Tell us what&apos;s broken
            </LinkButton>
            <LinkButton href="/services" variant="lime">
              See what we do
            </LinkButton>
          </div>

          <p className="reveal mt-9 max-w-md text-sm leading-relaxed text-paper/75 [animation-delay:320ms]">
            Built for founders, HR teams, people ops and hiring managers
            who&apos;ve sat through one too many &quot;synergy&quot; sessions
            and are done pretending.
          </p>
        </div>

        <div className="reveal [animation-delay:200ms]">
          <AgendaCard />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ServicesPreview() {
  return (
    <section>
      <div className="scroll-rise wrap py-14 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Kicker>What we do</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,1.2rem+3vw,3.6rem)] leading-[1.02] font-medium tracking-tight">
              Three ways we fix the people side of your business.
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted">
            From one great hire to running your whole HR function to training
            the team you&apos;ve got. It all starts the same way: we sit down
            with you first.
          </p>
        </div>

        <ul className="mt-10 border-t-2 border-ink">
          {services.map((service) => (
            <li key={service.slug} className="border-b-2 border-ink">
              <a
                href={`/services#${service.slug}`}
                className="group relative grid items-center gap-3 py-7 sm:grid-cols-[auto_1fr_auto] sm:gap-8 md:py-8"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 rounded-xl bg-paper-deep transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <span
                  aria-hidden="true"
                  className="relative hidden font-display-italic text-2xl text-signal-deep transition-transform duration-300 ease-out group-hover:-translate-x-1 sm:block"
                >
                  {service.index}
                </span>
                <span className="relative min-w-0">
                  <span className="block font-display text-2xl font-semibold tracking-tight md:text-3xl">
                    {service.name}
                  </span>
                  <span className="mt-1 block text-muted italic md:hidden">
                    {service.oneLiner}
                  </span>
                  <span className="mt-1 hidden max-w-md text-muted italic md:block">
                    {service.oneLiner}
                  </span>
                </span>
                <span className="relative justify-self-end">
                  <span className="grid size-11 place-items-center rounded-full border-2 border-ink bg-paper transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-signal group-hover:text-paper group-hover:shadow-pop-sm sm:size-12">
                    <ArrowUpRight className="size-5" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <LinkButton href="/services" variant="paper" arrow>
            See all three services
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FounderNote() {
  return (
    <section
      id="founder"
      className="scroll-mt-24 border-y-2 border-ink bg-paper-deep"
    >
      <div className="scroll-rise wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Kicker>A message from the founder</Kicker>
          <p className="mt-6 font-display text-[clamp(1.7rem,1rem+2.2vw,2.6rem)] leading-tight font-medium tracking-tight">
            &ldquo;We actually sit with you before doing anything, which
            apparently counts as
            <em className="font-display-italic text-signal-deep"> revolutionary</em>{" "}
            in this industry.&rdquo;
          </p>
          <div className="mt-8">
            <LinkButton href="/about#founder" variant="paper" arrow>
              Read the full note
            </LinkButton>
          </div>
        </div>

        <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink/80">
          <p>{founder.lead}</p>
          <p>{founder.paragraphs[1]}</p>
          <p className="pt-2 font-display text-xl font-medium italic">
            {founder.signoff}
            <span className="ml-2 font-sans text-base font-normal not-italic text-muted">
              — {founder.signoffNote}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FinalCta() {
  return (
    <section className="bg-ink text-paper">
      <FluidSmoke />
      <div className="scroll-rise wrap py-14 text-center md:py-20">
        <p className="inline-flex items-center gap-2.5 font-sans text-sm font-bold tracking-[0.16em] text-signal-soft uppercase">
          Next step
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl font-display text-[clamp(2.4rem,1.2rem+4.4vw,4.8rem)] leading-[0.98] font-medium tracking-tight">
          Let&apos;s fix your HR &amp; training.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-paper/75">
          Drop us a note before your team falls asleep standing up. A real
          human replies within one business day, and no, we don&apos;t have a
          drip campaign.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <LinkButton href="/contact" variant="paper" arrow>
            Send us a note
          </LinkButton>
          <a
            href={`mailto:${site.email}`}
            className="font-display-italic text-xl text-paper underline decoration-signal-soft decoration-2 underline-offset-8 hover:text-lime md:text-2xl"
          >
            {site.email}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Manifesto />
      <WhyHumn anchor />
      <Comparison />
      <ServicesPreview />
      <FounderNote />
      <FinalCta />
    </>
  );
}
