import type { Metadata } from "next";
import { FluidSmoke } from "@/components/fluid-smoke";
import { Kicker, LinkButton } from "@/components/ui";
import { Manifesto, WhyHumn, Comparison } from "@/components/why-humn-sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Why HUMN",
  description:
    "Why HUMN sessions don't suck: humans who can hold a room, material rooted in your actual workplace chaos, and a format people stay awake for.",
};

export default function WhyHumnPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="anim-float pointer-events-none absolute -right-8 bottom-0 -z-10 hidden select-none font-display text-[20vw] leading-none font-bold text-ink/[0.035] lg:block"
        >
          why.
        </span>
        <div className="wrap max-w-4xl pt-12 pb-12 md:pt-16 md:pb-14">
          <Kicker>Why HUMN</Kicker>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,1.2rem+5vw,4.8rem)] leading-[1] font-medium tracking-tight">
            Why our sessions actually{" "}
            <em className="font-display-italic text-signal-deep">
              don&apos;t suck
            </em>
            .
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Three reasons people stay awake in the room, a manifesto we&apos;re
            happy to defend, and an honest side-by-side with the workshops
            you&apos;ve already suffered through. No abstract theories — just
            what survives contact with Monday morning.
          </p>
        </div>
      </section>

      <WhyHumn />

      <Manifesto />

      <Comparison />

      {/* CTA */}
      <section className="bg-ink text-paper">
        <FluidSmoke />
        <div className="wrap flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.9rem,1.1rem+2.6vw,3.2rem)] leading-[1.05] font-medium tracking-tight">
              Convinced? Good.
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-paper/75">
              Tell us what&apos;s broken and we&apos;ll tell you honestly how
              we&apos;d fix it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/contact" variant="paper" arrow>
              Start the conversation
            </LinkButton>
            <a
              href={`mailto:${site.email}`}
              className="font-display-italic text-lg underline decoration-signal-soft decoration-2 underline-offset-4 hover:text-lime"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
