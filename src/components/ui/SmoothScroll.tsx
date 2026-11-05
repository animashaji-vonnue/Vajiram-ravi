"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollToElement, setSmoothScroll } from "@/lib/smoothScroll";

/**
 * Smooth, eased page scrolling with Lenis, as on the Skiper UI demos. In-page links glide to their section
 * and land under the sticky header. Scroll areas inside dialogs keep their own native scrolling
 * (data-lenis-prevent), and the FAQ chat takes the wheel only while it overflows (data-scroll-inside). With
 * reduced motion the page scrolls natively.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // The page opens at the hero. The head script (startAtTopScript) stops the browser restoring the last
    // position on later reloads; this covers a restore that got in before it.
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      // A scroll area marked data-scroll-inside (the FAQ chat) takes the wheel only while it has more to
      // show; otherwise the page scrolls as usual over it.
      prevent: (node) => node.hasAttribute("data-scroll-inside") && node.scrollHeight > node.clientHeight + 1,
    });
    setSmoothScroll(lenis);
    let frame = requestAnimationFrame(function step(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(step);
    });

    // In-page links (href="#section") glide to their section.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
      window.history.pushState(null, "", href);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      setSmoothScroll(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
