import Link from "next/link";
import { Logo, Mail, Phone } from "@/components/ui";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-paper">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-10 lg:py-16">
        <div>
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="inline-block text-paper"
          >
            <Logo variant="lockup" inverted className="h-14" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
            Recruitment, HR outsourcing and training that treats grown adults
            like grown adults.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="kicker text-paper/50">Explore</h2>
          <ul className="mt-5 space-y-3 text-[15px] font-semibold">
            {[
              { label: "Home", href: "/" },
              { label: "What we do", href: "/services" },
              { label: "Why HUMN", href: "/why-humn" },
              { label: "About", href: "/about" },
              { label: "Team", href: "/team" },
              { label: "Contact", href: "/contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-paper/80 underline-offset-4 transition-colors hover:text-lime hover:underline hover:decoration-lime/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="kicker text-paper/50">Say hello</h2>
          <p className="mt-5">
            <a
              href={`mailto:${site.email}`}
              className="inline-flex items-center gap-2 font-display text-lg font-medium break-all underline decoration-signal-soft decoration-2 underline-offset-4 hover:text-lime md:text-xl"
            >
              <Mail className="size-5 shrink-0 text-signal-soft" />
              {site.email}
            </a>
          </p>
          <p className="mt-3">
            <a
              href={`tel:${site.phoneHref}`}
              className="inline-flex items-center gap-2 font-display text-lg font-medium underline decoration-signal-soft decoration-2 underline-offset-4 hover:text-lime md:text-xl"
            >
              <Phone className="size-5 shrink-0 text-signal-soft" />
              {site.phone}
            </a>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
            A human replies within one business day. No drip campaigns, no
            sales funnels, no &quot;just checking in&quot;.
          </p>
        </div>
      </div>

      <div className="border-t border-paper/15">
        <div className="wrap flex flex-col gap-2 py-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-display italic">
            No slide decks were harmed in the making of this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
