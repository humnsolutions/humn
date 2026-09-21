"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a, button, [role='button'], input, select, textarea, label, summary, .btn, .chip";

/* Cursor tail: recent pointer samples turned into a tapered ribbon.
   Tail end stays brand violet, tip lands on the lime spark so the tail
   reads on both the paper and the dark ink bands.

   History is measured in milliseconds, not frames, so a straight stroke
   keeps the same length on a 60Hz panel and a 144Hz one. Reduced motion
   keeps a shorter, glow-free tail rather than dropping it entirely — the
   ring and dot already move under that preference, so removing the tail
   altogether just looked broken. */
const TAIL_MS = 520;
const TAIL_MS_REDUCED = 240;
const TAIL_MAX_SAMPLES = 160;
const TAIL_VIOLET = "63, 36, 81";
const TAIL_LIME = "214, 242, 74";

type Vec = { x: number; y: number };
type Sample = Vec & { t: number };

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const canvas = tailRef.current;
    if (!ring || !dot || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let dotX = targetX;
    let dotY = targetY;
    let headX = targetX;
    let headY = targetY;

    let hovering = false;
    let pressing = false;
    let scale = 1;
    let shown = false;
    let frame = 0;

    const tail: Sample[] = [];
    let tailOpacity = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const setVisible = (next: boolean) => {
      if (shown === next) return;
      shown = next;
      ring.style.opacity = next ? "1" : "0";
      dot.style.opacity = next ? "1" : "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setVisible(true);
      const target = event.target as Element | null;
      hovering = Boolean(target?.closest?.(INTERACTIVE));
      ring.classList.toggle("is-hot", hovering);
    };

    const onPointerDown = () => {
      pressing = true;
    };

    const onPointerUp = () => {
      pressing = false;
    };

    const onPointerLeave = () => {
      pressing = false;
      hovering = false;
      ring.classList.remove("is-hot");
      setVisible(false);
    };

    const drawTail = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const count = tail.length;
      if (!shown || tailOpacity < 0.02 || count < 3) return;

      const head = tail[count - 1];
      const tailEnd = tail[0];
      if (Math.hypot(head.x - tailEnd.x, head.y - tailEnd.y) < 6) return;

      const strength = (reduceMotion ? 0.72 : 1) * tailOpacity;
      const left: Vec[] = [];
      const right: Vec[] = [];

      for (let i = 0; i < count; i++) {
        const prev = tail[Math.max(0, i - 1)];
        const next = tail[Math.min(count - 1, i + 1)];
        let dx = next.x - prev.x;
        let dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;

        const t = i / (count - 1);
        const halfWidth = (0.4 + 4.2 * t) * strength;
        const nx = -dy * halfWidth;
        const ny = dx * halfWidth;

        left.push({ x: tail[i].x + nx, y: tail[i].y + ny });
        right.push({ x: tail[i].x - nx, y: tail[i].y - ny });
      }

      const gradient = ctx.createLinearGradient(
        tailEnd.x,
        tailEnd.y,
        head.x,
        head.y,
      );
      gradient.addColorStop(0, `rgba(${TAIL_VIOLET}, 0)`);
      gradient.addColorStop(0.18, `rgba(${TAIL_VIOLET}, ${0.24 * strength})`);
      gradient.addColorStop(0.6, `rgba(${TAIL_VIOLET}, ${0.58 * strength})`);
      gradient.addColorStop(1, `rgba(${TAIL_LIME}, ${0.95 * strength})`);

      ctx.beginPath();
      ctx.moveTo(left[0].x, left[0].y);
      for (let i = 1; i < count; i++) ctx.lineTo(left[i].x, left[i].y);
      for (let i = count - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
      ctx.closePath();

      ctx.shadowColor = reduceMotion
        ? "transparent"
        : `rgba(${TAIL_VIOLET}, ${0.4 * strength})`;
      ctx.shadowBlur = reduceMotion ? 0 : 14 * strength;
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      dotX += (targetX - dotX) * 0.6;
      dotY += (targetY - dotY) * 0.6;

      const targetScale = pressing ? 0.7 : hovering ? 1.8 : 1;
      scale += (targetScale - scale) * 0.18;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale})`;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

      const moving = Math.hypot(targetX - headX, targetY - headY) > 0.5;
      headX += (targetX - headX) * (moving ? 0.42 : 0.12);
      headY += (targetY - headY) * (moving ? 0.42 : 0.12);

      const now = performance.now();
      const life = reduceMotion ? TAIL_MS_REDUCED : TAIL_MS;

      if (shown) {
        const last = tail[tail.length - 1];
        if (last && now - last.t > 120) tail.length = 0;
        tail.push({ x: headX, y: headY, t: now });
        while (tail.length > 2 && now - tail[0].t > life) tail.shift();
        if (tail.length > TAIL_MAX_SAMPLES) tail.shift();
        tailOpacity += (1 - tailOpacity) * 0.25;
      } else {
        tail.length = 0;
        tailOpacity = 0;
      }
      if (!moving) tailOpacity += (0 - tailOpacity) * 0.12;

      drawTail();

      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("blur", onPointerLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200]"
    >
      <canvas ref={tailRef} className="cursor-tail" />
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
