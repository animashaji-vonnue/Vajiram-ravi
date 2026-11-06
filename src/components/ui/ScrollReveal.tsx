"use client";

import { useEffect } from "react";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";

const STAGGER_MS = 70;
const MAX_STAGGER_STEPS = 8;
const SETTLE_MS = 1700;

/**
 * Fades in `[data-reveal]` blocks and the children of `[data-reveal-group]` elements as they
 * scroll into view. Anything already on screen at load stays visible; only below-the-fold
 * blocks are pre-hidden (the `rv-pre` and `rv-in` classes live in globals.css). It also starts
 * the letters of `[data-split]` headings (SplitHeading) rising, those on screen at load included.
 *
 * It adds those classes to the server-rendered DOM, so client components must keep the
 * className of any revealed element static (toggle runtime classes through refs instead).
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return;

    const viewportHeight = window.innerHeight / getCanvasZoom();
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.setProperty("--d", `${Math.min(index, MAX_STAGGER_STEPS) * STAGGER_MS}ms`);
        items.push(child);
      });
    });

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add("rv-in");
          requestAnimationFrame(() => el.classList.remove("rv-pre"));
          timers.push(
            setTimeout(() => {
              el.classList.remove("rv-in");
              el.style.removeProperty("--d");
            }, SETTLE_MS),
          );
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const el of items) {
      if (canvasTop(el) > viewportHeight * 0.92) {
        el.classList.add("rv-pre");
        observer.observe(el);
      }
    }

    // Split headings rise in once their top is 82% of the way down the window, those on screen at load included.
    const headings = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          headings.unobserve(entry.target);
          entry.target.classList.add("split-in");
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    // Only take the headings over if the head script is still holding them hidden; once it has given up and shown
    // them in place, leave them be.
    const root = document.documentElement;
    if (root.classList.contains("split-ready")) {
      root.setAttribute("data-split-live", "");
      document.querySelectorAll("[data-split]").forEach((el) => headings.observe(el));
    }

    return () => {
      headings.disconnect();
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
