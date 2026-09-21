"use client";

import { useEffect, useRef } from "react";
import { createFluidSim } from "@/lib/fluid-sim";

/* How long the smoke keeps simulating after the pointer stops. Once the
   dye has faded past the point of being visible we park the loop so an
   idle section costs nothing. */
const IDLE_MS = 6000;

/**
 * Cursor paint for dark bands: moving the pointer anywhere over this
 * element's box throws colour into a fluid field that swirls and fades.
 * Purely decorative — it listens on the window, never swallows clicks,
 * and steps aside when WebGL is missing.
 *
 * Note it is not gated on prefers-reduced-motion, unlike the site's
 * looping CSS motion: nothing here moves on its own, so with a still
 * pointer the band is indistinguishable from a flat background. Gating
 * it means anyone with animation effects switched off in their OS sees
 * no effect at all, which is not what the effect asks of them.
 */
export function FluidSmoke() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const small = window.matchMedia("(pointer: coarse)").matches;

    const sim = createFluidSim(canvas, {
      simResolution: small ? 96 : 128,
      dyeResolution: small ? 384 : 512,
    });
    if (!sim) return;

    const measure = () => {
      const rect = host.getBoundingClientRect();
      sim.resize(rect.width, rect.height);
    };
    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(host);

    let lastX: number | null = null;
    let lastY: number | null = null;
    let idleSince = performance.now();
    let idle = false;

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        lastX = null;
        lastY = null;
        return;
      }

      if (lastX === null || lastY === null) {
        lastX = x;
        lastY = y;
        return;
      }

      const dx = x - lastX;
      const dy = y - lastY;
      lastX = x;
      lastY = y;

      if (dx === 0 && dy === 0) return;

      sim.splat(x, y, dx, dy, sim.color());
      idleSince = performance.now();
      idle = false;
    };

    const onPointerLeave = () => {
      lastX = null;
      lastY = null;
    };

    /* A lost context leaves the element painting opaque white, which
       would blot out the whole band, so take it out of the picture. */
    const onContextLost = () => {
      canvas.style.display = "none";
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    let onScreen = false;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
      },
      { rootMargin: "150px" },
    );
    intersectionObserver.observe(host);

    let frame = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      frame = window.requestAnimationFrame(tick);
      const elapsed = now - previous;
      previous = now;

      if (!onScreen || document.hidden) return;

      if (now - idleSince > IDLE_MS) {
        if (!idle) {
          idle = true;
          sim.clear();
        }
        return;
      }

      sim.frame(elapsed / 1000);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      sim.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden="true" className="fluid-smoke">
      <canvas ref={canvasRef} className="fluid-smoke-canvas" />
    </div>
  );
}
