import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { CustomCursor } from "@/components/custom-cursor";
import { PageTransition } from "@/components/page-transition";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-normal",
  display: "swap",
});

const frauncesItalic = Fraunces({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-display-italic",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "HUMN Solutions — People, but better.",
    template: "%s · HUMN Solutions",
  },
  description:
    "Recruitment, HR outsourcing and corporate training that doesn't make you want to stare at the exit sign. Led by humans, rooted in your actual workplace chaos.",
  keywords: [
    "recruitment",
    "headhunting",
    "HR outsourcing",
    "payroll support",
    "HR training",
    "corporate training",
    "leadership programs",
    "people operations",
    "L&D",
  ],
  openGraph: {
    type: "website",
    siteName: "HUMN Solutions",
    title: "HUMN Solutions — People, but better.",
    description:
      "Training that doesn't make you want to stare at the exit sign.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e5",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${frauncesItalic.variable} ${hanken.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:border-2 focus:border-ink focus:bg-lime focus:px-5 focus:py-2 focus:font-semibold"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CustomCursor />
        <SiteHeader />
        <main id="main" className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
