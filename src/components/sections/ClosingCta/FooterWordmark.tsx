"use client";

import { useEffect, useRef } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion, whenFontsReady } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** Motion spec: letter by letter, opacity + --rise-sm, 30ms apart. Each letter takes --dur-slow. */
const LETTER_STAGGER_MS = 30;
const LETTER_MS = 600;
/**
 * Stroke fill (after Uilora's "Stroke Fill"): each letter arrives as a 1.5px orange outline and, 250ms
 * after it sets off (it has all but landed by then), fills in solid over --dur-slow while the outline
 * melts into the fill. With the 30ms stagger the fill sweeps across the name from left to right.
 */
const STROKE = "1.5px";
const FILL_DELAY_MS = 250;
const FILL_MS = 600;

/**
 * Lays one absolutely placed letter over each character of the real text, where the browser set it in the
 * whole word, so the kerning and the tight tracking survive (separate inline-block letters would lose both).
 */
function splitLetters(word: HTMLElement, source: HTMLElement): { overlay: HTMLElement; letters: HTMLElement[] } {
  const overlay = document.createElement("span");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText = "position:absolute;inset:0;pointer-events:none";
  const letters: HTMLElement[] = [];
  const text = source.firstChild;
  if (!(text instanceof Text)) return { overlay, letters };

  const box = word.getBoundingClientRect();
  // Rects are scaled by the canvas zoom; offsets and the styles set here are not.
  const scale = word.offsetWidth ? box.width / word.offsetWidth : 1;
  const range = document.createRange();
  for (let i = 0; i < text.data.length; i++) {
    const char = text.data[i];
    if (!char.trim()) continue;
    range.setStart(text, i);
    range.setEnd(text, i + 1);
    const left = (range.getBoundingClientRect().left - box.left) / scale;
    const letter = document.createElement("span");
    letter.textContent = char;
    letter.style.cssText = `position:absolute;top:0;left:${left}px;display:block;white-space:pre`;
    overlay.append(letter);
    letters.push(letter);
  }
  word.append(overlay);
  return { overlay, letters };
}

/**
 * The giant "Vajiram & Ravi" in the footer: Mukta 210px in orange, tracked to -10.5px. Motion spec:
 * when it comes into view its letters arrive one by one (opacity and an 8px rise, 30ms apart), once, as
 * orange outlines that then fill solid, the fill sweeping left to right just behind them. The real text
 * stays in place, hidden, under the letters while they play, and is shown again afterwards (solid, no
 * outline). It is read as one name (the letters are hidden from assistive technology). With reduced
 * motion, without JavaScript, or if it is already on screen when the fonts are ready, it is simply there.
 */
export default function FooterWordmark({ text }: { text: string }) {
  const wordRef = useRef<HTMLParagraphElement>(null);
  const sourceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const word = wordRef.current;
    const source = sourceRef.current;
    if (!word || !source || prefersReducedMotion()) return;

    let cancelled = false;
    let overlay: HTMLElement | undefined;
    let cancelWatch = () => {};
    const animations: Animation[] = [];
    const restore = () => {
      overlay?.remove();
      overlay = undefined;
      source.style.visibility = "";
    };

    // Measure with the final font, or the letters would sit where the fallback font put them.
    whenFontsReady().then(() => {
      if (cancelled || canvasTop(word) < window.innerHeight / getCanvasZoom()) return;
      const split = splitLetters(word, source);
      overlay = split.overlay;
      source.style.visibility = "hidden";
      const rise = getComputedStyle(document.documentElement).getPropertyValue("--rise-sm").trim() || "8px";
      // The wordmark's own orange, for the outline.
      const orange = getComputedStyle(word).color;
      for (const letter of split.letters) {
        letter.style.opacity = "0";
        letter.style.transform = `translateY(${rise})`;
        letter.style.color = "transparent";
        letter.style.setProperty("-webkit-text-stroke", `${STROKE} ${orange}`);
      }
      cancelWatch = whenVisible(word, 0.5, () => {
        split.letters.forEach((letter, i) => {
          animations.push(
            letter.animate([{ opacity: 0, transform: `translateY(${rise})` }, { opacity: 1, transform: "none" }], {
              duration: LETTER_MS,
              delay: i * LETTER_STAGGER_MS,
              easing: EASE_OUT,
              fill: "forwards",
            }),
            letter.animate(
              [
                { color: "transparent", webkitTextStrokeColor: orange },
                { color: orange, webkitTextStrokeColor: "transparent" },
              ],
              { duration: FILL_MS, delay: i * LETTER_STAGGER_MS + FILL_DELAY_MS, easing: EASE_OUT, fill: "forwards" },
            ),
          );
        });
        Promise.all(animations.map((animation) => animation.finished)).then(restore, () => {});
      });
    });

    return () => {
      cancelled = true;
      cancelWatch();
      animations.forEach((animation) => animation.cancel());
      restore();
    };
  }, []);

  return (
    <p ref={wordRef} className="relative font-heading text-[210px]/[0.96] tracking-[-10.5px] whitespace-nowrap text-orange">
      <span className="sr-only">{text}</span>
      <span ref={sourceRef} aria-hidden="true">
        {text}
      </span>
    </p>
  );
}
