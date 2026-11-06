export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Always-positive modulo, for wrapping carousel indexes. */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

/**
 * Inline <head> script that marks the page `split-ready` before the first paint, so split headings wait hidden for
 * their rise-in instead of flashing in place first. Skipped when motion is reduced. If the page's scripts haven't
 * taken the headings over (ScrollReveal sets `data-split-live`) within SPLIT_FALLBACK_MS, as on a slow connection or
 * if they fail to load, the mark comes off again so the headings show in place rather than staying hidden.
 */
const SPLIT_FALLBACK_MS = 2500;
export const splitReadyScript = `(function(){var r=document.documentElement;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)return;r.classList.add("split-ready");setTimeout(function(){if(!r.hasAttribute("data-split-live"))r.classList.remove("split-ready")},${SPLIT_FALLBACK_MS})})();`;
