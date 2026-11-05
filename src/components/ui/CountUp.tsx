"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

type CountUpProps = {
  /** The figure as shown, e.g. "50+", "36/50", "1,000/1,750". Only its first number rolls. */
  value: string;
  /** Roll time in milliseconds (the spec's 1.2s), from the first column setting off to the last landing. */
  duration?: number;
  /** Share of the figure's band that must be on screen before it rolls (the spec's 50%). */
  threshold?: number;
  className?: string;
};

/** The motion tokens, for the Web Animations API: --ease-out, --stagger and --dur-fast. */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const STAGGER_MS = 60;
const PLUS_MS = 200;
/**
 * Each column's window: the line box, with its top and bottom 0.2em faded so the passing digits roll in
 * and out softly. The digits themselves stand well inside it (Hanken Grotesk's line box runs from 1em above
 * the baseline to 0.3em below; its figures from the baseline to about 0.7em above), so a resting digit is
 * never touched.
 */
const WINDOW = "linear-gradient(to bottom, transparent, #000 0.2em, #000 calc(100% - 0.2em), transparent)";

/**
 * The odometer drawn over the figure while it rolls: the text before the number, one column per digit
 * (commas stay put between them), a "+" that waits for the landing, and the rest ("/50") as plain text.
 * Each column is as wide as its final digit (a hidden copy of it sizes the column), so every glyph stands
 * exactly where the real text puts it. Its strip runs 0–9 once and then on up to the digit, so every
 * column, even a 0, rolls a full turn before it lands.
 */
function buildOdometer(value: string, start: number, number: string) {
  const odometer = document.createElement("span");
  odometer.style.cssText = "position:absolute;top:0;left:0;white-space:nowrap";
  if (start) odometer.append(value.slice(0, start));

  const strips: { strip: HTMLElement; cells: number; land: number }[] = [];
  for (const char of number) {
    if (char < "0" || char > "9") {
      odometer.append(char);
      continue;
    }
    const digit = Number(char);
    // The 0.1em of padding, given back by the negative margins, lets the window reach past the digit's
    // advance: with the tight tracking some figures (a bold 4 or 8) ink beyond it. The width stays the same.
    const column = document.createElement("span");
    column.style.cssText = `display:inline-block;position:relative;padding:0 0.1em;margin:0 -0.1em;-webkit-mask-image:${WINDOW};mask-image:${WINDOW}`;
    const sizer = document.createElement("span");
    sizer.style.visibility = "hidden";
    sizer.textContent = char;
    const strip = document.createElement("span");
    strip.style.cssText = "position:absolute;top:0;left:0;right:0;display:block;text-align:center";
    for (let n = 0; n <= 10 + digit; n++) {
      const cell = document.createElement("span");
      cell.style.display = "block";
      cell.textContent = String(n % 10);
      strip.append(cell);
    }
    column.append(sizer, strip);
    odometer.append(column);
    strips.push({ strip, cells: 11 + digit, land: 10 + digit });
  }

  const after = value.slice(start + number.length);
  let plus: HTMLElement | null = null;
  if (after.startsWith("+")) {
    plus = document.createElement("span");
    plus.textContent = "+";
    plus.style.opacity = "0";
    odometer.append(plus);
  }
  const rest = plus ? after.slice(1) : after;
  if (rest) odometer.append(rest);
  return { odometer, strips, plus };
}

/**
 * A figure whose digits roll into place like an odometer, once, when its band is half in view (motion
 * spec, "Stats band"; after the "Animate Digits" / NumberFlow counters). Every digit of the number is a
 * column, a strip of digits moved up with a transform, so the figure rolls rather than flickers; the
 * columns set off and land one after another from the left, 60ms apart, within the 1.2s, on --ease-out.
 * The format keeps its shape: "36/50" rolls only the 36, "1,000/1,750" only the 1,000 (its comma stays),
 * and a trailing "+" (as in "50+") appears when the figure lands. Figures that share a band start
 * together. When it lands it marks itself `data-counted`, which fades in any `data-count-label` in the
 * same `data-count-scope` (see globals.css). With reduced motion it shows the final number at once.
 *
 * The server renders the final value, so it reads correctly without JavaScript, and that text holds the
 * figure's size the whole time: the odometer is drawn over it (out of flow) while it is hidden, and the
 * text comes back once the roll is over, so nothing shifts. Screen readers get the final figure once.
 */
export default function CountUp({ value, duration = 1200, threshold = 0.5, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const text = textRef.current;
    const roll = rollRef.current;
    if (!el || !text || !roll) return;
    const counted = () => el.setAttribute("data-counted", "");
    const match = value.match(/\d[\d,]*/);
    if (!match || prefersReducedMotion() || typeof roll.animate !== "function") return counted();

    const { odometer, strips, plus } = buildOdometer(value, match.index ?? 0, match[0]);
    // Rest at 0 until the band comes into view.
    text.style.visibility = "hidden";
    roll.append(odometer);
    const restore = () => {
      odometer.remove();
      text.style.visibility = "";
    };

    const animations: Animation[] = [];
    // Counters in the same band start together: they watch the band, not themselves.
    const band = el.closest("[data-count-scope]")?.closest("section") ?? el.closest("section") ?? el;
    const cancel = whenVisible(band, threshold, () => {
      const stagger = Math.min(STAGGER_MS, duration / 4 / Math.max(1, strips.length - 1));
      const each = duration - stagger * (strips.length - 1);
      strips.forEach(({ strip, cells, land }, i) => {
        animations.push(
          strip.animate([{ transform: "translateY(0)" }, { transform: `translateY(${(-land / cells) * 100}%)` }], {
            duration: each,
            delay: i * stagger,
            easing: EASE_OUT,
            fill: "forwards",
          }),
        );
      });
      Promise.all(animations.map((animation) => animation.finished)).then(() => {
        counted();
        if (!plus) return restore();
        const show = plus.animate([{ opacity: 0 }, { opacity: 1 }], { duration: PLUS_MS, easing: EASE_OUT, fill: "forwards" });
        animations.push(show);
        show.finished.then(restore, () => {});
      }, () => {});
    });

    return () => {
      cancel();
      animations.forEach((animation) => animation.cancel());
      restore();
    };
  }, [value, duration, threshold]);

  return (
    <span ref={ref} className={`inline-grid ${className ?? ""}`}>
      <span className="sr-only">{value}</span>
      <span ref={textRef} className="col-start-1 row-start-1" aria-hidden="true">
        {value}
      </span>
      {/* The odometer's place: the same grid cell, empty, so it adds nothing to the figure's size. */}
      <span ref={rollRef} className="relative col-start-1 row-start-1" aria-hidden="true" />
    </span>
  );
}
