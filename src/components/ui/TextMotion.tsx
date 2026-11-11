"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The page's text, section and scroll motion, after wabcoffeeco.com's (its GSAP scene, recreated with the
 * Web Animations API and the scroll position), for every section from the hero down.
 *
 * Readability comes first (the client, 11 Nov 2026: animations colliding left people unable to read):
 *   - one entrance per block, never stacked on the same text;
 *   - text is readable fast: every entrance on text is over within about 600ms of it coming into view,
 *     with no delay over 200ms and staggers of at most 50ms an item;
 *   - nothing the visitor reads is ever scrubbed by the scroll: scroll-driven effects move decoration only
 *     (photos, ornaments, a band's edge, the large brand line), and text never waits for them;
 *   - no ambient loop runs over text;
 *   - after an entrance, everything is in its final state even if the visitor stops scrolling.
 *
 * Mark elements with:
 *
 *   Entrances (once, as they come into view; not when already on screen at load)
 *   data-split    a heading: its letters, each word in its own mask, rise into place from below the mask
 *                 (480ms, a few ms apart and never more than 120ms from first to last, "power3.out") once
 *                 its top passes 82% of the screen. Other elements inside it keep their own colour.
 *   data-zoom     a card: it rises 32px and grows from 96% into place (520ms).
 *   data-stagger  a list: its children rise 16px and fade in one after another (480ms, 40ms apart, the
 *                 stagger stopping after the fifth).
 *   data-rise     a large block (a carousel): it rises 40px and grows from 97% into place (560ms).
 *   data-wipe     a photo's frame: it is uncovered from its foot up ("up", the default; or "down", "left",
 *                 "right") by a clip-path wipe while its picture settles from 108% (700ms);
 *                 data-wipe-delay="ms" holds it back (at most 200ms).
 *   data-scramble a small label: its letters come in as shuffling glyphs that settle left to right into
 *                 the text, like a departure board (at most 600ms).
 *   data-fade     body content (a card, a row, a band): it fades in out of a soft blur (6px to sharp,
 *                 500ms), after React Bits "Fade Content"; data-fade="ms" holds it back (at most 200ms).
 *                 On a list, data-fade-each does it to its children, 40ms apart.
 *   data-depth-cards  a row of cards (the batch tickets), after React Bits Pro "Parallax Cards": as the
 *                 row comes into view its cards start at different depths (some lower, smaller and
 *                 fainter than others, each a little turned) and settle together into the flat row
 *                 (560ms, 40ms apart). Only the individual translate, scale and rotate properties and
 *                 opacity are animated, so it composes with the row's own transform animations (its
 *                 re-flow, the stamp's shake).
 *   data-count    a figure: the first number in it counts up from 0 (600ms) the first time it is seen
 *                 (on screen, visible and not faded out), its width held so the line never moves.
 *
 *   Driven by the scroll (decoration only, every frame the page moves)
 *   data-par      a picture's wrapper: it drifts against the scroll inside its frame (its parent), from -6%
 *                 to 6% of its height while the frame crosses the screen; data-par="10" for ±10%.
 *   data-drift    decoration: it drifts this many px over its section's whole crossing of the screen
 *                 (positive: slower than the page, so it sits deeper; negative: faster, nearer).
 *   data-turn     an ornament: it turns this many degrees over its section's crossing (with data-drift too).
 *   data-curtain  a band: it starts a little inset with rounded corners and opens out to the full width as
 *                 it rises into the screen (its top from the foot of the screen to 40% up). Its edge only.
 *   data-expand   a picture with no text on it, after React Bits "Scroll Expand" (without pinning the
 *                 page): it starts as a smaller rounded card in its frame and opens out to fill it
 *                 (clip-path, eased in and out) from when the whole card is up over the foot of the screen
 *                 until its middle reaches the middle of the screen.
 *                 data-expand="w h" the card's size as fractions of the frame (default "0.4 0.45"),
 *                 data-expand-focus="x y" where the card sits in the frame (default "0.5 0.5"),
 *                 data-expand-radius="px" the card's corners (default 28).
 *   data-marquee  a band of large brand type (ui/TextMarquee, decoration): its [data-marquee-track] slides
 *                 sideways this many px (negative: to the left) over the band's crossing of the screen.
 *   data-gb-viewport  the soft blur at the foot of the screen (ui/GradualBlur): shown once the page has
 *                 left its first screen, and taken away again near the end of the page.
 *   (data-words, data-sweep: no longer animated. Leads are simply there, and the emphasis glint that ran
 *   through heading words is gone: both kept text faint or moving while it was being read.)
 *
 *   Ambient loops (CSS in globals.css; they run only while their section is on screen)
 *   Every section and the footer gets `--lp: running` while it is in view (one IntersectionObserver) and
 *   `paused` when it leaves; the loop classes (.lp-sway, .lp-breathe, .lp-glow, .lp-wobble, .lp-glint) take
 *   their animation-play-state from it, so nothing loops off screen and, before the script runs, every loop
 *   holds its first frame, which is the element at rest. None of them is on text.
 *
 * One requestAnimationFrame loop does all the scroll-driven work, the counting and the scrambling: it runs
 * when the page scrolls or resizes and keeps going only while a figure counts or a label shuffles; each
 * scroll effect skips what is off screen. Only transform (and its individual properties), opacity, filter
 * and clip-path change. The split heading keeps its words for assistive technology (aria-label; the
 * letters are hidden from it), and nothing is hidden before the script has run.
 * Reduced motion: none of this; the text is simply there and the loops are off.
 */

