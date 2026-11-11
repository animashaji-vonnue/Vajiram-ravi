/*
 * The page's one IntersectionObserver for reveals (motion spec: "One IntersectionObserver for all
 * reveals; no scroll-event handlers"). Section reveals, counters and the sections' own one-off entrance
 * moments all register here and fire once.
 */

type Watch = { ratio: number; done: () => void };

const watches = new Map<Element, Watch[]>();
let observer: IntersectionObserver | null = null;

/** Visible enough: the share asked for, or, for an element taller than the screen, most of the screen. */
function reached(entry: IntersectionObserverEntry, ratio: number) {
  return entry.intersectionRatio >= ratio || entry.intersectionRect.height >= window.innerHeight * 0.6;
}

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const list = watches.get(entry.target);
        if (!list) continue;
        const left = list.filter((watch) => {
          if (!reached(entry, watch.ratio)) return true;
          watch.done();
          return false;
        });
        if (left.length) watches.set(entry.target, left);
        else {
          watches.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      }
    },
    // Up to 1, so a ratio above 0.6 (the featured batch waits for 0.75) is ever seen to be reached.
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.7, 0.75, 0.8, 0.9, 1] },
  );
  return observer;
}

/**
 * Calls `done` once, the first time `ratio` of `el` is in view (0.2 for a section reveal, 0.5 for a
 * counter). Returns a function that cancels it. Without IntersectionObserver it fires at once.
 */
export function whenVisible(el: Element, ratio: number, done: () => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    done();
    return () => {};
  }
  const watch: Watch = { ratio, done };
  watches.set(el, [...(watches.get(el) ?? []), watch]);
  getObserver().observe(el);
  return () => {
    const left = (watches.get(el) ?? []).filter((w) => w !== watch);
    if (left.length) watches.set(el, left);
    else {
      watches.delete(el);
      observer?.unobserve(el);
    }
  };
}
