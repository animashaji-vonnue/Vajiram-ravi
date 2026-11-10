"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import "./footer-wordmark.css";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** The entrance: the outlined name rises and fades in (--dur-slow), then the photos sweep into it. */
const RISE_MS = 600;
const FILL_DELAY_MS = 250;
const FILL_MS = 1400;
/** Each photo's turn in the cross-fade (footer-wordmark.css): the cycle is one turn per photo. */
const TURN_S = 7;

type FooterWordmarkProps = {
  text: string;
  /** The photographs seen through the letters, in turn; the first is the ground under the rest. */
  photos: string[];
};

/**
 * The giant "Vajiram & Ravi" in the footer: Mukta Bold 232px, tracked to -0.045em, its letters filled with
 * photographs of the institute (feedback item 43) under a translucent orange wash, so the name stays
 * legible on the cream, with a 2px orange outline holding its edge. The photos pan slowly across the
 * letters and cross-fade one into the next, 7s each (footer-wordmark.css), only while the name is on
 * screen.
 *
 * The entrance, once, when it comes into view: the name rises 8px and fades in as orange outlines, then
 * the photos sweep into the letters from left to right. It is read as one name (the layers are hidden from
 * assistive technology). With reduced motion the name is simply there, filled with the first photo and
 * still; without JavaScript, or if it is already on screen when the fonts are ready, it is simply there.
 */
export default function FooterWordmark({ text, photos }: FooterWordmarkProps) {
  const wordRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // The photo loops run only while the name is on screen.
  useEffect(() => {
    const word = wordRef.current;
    if (!word || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => word.toggleAttribute("data-playing", entry.isIntersecting));
    observer.observe(word);
    return () => observer.disconnect();
  }, []);

  // The entrance.
  useEffect(() => {
    const word = wordRef.current;
    const fill = fillRef.current;
    if (!word || !fill || prefersReducedMotion() || typeof word.animate !== "function") return;

    let cancelled = false;
    let cancelWatch = () => {};
    const animations: Animation[] = [];

    whenFontsReady().then(() => {
      if (cancelled || canvasTop(word) < window.innerHeight / getCanvasZoom()) return;
      const rise = getComputedStyle(document.documentElement).getPropertyValue("--rise-sm").trim() || "8px";
      animations.push(
        word.animate([{ opacity: 0, transform: `translateY(${rise})` }, { opacity: 1, transform: "none" }], {
          duration: RISE_MS,
          easing: EASE_OUT,
          fill: "backwards",
        }),
        fill.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
          duration: FILL_MS,
          delay: FILL_DELAY_MS,
          easing: EASE_OUT,
          fill: "backwards",
        }),
      );
      animations.forEach((animation) => animation.pause());
      cancelWatch = whenVisible(word, 0.5, () => animations.forEach((animation) => animation.play()));
    });

    return () => {
      cancelled = true;
      cancelWatch();
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  const cycle = { "--fw-cycle": `${photos.length * TURN_S}s` } as CSSProperties;

  return (
    // A div, not a p: the page's `p { text-wrap: pretty }` would let the name break onto two lines.
    <div
      ref={wordRef}
      className="relative -my-[0.12em] font-heading text-[232px]/[0.96] font-bold tracking-[-0.045em] whitespace-nowrap select-none"
      style={cycle}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="fw-layer fw-outline block">
        {text}
      </span>
      <span ref={fillRef} aria-hidden="true" className="absolute inset-0">
        {photos.map((photo, i) => (
          <span
            key={photo}
            className="fw-layer fw-photo"
            style={{ backgroundImage: `url(${photo})`, "--fw-delay": `${i * TURN_S}s` } as CSSProperties}
          >
            {text}
          </span>
        ))}
        <span className="fw-layer fw-tint">{text}</span>
      </span>
    </div>
  );
}
