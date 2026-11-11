"use client";

import { useEffect, useRef } from "react";
import { ANCHOR_JUMP_EVENT, SECTION_JUMP_EVENT, type SectionJumpDetail } from "@/components/layout/anchorJump";
import { prefersReducedMotion } from "@/lib/motion";
import { jumpToElement } from "@/lib/smoothScroll";

const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
/** The stairs: how many, how long each takes to cover or to lift, and how far apart they start, ms. */
const STAIRS = 6;
const COVER_MS = 200;
const LIFT_MS = 240;
const STEP_MS = 25;
/** A breath with the screen covered, while the page jumps underneath. */
const HOLD_MS = 30;

/**
 * The section jump, after React Bits Pro "Preloader" (its stairs variant), in the page curtains' look
 * (layout/Preloader, layout/PageTransition): when the visitor goes to a section from the header (a nav or
 * menu link to "#section") or from the search, six mahogany stairs, each with a saffron rule along its
 * edge, rise from the foot of the screen one after another, left to right, until they cover it, the
 * emblem showing on them for a moment; the page jumps to the section under them, and they rise on off
 * the top in the same order to show it. About 0.7s in all (cover 325ms, hold 30ms, lift 365ms). Behind
 * the curtain the section's own waiting entrances (ui/TextMotion's, held paused until seen) are finished,
 * so it is in place and readable as the stairs clear it, not entering a second time after the curtain.
 *
 * Only those jumps: in-page links elsewhere on the page still glide (ui/SmoothScroll), and scrolling never
 * calls it. The address takes the section's hash, the header stays hidden for the trip (ANCHOR_JUMP_EVENT)
 * and the keyboard focus lands on the section (it gets tabindex="-1" if it has none). A second jump while
 * one runs is let through as a plain jump. Reduced motion (or no Web Animations API): no curtain, the page
 * jumps at once and the focus moves the same. Decorative: aria-hidden, nothing in it to focus.
 */
export default function SectionJump() {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;
    let running = false;

    const land = (target: HTMLElement, href: string, replace: boolean) => {
      window.dispatchEvent(new Event(ANCHOR_JUMP_EVENT));
      jumpToElement(target);
      const url = `${window.location.pathname}${window.location.search}${href}`;
      if (replace) window.history.replaceState(null, "", url);
      else window.history.pushState(null, "", url);
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    // The curtain was the entrance: the section's held entrances end at once (only paused, finite script
    // animations, which ui/TextMotion keeps until an element is seen; nothing playing or looping).
    const settle = (target: HTMLElement) => {
      target.getAnimations({ subtree: true }).forEach((animation) => {
        // Not the CSS loops held paused off screen (endless: they cannot finish), only script entrances.
        if (animation.playState !== "paused" || typeof CSSAnimation !== "undefined" && animation instanceof CSSAnimation) return;
        if (!Number.isFinite(animation.effect?.getComputedTiming().endTime ?? Infinity)) return;
        try {
          animation.finish();
        } catch {
          // An animation that cannot finish is left as it is.
        }
      });
    };

    const jump = (href: string, replace: boolean) => {
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return false;
      if (running || prefersReducedMotion() || typeof curtain.animate !== "function") {
        land(target, href, replace);
        return true;
      }
      running = true;
      window.dispatchEvent(new Event(ANCHOR_JUMP_EVENT));
      curtain.style.visibility = "visible";
      const stairs = Array.from(curtain.querySelectorAll<HTMLElement>("[data-stair]"));
      const mark = curtain.querySelector<HTMLElement>("[data-stair-mark]");
      const cover = stairs.map((stair, i) =>
        stair.animate([{ transform: "translateY(100%)" }, { transform: "translateY(0)" }], {
          duration: COVER_MS,
          delay: i * STEP_MS,
          easing: EASE_IN_OUT,
          fill: "both",
        }),
      );
      const coverEnd = COVER_MS + (STAIRS - 1) * STEP_MS;
      mark?.animate(
        [
          { opacity: 0, transform: "translateY(10px) scale(0.92)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 220, delay: coverEnd - 140, easing: EASE_OUT, fill: "both" },
      );

      // The animations' promises settle on rendered frames; timers stand behind them, so the page always
      // lands and the curtain always goes, even if the tab is hidden mid-jump.
      let lifted = false;
      let done = false;
      let guard = 0;
      const finish = () => {
        if (done) return;
        done = true;
        window.clearTimeout(guard);
        curtain.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
        curtain.style.visibility = "hidden";
        running = false;
      };
      const lift = () => {
        if (lifted) return;
        lifted = true;
        window.clearTimeout(guard);
        land(target, href, replace);
        settle(target);
        const lifts = stairs.map((stair, i) =>
          stair.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
            duration: LIFT_MS,
            delay: HOLD_MS + i * STEP_MS,
            easing: EASE_IN_OUT,
            fill: "both",
          }),
        );
        mark?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, delay: HOLD_MS, easing: EASE_OUT, fill: "forwards" });
        Promise.all(lifts.map((animation) => animation.finished)).then(finish, finish);
        guard = window.setTimeout(finish, HOLD_MS + LIFT_MS + (STAIRS - 1) * STEP_MS + 400);
      };
      Promise.all(cover.map((animation) => animation.finished)).then(lift, lift);
      guard = window.setTimeout(lift, coverEnd + 400);
      return true;
    };

    // The header's links to a section on this page (the nav and its menus).
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!link || !href || href.length < 2 || href === "#top" || !link.closest("header")) return;
      if (jump(href, false)) event.preventDefault();
    };
    // The search, and anything else that asks (anchorJump's requestSectionJump).
    const onRequest = (event: Event) => {
      const detail = (event as CustomEvent<SectionJumpDetail>).detail;
      if (detail?.href?.startsWith("#") && jump(detail.href, !!detail.replace)) event.preventDefault();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener(SECTION_JUMP_EVENT, onRequest);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(SECTION_JUMP_EVENT, onRequest);
      curtain.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      curtain.style.visibility = "hidden";
    };
  }, []);

  return (
    <div ref={curtainRef} aria-hidden="true" className="invisible fixed inset-0 z-100 flex overflow-clip">
      {Array.from({ length: STAIRS }, (_, i) => (
        <span
          key={i}
          data-stair
          className="relative -mr-px h-full flex-1 bg-mahogany"
          style={{ boxShadow: "inset 0 3px 0 var(--color-saffron), inset 0 -3px 0 var(--color-saffron)" }}
        />
      ))}
      <div data-stair-mark className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-0">
        <img src="/images/talk-to-us/stamp-emblem.webp" alt="" width={72} height={72} className="size-[72px]" />
        <span className="font-heading text-[28px]/[1] text-cream">Vajiram &amp; Ravi</span>
      </div>
    </div>
  );
}
