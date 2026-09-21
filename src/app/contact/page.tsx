import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Kicker, Mail, Phone, ArrowUpRight } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell HUMN what's broken — hiring, HR or training — and a real human will reply within one business day.",
};

const steps = [
  {
    num: "01",
    title: "A human replies",
    body: "Within one business day. From a person, not a sequence.",
  },
  {
    num: "02",
    title: "A short, honest call",
    body: "Twenty minutes to hear the mess firsthand. No pitch deck, we promise.",
  },
  {
    num: "03",
    title: "We design the fix",
    body: "Built around your cases and your people. You approve it before we run anything.",
  },
  {
    num: "04",
    title: "We run it, then follow up",
    body: "Because training works when Monday morning works. We check in after.",
  },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

  return (
    <>
      <section className="bg-signal text-paper">
        <div className="scroll-rise wrap grid gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="max-w-xl">
            <Kicker>Contact</Kicker>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,1.2rem+5vw,4.6rem)] leading-[0.99] font-medium tracking-tight">
              Let&apos;s{" "}
              <em className="font-display-italic text-lime">
                fix
              </em>{" "}
              your HR &amp; training.
            </h1>
            <p className="mt-7 text-lg leading-relaxed text-paper/80 md:text-xl">
              Tell us what&apos;s broken: a role you can&apos;t fill, an HR pile
              you can&apos;t clear, or a team that&apos;s stopped paying
              attention. The messier the brief, the better we can help.
            </p>

            <div className="mt-10 space-y-5">
              <div className="space-y-3">
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 font-display text-xl font-medium break-all underline decoration-lime decoration-2 underline-offset-4 hover:decoration-paper md:text-2xl"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-lime text-ink shadow-pop-sm"
                  >
                    <Mail className="size-5 text-ink" />
                  </span>
                  {site.email}
                </a>
                <a
                  href={`tel:${site.phoneHref}`}
                  className="inline-flex items-center gap-3 font-display text-xl font-medium underline decoration-lime decoration-2 underline-offset-4 hover:decoration-paper md:text-2xl"
                >
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper text-signal-deep shadow-pop-sm"
                  >
                    <Phone className="size-5" />
                  </span>
                  {site.phone}
                </a>
              </div>
              <p className="pl-14 text-sm font-semibold text-paper/70">
                A human replies within one business day. No drip campaigns, no
                &quot;just checking in&quot;.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-ink bg-paper-deep p-5 shadow-pop sm:p-8 lg:p-10">
            <ContactForm defaultTopic={topic} />
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="border-t-2 border-ink bg-paper-deep/60">
        <div className="wrap py-12 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <Kicker>No black hole</Kicker>
              <h2 className="mt-5 font-display text-[clamp(2rem,1.2rem+3vw,3.4rem)] leading-[1.02] font-medium tracking-tight">
                What happens after you hit send.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-muted">
              We&apos;ve been on the receiving end of &quot;we&apos;ll circle
              back&quot; one too many times. So we keep it simple.
            </p>
          </div>

          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li
                key={step.num}
                className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-paper p-6 shadow-pop-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="font-display-italic text-2xl text-signal-deep"
                >
                  {step.num}
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-6 rounded-2xl border-2 border-dashed border-ink/40 bg-paper p-7 md:p-8">
            <p className="max-w-2xl text-lg leading-relaxed font-medium">
              Not ready to write a novel? A one-liner is fine. Something like:
              &quot;our managers are terrified of feedback, help&quot;.
            </p>
            <a
              href="#main"
              className="btn btn-paper ml-auto"
            >
              Back to the form
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
