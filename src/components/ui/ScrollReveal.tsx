"use client";

import { useEffect } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { whenVisible } from "@/lib/reveal";

/**
 * The spec's order inside a section, as start times in ms: eyebrow and heading at once, sub text 60ms
 * later, then the content. Readability first: no text waits more than 200ms, and staggers are short.
 */
const START = { eyebrow: 0, heading: 0, sub: 60, content: 100 } as const;
const STAGGER_MS = 25;
/** After 4 items the stagger stops growing, so nothing waits more than 200ms. */
const MAX_STAGGER_STEPS = 4;
/** Long enough for the slowest reveal (450ms) after the longest delay. */
const SETTLE_MS = 900;

/**
 * Section reveals (motion spec, "Section reveal"). Mark elements with `data-reveal`:
 *   - `"eyebrow"`: the ornament eyebrow (its rules grow out from the label).
 *   - `"heading"`: fades up --rise over 450ms, whole (its emphasis with it).
 *   - `"sub"`: the sub text, 60ms after the heading.
 *   - no value / `"sm"` / `"fade"`: content blocks, in document order from 100ms with a 25ms stagger
 *     (never more than 200ms; data-reveal-delay is capped there too), rising --rise,
 *     --rise-sm or not at all. Children of a `data-reveal-group` element are content items too.
 *   - `data-reveal-delay="ms"` adds to an element's start.
 * Everything inside one section (or `[data-reveal-section]`) plays once, together, when 20% of that
 * section is in view. Sections already on screen at load are left alone, and so is the last screen of the
 * page. Backgrounds and decorative art are never marked: they are already there.
 *
 * It adds classes to the server-rendered DOM, so client components must keep the className of any
 * revealed element static (toggle runtime classes through refs instead).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const viewportHeight = window.innerHeight / getCanvasZoom();
    const docBottom = document.documentElement.getBoundingClientRect().bottom;
    const nearEnd = (el: Element) => docBottom - el.getBoundingClientRect().top < window.innerHeight;

    // Group the marked elements by their section.
    const groups = new Map<HTMLElement, HTMLElement[]>();
    const add = (el: HTMLElement) => {
      const root = el.closest<HTMLElement>("[data-reveal-section], section, footer") ?? el;
      groups.set(root, [...(groups.get(root) ?? []), el]);
    };
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach(add);
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child) => {
        if (!(child instanceof HTMLElement) || child.hasAttribute("data-reveal")) return;
        child.setAttribute("data-reveal", group.getAttribute("data-reveal-group") || "");
        add(child);
      });
    });

    const cancels: Array<() => void> = [];
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    for (const [root, els] of groups) {
      // Already on screen at load, or at the very foot of the page: shown as they are.
      if (canvasTop(root) < viewportHeight * 0.85 || nearEnd(root)) continue;

      // Start times in the spec's order; content items take the stagger in document order.
      let step = 0;
      const ordered = els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      for (const el of ordered) {
        const role = el.getAttribute("data-reveal");
        const extra = Number(el.getAttribute("data-reveal-delay")) || 0;
        // No text waits more than 200ms in all.
        const start =
          role === "eyebrow" || role === "heading" || role === "sub"
            ? START[role]
            : START.content + Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS;
        el.style.setProperty("--d", `${Math.min(200, start + extra)}ms`);
        el.classList.add("rv-pre");
      }

      cancels.push(
        whenVisible(root, 0.2, () => {
          for (const el of ordered) {
            el.classList.add("rv-in");
            requestAnimationFrame(() => el.classList.remove("rv-pre"));
          }
          timers.push(
            setTimeout(() => {
              for (const el of ordered) {
                el.classList.remove("rv-in");
                el.style.removeProperty("--d");
              }
            }, SETTLE_MS + Math.min(step, MAX_STAGGER_STEPS) * STAGGER_MS),
          );
        }),
      );
    }

    return () => {
      cancels.forEach((cancel) => cancel());
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
