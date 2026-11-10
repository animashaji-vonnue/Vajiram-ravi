"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
/** The curtain's rise, ms: long enough to read as a transition, short enough not to feel like a wait. */
const RISE_MS = 460;
/** If the next page has not taken over this long after the click, the curtain gives the page back. */
const GIVE_UP_MS = 8000;

/**
 * The page transition: when a link leaves this page in the same tab (to a programme, the selections page,
 * the current affairs …), a mahogany curtain rises from the foot of the screen with a curved leading edge
 * that flattens as it covers, the Vajiram & Ravi emblem on it, and the browser goes on once it has covered
 * (460ms). It is the closing twin of the "Namaste" intro curtain (layout/Preloader), which lifts off the top
 * as a page opens.
 *
 * It stays out of the way of everything that is not a plain page change: in-page links (#…) glide as
 * before, links that open a new tab or are opened with a modifier key or the middle button, downloads,
 * tel: / mailto: links and clicks something else has already handled all go through untouched. Coming back
 * with the browser's back button (a page restored from the back-forward cache) takes the curtain away at
 * once. Reduced motion: no curtain. Decorative: aria-hidden, nothing to focus.
 */
export default function PageTransition() {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    let timer = 0;

    const reset = () => {
      window.clearTimeout(timer);
      curtain.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      curtain.style.visibility = "hidden";
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      // The same page with only a different #section: the smooth scroll handles it.
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (prefersReducedMotion() || typeof curtain.animate !== "function") return;

      event.preventDefault();
      curtain.style.visibility = "visible";
      const edge = curtain.querySelector<SVGElement>("[data-curtain-edge]");
      const mark = curtain.querySelector<HTMLElement>("[data-curtain-mark]");
      const rise = curtain.animate([{ transform: "translateY(100%)" }, { transform: "none" }], { duration: RISE_MS, easing: EASE_IN_OUT, fill: "forwards" });
      edge?.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], { duration: RISE_MS, easing: EASE_IN_OUT, fill: "forwards" });
      mark?.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], {
        duration: 260,
        delay: RISE_MS * 0.55,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      });
      const go = () => {
        window.location.assign(url.href);
        timer = window.setTimeout(reset, GIVE_UP_MS);
      };
      rise.finished.then(go, go);
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) reset();
    };

    document.addEventListener("click", onClick);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onPageShow);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={curtainRef} aria-hidden="true" className="invisible fixed inset-0 z-100 flex translate-y-full items-center justify-center bg-mahogany">
      {/* The curved leading edge: a bulge above the curtain that flattens (scaleY 1 → 0) as it covers. */}
      <svg
        data-curtain-edge
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-full left-0 -mb-px h-[12vh] w-full origin-bottom fill-mahogany"
      >
        <path d="M0 100Q720 -100 1440 100Z" />
      </svg>
      <div data-curtain-mark className="flex flex-col items-center gap-4 opacity-0">
        <img src="/images/talk-to-us/stamp-emblem.webp" alt="" width={72} height={72} className="size-[72px]" />
        <span className="font-serif text-[28px]/[1] text-cream">Vajiram &amp; Ravi</span>
      </div>
    </div>
  );
}
