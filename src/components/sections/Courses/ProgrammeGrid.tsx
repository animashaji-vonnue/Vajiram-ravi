"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import { bentoProgrammes, stages, type BentoProgramme, type Stage } from "@/data/programme-bento";
import { prefersReducedMotion } from "@/lib/motion";
import ProgrammeCard from "./ProgrammeCard";

/*
 * The programme stages as tabs, right of the heading, over the 4 × 2 grid of cards (1280 wide, 16px gaps),
 * which is the tabs' panel. Motion spec, "05 Programmes / Tabs": choosing a stage re-flows the grid.
 *   1. Cards that leave fade and shrink to 0.96 (160ms, --ease-in); the others hold still.
 *   2. Then the grid changes, and the cards that stay slide from where they were to their new places
 *      (FLIP with Web Animations transforms, --dur-base, --ease-in-out) while new cards fade in
 *      (--dur-base, --ease-out).
 * The tab and its count change at once. A new choice mid-way picks up from what is on screen: sliding cards
 * slide on from where they are, and a card that was leaving and is wanted again turns back from where it
 * is. With reduced motion the grid just changes. The panel keeps the height of two rows, so a shorter list
 * does not move the page below.
 */

type Filter = "all" | Stage;

const listFor = (filter: Filter) => (filter === "all" ? bentoProgrammes : bentoProgrammes.filter((p) => p.stage === filter));
const keyOf = (programme: BentoProgramme) => programme.title;
const sameCards = (a: BentoProgramme[], b: BentoProgramme[]) => a.length === b.length && a.every((p, i) => keyOf(p) === keyOf(b[i]));

const TABS = [
  { id: "all", label: "All", count: bentoProgrammes.length },
  ...stages.map((stage) => ({ id: stage.id, label: stage.label, count: listFor(stage.id).length })),
];

const ID_PREFIX = "courses";
/** The leaving cards' fade, as the spec names it. */
const EXIT_MS = 160;

/** A motion token from :root, with the spec's value as the fallback. */
function token(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}
const easeOut = () => token("--ease-out", "cubic-bezier(0.22, 1, 0.36, 1)");

/** Each card runs at most one slide and one fade (enter, leave or return) at a time. */
type Kind = "move" | "fade";
type Plan = { first: Map<string, DOMRect>; entering: Set<string> };

