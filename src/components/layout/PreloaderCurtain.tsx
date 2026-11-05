"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { lockScroll } from "@/lib/smoothScroll";

type PreloaderCurtainProps = {
  /** When the curtain has lifted, in ms after the first paint (a fallback; its transitions decide). */
  until: number;
  className: string;
  style: CSSProperties;
  children: ReactNode;
};

/**
 * The intro's curtain element and the little the script does for it (see ./Preloader): while <html> has
 * `intro`, the page cannot scroll (Lenis stopped, via lockScroll); when the curtain's own CSS transitions
 * are over, it removes `intro` and `--intro` (the curtain goes back to display: none) and lets the page
 * scroll. If the script arrives after the intro has already played, it tidies up at once. It never
 * traps focus: the curtain is aria-hidden and holds nothing focusable.
 */
export default function PreloaderCurtain({ until, className, style, children }: PreloaderCurtainProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!el || !root.classList.contains("intro")) return;

    let live = true;
    const stop = () => {
      live = false;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      lockScroll(false);
    };
    const finish = () => {
      if (!live) return;
      stop();
      root.classList.remove("intro");
      root.style.removeProperty("--intro");
    };

    // On the next frame, so SmoothScroll has started Lenis whatever the order of the effects.
    const frame = requestAnimationFrame(() => {
      if (live) lockScroll(true);
    });
    // A fallback in case the transitions never report. Generous: the curtain's clock starts at the first
    // paint, which a slow response puts well after the navigation that performance.now() counts from.
    const timer = window.setTimeout(finish, Math.max(0, until - performance.now()) + 3000);
    const running = el.getAnimations?.({ subtree: true }) ?? [];
    if (running.length) Promise.all(running.map((animation) => animation.finished)).then(finish, finish);
    else finish();

    // An unmount (or Strict Mode's rehearsal) lets the page scroll; a remount picks the intro up again.
    return () => {
      if (live) stop();
    };
  }, [until]);

  return (
    <div ref={ref} aria-hidden="true" className={className} style={style}>
      {children}
    </div>
  );
}
