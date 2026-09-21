import type { Metadata } from "next";
import { FluidSmoke } from "@/components/fluid-smoke";
import { TeamPortrait } from "@/components/team-portrait";
import { Kicker, LinkButton } from "@/components/ui";
import { site, team } from "@/lib/site";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The five humans behind HUMN — recruiters, HR folks and recovering corporate trainers who build hiring, HR and training that actually works.",
};

const leadership = team.slice(0, 2);
const specialists = team.slice(2);

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="anim-float pointer-events-none absolute -bottom-6 -right-6 -z-10 hidden select-none font-display text-[20vw] leading-none font-bold text-ink/[0.035] lg:block"
        >
          team.
        </span>
        <div className="wrap max-w-4xl pt-12 pb-14 md:pt-16 md:pb-20">
          <Kicker>The humans</Kicker>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,1.2rem+5vw,4.8rem)] leading-[1] font-medium tracking-tight">
            Meet the people who{" "}
            <em className="font-display-italic text-signal-deep">actually</em>{" "}
            show up.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Five humans, zero monotone slide-readers. Every one of us has sat
            through the training sessions we&apos;re now trying to kill, which
            makes us unusually motivated to build better ones.
          </p>
        </div>
      </section>

      {/* The team */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="scroll-rise wrap py-12 md:py-16">
          <div className="max-w-2xl">
            <Kicker>Who you&apos;ll be working with</Kicker>
            <h2 className="mt-5 font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.03] font-medium tracking-tight">
              Small crew. Loud opinions. Real work.
            </h2>
          </div>

          {/* Leadership reads as a wide pair, the specialists as a row of
              three — five cards split 2 + 3 so neither row is left hanging. */}
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {leadership.map((member) => (
              <li
                key={member.name}
                className="group grid grid-cols-[8.5rem_1fr] overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-pop transition-transform duration-200 hover:-translate-y-1 sm:grid-cols-[10.5rem_1fr]"
              >
                <TeamPortrait
                  src={member.image}
                  name={member.name}
                  initials={member.initials}
                  className="h-full min-h-[11rem] border-r-2 border-ink"
                />
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <h3 className="font-display text-xl leading-snug font-semibold tracking-tight">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold tracking-[0.14em] text-signal-deep uppercase">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {member.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {specialists.map((member) => (
              <li
                key={member.name}
                className="group flex flex-col overflow-hidden rounded-2xl border-2 border-ink bg-paper shadow-pop transition-transform duration-200 hover:-translate-y-1"
              >
                <TeamPortrait
                  src={member.image}
                  name={member.name}
                  initials={member.initials}
                />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-xl leading-snug font-semibold tracking-tight">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold tracking-[0.14em] text-signal-deep uppercase">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    {member.bio}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <FluidSmoke />
        <div className="wrap flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.9rem,1.1rem+2.6vw,3.2rem)] leading-[1.05] font-medium tracking-tight">
              Want this lot on your team?
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-paper/75">
              Tell us what&apos;s broken and we&apos;ll tell you honestly how
              we&apos;d fix it. No pitch deck, no drip campaign.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/contact" variant="paper" arrow>
              Start the conversation
            </LinkButton>
            <a
              href={`mailto:${site.email}`}
              className="font-display-italic text-lg text-paper underline decoration-signal-soft decoration-2 underline-offset-8 hover:text-lime"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
