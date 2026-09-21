"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Team portrait with a graceful fallback: until the photo exists at its
 * path, we paint branded initials instead of a broken image. Dropping the
 * real file into /public/team swaps it in with no code change.
 */
export function TeamPortrait({
  src,
  name,
  initials,
  className = "aspect-[3/4] border-b-2 border-ink",
}: {
  src: string;
  name: string;
  initials: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative w-full overflow-hidden bg-paper-deep ${className}`}
    >
      {failed ? (
        <div className="grid h-full w-full place-items-center">
          <span
            aria-hidden="true"
            className="grid size-24 place-items-center rounded-full border-2 border-ink bg-signal font-display text-4xl font-bold text-paper shadow-pop md:size-28"
          >
            {initials}
          </span>
        </div>
      ) : (
        <Image
          src={src}
          alt={`Portrait of ${name}`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </div>
  );
}