/** "power3.out", as wabcoffeeco.com eases its letters. */
const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const CHAR_MS = 480;
/** The letters' stagger: a few ms apart, and never more than this from the first letter to the last. */
const CHAR_STAGGER = 8;
const CHAR_SPREAD_MS = 120;
/** Text entrances: no delay over this, and staggers of at most STEP_MS an item, stopping after MAX_STEPS. */
const MAX_DELAY_MS = 200;
const STEP_MS = 40;
const MAX_STEPS = 5;
/** The glyphs a scrambling label shuffles through, and how often they change. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHUFFLE_MS = 50;
const COUNT_MS = 600;
/** How often a figure that is on screen but not yet visible (a hidden journey stage) is looked at again. */
const COUNT_POLL_MS = 300;

/**
 * Each card's depth in a parallax deck (0 at the front, 1 the furthest back), in a fixed, uneven order,
 * and the way it is turned (degrees, before the depth).
 */
const DECK_DEPTH = [0.85, 0.35, 1, 0.55, 0.9, 0.3, 0.7, 0.45];
const DECK_TURN = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.2, -2, 1.4];

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const stagger = (i: number) => Math.min(i, MAX_STEPS) * STEP_MS;

type Playable = HTMLElement & { tmPlay?: () => void };

function textNodes(el: HTMLElement): Text[] {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  return nodes;
}

/** Splits every text node under `el` into words (masked) of letters, leaving its elements in place. */
function splitLetters(el: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  for (const node of textNodes(el)) {
    const parts = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(" "));
        continue;
      }
      const mask = document.createElement("span");
      mask.className = "tm-mask";
      mask.setAttribute("aria-hidden", "true");
      for (const letter of Array.from(part)) {
        const ch = document.createElement("span");
        ch.className = "tm-ch";
        ch.textContent = letter;
        mask.append(ch);
        chars.push(ch);
      }
      frag.append(mask);
    }
    node.replaceWith(frag);
  }
  return chars;
}

type Scramble = { nodes: Text[]; finals: string[]; total: number; start: number; duration: number; shuffled: number };
type Counter = { el: HTMLElement; node: Text; final: string; head: string; tail: string; target: number; commas: boolean; start: number };
type Drifter = { el: HTMLElement; frame: Element; y: number; turn: number; last: string };
type Expand = { el: HTMLElement; size: [number, number]; focus: [number, number]; radius: number; last: number };

