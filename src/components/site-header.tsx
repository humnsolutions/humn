"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, ArrowUpRight } from "@/components/ui";
import { site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-paper">
        <p className="wrap flex flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-[13px] font-medium sm:text-sm">
          <span>Now booking recruitment, HR &amp; training for Q4 2026.</span>
          <a
            href={`mailto:${site.email}`}
            className="font-bold underline decoration-lime decoration-2 underline-offset-4 hover:text-lime"
          >
            Grab a slot
          </a>
        </p>
      </div>

      <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
        <div className="wrap flex h-[4.5rem] items-center justify-between gap-4">
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="rounded-full focus-visible:outline-3"
            onClick={close}
          >
            <Logo priority className="h-9" />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="nav-link text-[15px] font-semibold text-ink/80 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a href="/contact" className="btn btn-signal btn-sm hidden md:inline-flex">
              Fix our training
              <ArrowUpRight className="size-4" />
            </a>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border-2 border-ink md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full bg-ink transition-all duration-200 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-ink transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-0.5 w-full bg-ink transition-all duration-200 ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="anim-drop border-t-2 border-ink bg-paper md:hidden"
          >
            <div className="wrap flex flex-col py-4">
              {[
                { label: "What we do", href: "/services" },
                { label: "Why HUMN", href: "/why-humn" },
                { label: "About", href: "/about" },
                { label: "Team", href: "/team" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className="flex items-center justify-between border-b border-ink/10 py-3.5 font-display text-2xl font-medium"
                >
                  {item.label}
                  <ArrowUpRight className="size-5 text-signal-deep" />
                </Link>
              ))}
              <a href="/contact" onClick={close} className="btn btn-signal mt-4">
                Fix our training
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
