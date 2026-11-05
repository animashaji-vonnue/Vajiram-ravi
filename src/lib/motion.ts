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
 * their rise-in instead of flashing in place first. Skipped when motion is reduced.
 */
export const splitReadyScript = `if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches))document.documentElement.classList.add("split-ready");`;
