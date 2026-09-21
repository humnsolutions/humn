import type { Metadata } from "next";
import { FluidSmoke } from "@/components/fluid-smoke";
import { Kicker, LinkButton, ArrowUpRight, Check } from "@/components/ui";
import { services, servicesIntro, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "What we do",
  description:
    "Three ways HUMN builds stronger teams: recruitment and headhunting, HR outsourcing, and corporate training and development designed around your people.",
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <span
          aria-hidden="true"
          className="anim-float pointer-events-none absolute -right-8 bottom-0 -z-10 hidden select-none font-display text-[20vw] leading-none font-bold text-ink/[0.035] lg:block"
        >
          people.
        </span>
        <div className="wrap pt-12 pb-12 md:pt-16 md:pb-14">
          <div className="max-w-3xl">
            <Kicker>What we do</Kicker>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,1.2rem+5vw,4.8rem)] leading-[1] font-medium tracking-tight">
              Recruitment, HR and training with a{" "}
              <em className="font-display-italic text-signal-deep">pulse</em>.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
              {servicesIntro}
            </p>
          </div>

          <nav
            aria-label="Jump to a service"
            className="mt-10 flex flex-wrap gap-2.5"
          >
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="chip hover:bg-paper-deep"
              >
                <span aria-hidden="true" className="text-signal-deep">
                  {service.index}
                </span>
                {service.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Service list */}
      <section>
        <div className="scroll-rise wrap">
          <ol className="border-t-2 border-ink">
            {services.map((service) => (
              <li
                key={service.slug}
                id={service.slug}
                className="scroll-mt-28 border-b-2 border-ink py-10 md:py-12"
              >
                <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                  <div>
                    <div className="flex items-baseline gap-5">
                      <span
                        aria-hidden="true"
                        className="font-display-italic text-3xl text-signal-deep md:text-4xl"
                      >
                        {service.index}
                      </span>
                      <div>
                        <h2 className="font-display text-[clamp(1.9rem,1rem+2.4vw,3rem)] leading-tight font-semibold tracking-tight">
                          {service.name}
                        </h2>
                        <p className="mt-1 font-display-italic text-lg text-muted">
                          {service.oneLiner}
                        </p>
                      </div>
                    </div>
                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
                      {service.blurb}
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-ink/40 px-4 py-2 text-sm font-semibold text-muted">
                      <span aria-hidden="true" className="text-signal-deep">
                        Format
                      </span>
                      {service.format}
                    </p>
                  </div>
                  <div className="rounded-2xl border-2 border-ink bg-paper-deep p-6 md:p-8">
                    <h3 className="text-sm font-bold tracking-[0.14em] text-muted uppercase">
                      {service.coverageLabel}
                    </h3>
                    <ul className="mt-5 space-y-4">
                      {service.coverage.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ok text-paper"
                          >
                            <Check className="size-3.5" />
                          </span>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`/contact?topic=${encodeURIComponent(service.slug)}`}
                      className="btn btn-ink mt-7 w-full"
                    >
                      Ask about {service.name.toLowerCase()}
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink text-paper">
        <FluidSmoke />
        <div className="wrap flex flex-col items-start justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.9rem,1.1rem+2.6vw,3.2rem)] leading-[1.05] font-medium tracking-tight">
              Not sure which one fits?
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-paper/75">
              Tell us what&apos;s happening and we&apos;ll point you at the
              right fix, even if that fix isn&apos;t us.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <LinkButton href="/contact" variant="paper" arrow>
              Talk it through
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