export default function ProgrammeGrid({ intro }: { intro: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState<BentoProgramme[]>(bentoProgrammes);
  const gridRef = useRef<HTMLUListElement>(null);
  const items = useRef(new Map<string, HTMLLIElement>());
  const animations = useRef(new Map<string, Partial<Record<Kind, Animation>>>());
  /** Cards fading out, waiting to be removed. */
  const exiting = useRef(new Set<string>());
  /** Bumped on every choice, so a superseded exit does not commit its grid. */
  const version = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  /** Set just before the grid changes: where each staying card was on screen, and which cards are new. */
  const plan = useRef<Plan | null>(null);

  const stop = (key: string, kind?: Kind) => {
    const running = animations.current.get(key);
    if (!running) return;
    for (const k of kind ? [kind] : (["move", "fade"] as const)) {
      running[k]?.cancel();
      delete running[k];
    }
  };
  const play = (key: string, kind: Kind, animation: Animation) => {
    const running = animations.current.get(key) ?? {};
    running[kind]?.cancel();
    running[kind] = animation;
    animations.current.set(key, running);
  };

  const select = (id: string) => {
    const next = id as Filter;
    if (next === filter) return;
    setFilter(next);
    const nextList = listFor(next);
    const v = ++version.current;
    clearTimeout(timer.current);

    if (prefersReducedMotion()) {
      for (const key of animations.current.keys()) stop(key);
      exiting.current.clear();
      setShown(nextList);
      return;
    }

    const keep = new Set(nextList.map(keyOf));
    // Cards caught leaving by an earlier choice that this one wants back: they turn back from where they are.
    for (const key of [...exiting.current]) {
      if (!keep.has(key)) continue;
      exiting.current.delete(key);
      const el = items.current.get(key);
      if (!el) continue;
      const { opacity, transform } = getComputedStyle(el);
      play(key, "fade", el.animate([{ opacity, transform }, { opacity: 1, transform: "none" }], { duration: EXIT_MS, easing: easeOut() }));
    }
    // Cards leaving now fade and shrink.
    for (const programme of shown) {
      const key = keyOf(programme);
      if (keep.has(key) || exiting.current.has(key)) continue;
      const el = items.current.get(key);
      if (!el) continue;
      stop(key);
      exiting.current.add(key);
      play(
        key,
        "fade",
        el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.96)" }], {
          duration: EXIT_MS,
          easing: token("--ease-in", "cubic-bezier(0.4, 0, 1, 1)"),
          fill: "forwards",
        }),
      );
    }

    const commit = () => {
      if (version.current !== v) return;
      // The leaving cards keep their faded end state until React removes them; only forget them here.
      for (const key of exiting.current) animations.current.delete(key);
      exiting.current.clear();
      // Back to the cards already on screen (a choice undone mid-way): nothing to re-flow.
      if (sameCards(nextList, shown)) return;
      const before = new Set(shown.map(keyOf));
      const first = new Map<string, DOMRect>();
      const entering = new Set<string>();
      for (const programme of nextList) {
        const key = keyOf(programme);
        const el = items.current.get(key);
        if (before.has(key) && el) first.set(key, el.getBoundingClientRect());
        else entering.add(key);
      }
      plan.current = { first, entering };
      setShown(nextList);
    };
    if (exiting.current.size) timer.current = setTimeout(commit, EXIT_MS);
    else commit();
  };

  // The grid has changed: slide the staying cards from where they were, and fade the new ones in.
  useLayoutEffect(() => {
    const current = plan.current;
    const grid = gridRef.current;
    plan.current = null;
    if (!current || !grid) return;
    // On narrow screens the canvas is zoomed; measured distances are scaled by it, transforms are not.
    const zoom = grid.getBoundingClientRect().width / grid.offsetWidth || 1;
    const duration = parseFloat(token("--dur-base", "320ms")) || 320;
    for (const programme of shown) {
      const key = keyOf(programme);
      const el = items.current.get(key);
      if (!el) continue;
      if (current.entering.has(key)) {
        play(key, "fade", el.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: easeOut() }));
        continue;
      }
      const first = current.first.get(key);
      if (!first) continue;
      // `first` included any slide still running; measure the new place without it.
      stop(key, "move");
      const last = el.getBoundingClientRect();
      const dx = (first.left - last.left) / zoom;
      const dy = (first.top - last.top) / zoom;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      play(
        key,
        "move",
        el.animate([{ translate: `${dx}px ${dy}px` }, { translate: "0px 0px" }], {
          duration,
          easing: token("--ease-in-out", "cubic-bezier(0.65, 0, 0.35, 1)"),
        }),
      );
    }
  }, [shown]);

  useEffect(() => {
    const running = animations.current;
    return () => {
      clearTimeout(timer.current);
      running.forEach((entry) => Object.values(entry).forEach((animation) => animation?.cancel()));
    };
  }, []);

  return (
    <>
      <div className="flex w-full items-end justify-between">
        {intro}
        <div data-reveal="sm">
          <TraditionalTabs tabs={TABS} value={filter} onChange={select} label="Programme stages" idPrefix={ID_PREFIX} />
        </div>
      </div>

      <div role="tabpanel" id={`${ID_PREFIX}-panel`} aria-labelledby={`${ID_PREFIX}-tab-${filter}`} className="h-[456px] w-full">
        <ul ref={gridRef} data-reveal-group className="flex w-full flex-wrap content-start items-start gap-4">
          {shown.map((programme) => (
            <li
              key={keyOf(programme)}
              ref={(el) => {
                const key = keyOf(programme);
                if (el) items.current.set(key, el);
                return () => {
                  items.current.delete(key);
                };
              }}
              className="shrink-0"
            >
              <ProgrammeCard programme={programme} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
