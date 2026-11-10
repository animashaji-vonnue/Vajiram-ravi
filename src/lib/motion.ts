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
