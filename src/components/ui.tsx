import Link from "next/link";
import Image from "next/image";

type IconProps = { className?: string };

export function ArrowRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function Check({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-4"}
    >
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function Cross({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden="true"
      className={className ?? "size-4"}
    >
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

export function Mail({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <rect x="3" y="5.5" width="18" height="13" rx="3" />
      <path d="m3.5 7.5 8.5 6 8.5-6" />
    </svg>
  );
}

export function Phone({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-5"}
    >
      <path d="M7 3.5H5.6A2.1 2.1 0 0 0 3.5 5.8c.5 7.7 6.3 13.5 14 14a2.1 2.1 0 0 0 2.3-2.1v-1.4a1.6 1.6 0 0 0-1.2-1.6l-2.8-.7a1.6 1.6 0 0 0-1.6.5l-.9 1a12.6 12.6 0 0 1-5.4-5.4l1-.9a1.6 1.6 0 0 0 .5-1.6l-.7-2.8a1.6 1.6 0 0 0-1.6-1.2Z" />
    </svg>
  );
}

/* Scribble underline, drawn under hero emphasis words */
export function Scribble({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M4 9c22-7 42 4 64-1s44-6 64-1 44 4 84-2"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/* Official brand lockups. The supplied artwork is a flat #3F2451 mark on
   white, so both variants are transparent PNGs; `inverted` knocks it out to
   solid white for the dark footer. */
const LOGO_SRC = {
  mark: { src: "/logo-mark.png", width: 1062, height: 291 },
  lockup: { src: "/logo-lockup.png", width: 1062, height: 417 },
} as const;

export function Logo({
  variant = "mark",
  inverted = false,
  className,
  priority = false,
}: {
  variant?: keyof typeof LOGO_SRC;
  inverted?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const { src, width, height } = LOGO_SRC[variant];

  return (
    <Image
      src={src}
      alt="HUMN Solutions"
      width={width}
      height={height}
      priority={priority}
      className={`w-auto ${inverted ? "brightness-0 invert" : ""} ${
        className ?? "h-8"
      }`}
    />
  );
}

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "signal" | "paper" | "ink";
  size?: "md" | "sm";
  arrow?: boolean;
  className?: string;
};

const variantClass: Record<NonNullable<LinkButtonProps["variant"]>, string> = {
  signal: "btn-signal",
  paper: "btn-paper",
  ink: "btn-ink",
};

export function LinkButton({
  href,
  children,
  variant = "signal",
  size = "md",
  arrow = false,
  className = "",
}: LinkButtonProps) {
  const cls = `btn ${size === "sm" ? "btn-sm" : ""} ${variantClass[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow ? <ArrowRight className="size-[1.15em]" /> : null}
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="kicker">{children}</p>;
}
