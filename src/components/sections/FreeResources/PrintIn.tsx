"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * The front page's entrance, once, when its band is 20% in view (with the masthead's own section reveal):
 * the sheet is laid on the table, then the page prints in front to back. Every part is marked in the
 * markup with what it is (`data-press`) and when it starts (`data-press-at`, ms after the sheet):
 *   sheet    the paper settles from 32px lower and a slight turn, fading in (800ms)
 *   rule     a rule draws out across the page from its transform origin (600ms)
 *   rule-v   a column rule draws down (700ms)
 *   letter   one letter of the lead headline inks in, from a soft blur (340ms; the letters 40ms apart)
 *   photo    the lead photo develops: from blurred and a touch large to sharp (900ms)
 *   ink      a block of type inks in: from clear, 3px blurred and 6px low (600ms)
 * All on --ease-out, transforms, opacity and a short blur only. The parts wait in their first frame
 * (paused Web Animations, so nothing is restyled) until the band is seen. Already on screen at load, or
 * with reduced motion: the page is simply there.
 */

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const PRESS: Record<string, { frames: Keyframe[]; duration: number }> = {
  sheet: { frames: [{ opacity: 0, transform: "translateY(32px) rotate(-0.6deg)" }, { opacity: 1, transform: "none" }], duration: 800 },
  rule: { frames: [{ transform: "scaleX(0)" }, { transform: "none" }], duration: 600 },
  "rule-v": { frames: [{ transform: "scaleY(0)" }, { transform: "none" }], duration: 700 },
  letter: { frames: [{ opacity: 0, filter: "blur(4px)" }, { opacity: 1, filter: "blur(0px)" }], duration: 340 },
  photo: { frames: [{ opacity: 0, filter: "blur(8px)", transform: "scale(1.03)" }, { opacity: 1, filter: "blur(0px)", transform: "none" }], duration: 900 },
  ink: { frames: [{ opacity: 0, filter: "blur(3px)", transform: "translateY(6px)" }, { opacity: 1, filter: "blur(0px)", transform: "none" }], duration: 600 },
};

type PrintInProps = { className?: string; children: ReactNode };

/** The newspaper sheet: a plain div around the server-drawn page, running its entrance. */
export default function PrintIn({ className, children }: PrintInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sheet = ref.current;
    if (!sheet || prefersReducedMotion()) return;
    if (canvasTop(sheet) < (window.innerHeight / getCanvasZoom()) * 0.9) return;
    const parts: Array<[HTMLElement, string]> = [
      [sheet, "sheet"],
      ...Array.from(sheet.querySelectorAll<HTMLElement>("[data-press]"), (el): [HTMLElement, string] => [el, el.dataset.press ?? "ink"]),
    ];
    const prints = parts.map(([el, kind]) => {
      const { frames, duration } = PRESS[kind] ?? PRESS.ink;
      const print = el.animate(frames, { duration, delay: Number(el.dataset.pressAt) || 0, easing: EASE_OUT, fill: "backwards" });
      print.pause();
      return print;
    });
    const cancel = whenVisible(sheet.closest("section") ?? sheet, 0.2, () => prints.forEach((print) => print.play()));
    return () => {
      cancel();
      prints.forEach((print) => print.cancel());
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