/** Reads "a b" (two positive numbers; one is used for both) from an attribute. */
function pair(value: string | undefined, fallback: [number, number]): [number, number] {
  const [a, b] = (value ?? "").trim().split(/\s+/).map(Number);
  const first = Number.isFinite(a) && a > 0 ? a : fallback[0];
  return [first, Number.isFinite(b) && b > 0 ? b : Number.isFinite(a) && a > 0 ? a : fallback[1]];
}

export default function TextMotion() {
  useEffect(() => {
    if (prefersReducedMotion() || typeof document.body.animate !== "function") return;
    const cleanups: Array<() => void> = [];

    // Headings: letters rising out of their masks, quickly.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          (entry.target as Playable).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      if (el.dataset.tmDone) return;
      el.dataset.tmDone = "1";
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", (el.textContent ?? "").replace(/\s+/g, " ").trim());
      const chars = splitLetters(el);
      const step = Math.min(CHAR_STAGGER, CHAR_SPREAD_MS / Math.max(1, chars.length));
      const animations = chars.map((ch, i) =>
        ch.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: CHAR_MS, delay: i * step, easing: EASE, fill: "backwards" }),
      );
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.playState === "paused" && a.play());
      observer.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    });
    cleanups.push(() => observer.disconnect());

    // The ambient loops run only while their section is on screen.
    const zones = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) (entry.target as HTMLElement).style.setProperty("--lp", entry.isIntersecting ? "running" : "paused");
      },
      { rootMargin: "80px 0px" },
    );
    const zoneEls = Array.from(document.querySelectorAll<HTMLElement>("section, footer, [data-lp-zone]"));
    zoneEls.forEach((zone) => zones.observe(zone));
    cleanups.push(() => {
      zones.disconnect();
      zoneEls.forEach((zone) => zone.style.removeProperty("--lp"));
    });

    // Cards, lists, blocks, photos and labels: entrances, once, as they come into view (not when already
    // on screen).
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          enter.unobserve(entry.target);
          (entry.target as Playable).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    // (Only a paused entrance plays: one finished early, behind a section jump's curtain, stays finished.)
    const arm = (el: HTMLElement, animations: Animation[]) => {
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.playState === "paused" && a.play());
      enter.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    };
    const held = (value: string | undefined) => Math.min(MAX_DELAY_MS, Number(value) || 0);
    document.querySelectorAll<HTMLElement>("[data-zoom]").forEach((el) => {
      if (!below(el)) return;
      arm(el, [el.animate([{ opacity: 0, transform: "translateY(32px) scale(0.96)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE, fill: "backwards" })]);
    });
    document.querySelectorAll<HTMLElement>("[data-rise]").forEach((el) => {
      if (!below(el)) return;
      arm(el, [el.animate([{ opacity: 0, transform: "translateY(40px) scale(0.97)" }, { opacity: 1, transform: "none" }], { duration: 560, easing: EASE, fill: "backwards" })]);
    });
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((el) => {
      if (!below(el)) return;
      const items = Array.from(el.children) as HTMLElement[];
      arm(el, items.map((item, i) => item.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: stagger(i), easing: EASE, fill: "backwards" })));
    });
    const WIPES: Record<string, string> = { up: "inset(100% 0 0 0)", down: "inset(0 0 100% 0)", left: "inset(0 0 0 100%)", right: "inset(0 100% 0 0)" };
    document.querySelectorAll<HTMLElement>("[data-wipe]").forEach((el) => {
      if (!below(el)) return;
      const delay = held(el.dataset.wipeDelay);
      const from = WIPES[el.dataset.wipe ?? ""] ?? WIPES.up;
      const animations = [el.animate([{ clipPath: from }, { clipPath: "inset(0 0 0 0)" }], { duration: 700, delay, easing: EASE, fill: "backwards" })];
      const picture = el.querySelector("img");
      if (picture) animations.push(picture.animate([{ scale: "1.08" }, { scale: "1" }], { duration: 900, delay, easing: EASE, fill: "backwards" }));
      arm(el, animations);
    });
    // Body content: out of a soft blur, after React Bits "Fade Content" (opacity and filter only, so it
    // never fights a transform of its own).
    const FADE: Keyframe[] = [
      { opacity: 0, filter: "blur(6px)" },
      { opacity: 1, filter: "blur(0px)" },
    ];
    document.querySelectorAll<HTMLElement>("[data-fade], [data-fade-each]").forEach((el) => {
      if (!below(el)) return;
      const delay = held(el.dataset.fade);
      const items = el.hasAttribute("data-fade-each") ? (Array.from(el.children) as HTMLElement[]) : [el];
      arm(el, items.map((item, i) => item.animate(FADE, { duration: 500, delay: delay + stagger(i), easing: EASE, fill: "backwards" })));
    });
    // A row of cards: from different depths into the flat row, together (the children are read when it
    // plays, so cards a filter has brought in since load are included).
    document.querySelectorAll<HTMLElement>("[data-depth-cards]").forEach((el) => {
      if (!below(el)) return;
      (el as Playable).tmPlay = () => {
        (Array.from(el.children) as HTMLElement[]).forEach((card, i) => {
          const depth = DECK_DEPTH[i % DECK_DEPTH.length];
          card.animate(
            [
              {
                translate: `${((i % 2 ? 1 : -1) * 18 * depth).toFixed(1)}px ${(-24 + 64 * depth).toFixed(1)}px`,
                scale: String(1 - 0.12 * depth),
                rotate: `${DECK_TURN[i % DECK_TURN.length]}deg`,
                opacity: 1 - 0.6 * depth,
              },
              { translate: "0 0", scale: "1", rotate: "0deg", opacity: 1 },
            ],
            { duration: 560, delay: stagger(i), easing: EASE, fill: "backwards" },
          );
        });
      };
      enter.observe(el);
    });
    cleanups.push(() => enter.disconnect());

    // The one frame loop: the scroll-driven work when the page has moved, then any counting or shuffling.
    let frame = 0;
    let dirty = true;
    const request = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Labels: shuffling glyphs that settle into the text.
    const scrambles: Scramble[] = [];
    document.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      if (!below(el)) return;
      const nodes = textNodes(el).filter((node) => (node.nodeValue ?? "").trim());
      if (!nodes.length) return;
      const finals = nodes.map((node) => node.nodeValue ?? "");
      const total = finals.reduce((sum, text) => sum + text.length, 0);
      (el as Playable).tmPlay = () => {
        scrambles.push({ nodes, finals, total, start: performance.now(), duration: Math.min(600, 300 + total * 10), shuffled: 0 });
        request();
      };
      enter.observe(el);
      cleanups.push(() => nodes.forEach((node, i) => (node.nodeValue = finals[i])));
    });
    const runScrambles = (now: number) => {
      for (let s = scrambles.length - 1; s >= 0; s--) {
        const job = scrambles[s];
        const progress = (now - job.start) / job.duration;
        if (progress >= 1) {
          job.nodes.forEach((node, i) => (node.nodeValue = job.finals[i]));
          scrambles.splice(s, 1);
          continue;
        }
        if (now - job.shuffled < SHUFFLE_MS) continue;
        job.shuffled = now;
        let k = 0;
        job.nodes.forEach((node, i) => {
          let out = "";
          for (const char of job.finals[i]) {
            // Each letter settles in turn, left to right, after a short shuffle for all.
            const settled = progress >= 0.2 + 0.8 * (k++ / job.total);
            if (settled || !/[a-z0-9]/i.test(char)) out += char;
            else {
              const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              out += char === char.toLowerCase() && char !== char.toUpperCase() ? glyph.toLowerCase() : glyph;
            }
          }
          node.nodeValue = out;
        });
      }
      return scrambles.length > 0;
    };

    // Figures: counting up the first time they are seen.
    const pending: Counter[] = [];
    const counting: Counter[] = [];
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const node = textNodes(el).find((n) => /\d/.test(n.nodeValue ?? ""));
      if (!node) return;
      const final = node.nodeValue ?? "";
      const match = final.match(/\d[\d,]*/);
      if (!match || match.index === undefined) return;
      const target = Number(match[0].replace(/,/g, ""));
      if (!target) return;
      pending.push({ el, node, final, head: final.slice(0, match.index), tail: final.slice(match.index + match[0].length), target, commas: match[0].includes(","), start: 0 });
    });
    cleanups.push(() =>
      counting.splice(0).forEach((c) => {
        c.node.nodeValue = c.final;
        c.el.style.removeProperty("display");
        c.el.style.removeProperty("min-width");
      }),
    );
    let poll = 0;
    const checkCounters = () => {
      const vh = window.innerHeight;
      let waiting = false;
      for (let i = pending.length - 1; i >= 0; i--) {
        const c = pending[i];
        const box = c.el.getBoundingClientRect();
        if (box.top > vh * 0.9 || box.bottom < 0) continue;
        const seen = typeof c.el.checkVisibility === "function" ? c.el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true;
        if (!seen) {
          waiting = true;
          continue;
        }
        pending.splice(i, 1);
        // Hold the figure's final width, so the words after it stay put while it counts.
        if (getComputedStyle(c.el).display === "inline") c.el.style.display = "inline-block";
        c.el.style.minWidth = `${c.el.offsetWidth}px`;
        c.start = performance.now();
        counting.push(c);
      }
      if (waiting && !poll) {
        poll = window.setTimeout(() => {
          poll = 0;
          checkCounters();
          if (counting.length) request();
        }, COUNT_POLL_MS);
      }
    };
    cleanups.push(() => window.clearTimeout(poll));
    const runCounters = (now: number) => {
      for (let i = counting.length - 1; i >= 0; i--) {
        const c = counting[i];
        const t = clamp01((now - c.start) / COUNT_MS);
        if (t >= 1) {
          c.node.nodeValue = c.final;
          c.el.style.removeProperty("display");
          c.el.style.removeProperty("min-width");
          counting.splice(i, 1);
          continue;
        }
        const n = Math.round(c.target * (1 - Math.pow(1 - t, 4)));
        c.node.nodeValue = c.head + (c.commas ? n.toLocaleString("en-US") : String(n)) + c.tail;
      }
      return counting.length > 0;
    };

    // Pictures, ornaments, bands, the brand line and the screen's foot: driven by the scroll position.
    const pictures = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"), (el) => ({ el, amount: Number(el.dataset.par) || 6 }));
    const drifters: Drifter[] = Array.from(document.querySelectorAll<HTMLElement>("[data-drift], [data-turn]"), (el) => ({
      el,
      frame: el.closest("[data-drift-frame]") ?? el.parentElement?.closest("section, footer") ?? el.parentElement ?? el,
      y: Number(el.dataset.drift) || 0,
      turn: Number(el.dataset.turn) || 0,
      last: "",
    }));
    const curtains = Array.from(document.querySelectorAll<HTMLElement>("[data-curtain]"));
    const expands: Expand[] = Array.from(document.querySelectorAll<HTMLElement>("[data-expand]"), (el) => ({
      el,
      size: pair(el.dataset.expand, [0.4, 0.45]),
      focus: pair(el.dataset.expandFocus, [0.5, 0.5]),
      radius: Number(el.dataset.expandRadius) || 28,
      last: -1,
    }));
    const marquees = Array.from(document.querySelectorAll<HTMLElement>("[data-marquee]"), (el) => ({
      el,
      track: el.querySelector<HTMLElement>("[data-marquee-track]") ?? el,
      travel: Number(el.dataset.marquee) || -480,
    }));
    const viewportBlur = document.querySelector<HTMLElement>("[data-gb-viewport]");

    const scrollUpdate = () => {
      const vh = window.innerHeight;
      for (const { el, amount } of pictures) {
        const frameBox = (el.parentElement ?? el).getBoundingClientRect();
        if (frameBox.bottom < 0 || frameBox.top > vh) continue;
        const progress = clamp01((vh - frameBox.top) / (vh + frameBox.height));
        el.style.transform = `translateY(${(-amount + 2 * amount * progress).toFixed(2)}%)`;
      }
      for (const d of drifters) {
        const box = d.frame.getBoundingClientRect();
        const progress = clamp01((vh - box.top) / (vh + box.height)) - 0.5;
        const value = `translate3d(0, ${(d.y * progress).toFixed(1)}px, 0)${d.turn ? ` rotate(${(d.turn * progress).toFixed(2)}deg)` : ""}`;
        if (value === d.last) continue;
        d.last = value;
        d.el.style.transform = value;
      }
      for (const el of curtains) {
        const top = el.getBoundingClientRect().top;
        const progress = clamp01((vh - top) / (vh * 0.6));
        if (progress >= 1) {
          el.style.clipPath = "";
        } else {
          const inset = (1 - progress) * 4;
          const radius = (1 - progress) * 40;
          el.style.clipPath = `inset(0 ${inset.toFixed(2)}% round ${radius.toFixed(1)}px)`;
        }
      }
      for (const x of expands) {
        const box = x.el.getBoundingClientRect();
        // Worked out even off screen, but written only when it changes: a jump past it leaves it open.
        // 0 while the whole card has just come up over the foot of the screen, 1 once its middle has
        // risen to the middle of the screen; eased in and out, so it reads as a card before it opens.
        const centre = box.top + x.focus[1] * box.height;
        const start = vh - (x.size[1] / 2) * box.height;
        const p = clamp01((start - centre) / Math.max(1, start - vh * 0.5));
        const step = Math.round(p * 1000);
        if (step === x.last) continue;
        x.last = step;
        if (p >= 1) {
          x.el.style.clipPath = "";
          continue;
        }
        const e = 1 - p * p * (3 - 2 * p);
        const [w, h] = x.size;
        const [fx, fy] = x.focus;
        // The card's edges, as insets of the frame, closing to nothing as it opens.
        const left = Math.max(0, fx - w / 2) * 100 * e;
        const right = Math.max(0, 1 - fx - w / 2) * 100 * e;
        const top = Math.max(0, fy - h / 2) * 100 * e;
        const bottom = Math.max(0, 1 - fy - h / 2) * 100 * e;
        x.el.style.clipPath = `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}% round ${(x.radius * e).toFixed(1)}px)`;
      }
      for (const m of marquees) {
        const box = m.el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) continue;
        const progress = clamp01((vh - box.top) / (vh + box.height));
        m.track.style.transform = `translate3d(${(m.travel * progress).toFixed(1)}px, 0, 0)`;
      }
      if (viewportBlur) {
        const end = document.documentElement.getBoundingClientRect().bottom - vh;
        viewportBlur.toggleAttribute("data-on", window.scrollY > vh * 0.5 && end > vh * 0.25);
      }
      checkCounters();
    };

    function tick(now: number) {
      frame = 0;
      if (dirty) {
        dirty = false;
        scrollUpdate();
      }
      const counts = runCounters(now);
      const shuffles = runScrambles(now);
      if (counts || shuffles) request();
    }
    const onScroll = () => {
      dirty = true;
      request();
    };
    request();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      drifters.forEach(({ el }) => (el.style.transform = ""));
      expands.forEach(({ el }) => (el.style.clipPath = ""));
      marquees.forEach((m) => (m.track.style.transform = ""));
      viewportBlur?.removeAttribute("data-on");
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
