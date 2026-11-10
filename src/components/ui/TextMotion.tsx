"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * The page's text, section and scroll motion, after wabcoffeeco.com's (its GSAP scene, recreated with the
 * Web Animations API and the scroll position), for every section from the hero down. Mark elements with:
 *
 *   Entrances (once, as they come into view; not when already on screen at load)
 *   data-split    a heading: its letters, each word in its own mask, rise into place from below the mask
 *                 (from 110% down, 1s, 11ms apart, --ease-out-like "power3.out") once its top passes 82%
 *                 of the screen. Other elements inside it (the orange emphasis) keep their own colour.
 *   data-zoom     a card: it rises 48px and grows from 94% into place (900ms).
 *   data-stagger  a list: its children rise 24px and fade in one after another, 70ms apart.
 *   data-wipe     a photo's frame: it is uncovered from its foot up ("up", the default; or "down", "left",
 *                 "right") by a clip-path wipe while its picture settles from 112% (1.1s);
 *                 data-wipe-delay="ms" holds it back.
 *   data-scramble a small mono label: its letters come in as shuffling glyphs that settle left to right
 *                 into the text (about 0.8s), like a departure board.
 *
 *   Driven by the scroll (scrubbed, every frame the page moves)
 *   data-words    a lead paragraph (or a block of them): its words go from 40% to full one after another
 *                 as it rises into the screen (from its top at the foot of the screen to 65% up), and stay
 *                 full once lit, so a paragraph is never left faint where the page stops.
 *   data-par      a picture's wrapper: it drifts against the scroll inside its frame (its parent), from -6%
 *                 to 6% of its height while the frame crosses the screen; data-par="10" for ±10%.
 *   data-drift    decoration: it drifts this many px over its section's whole crossing of the screen
 *                 (positive: slower than the page, so it sits deeper; negative: faster, nearer).
 *   data-turn     an ornament: it turns this many degrees over its section's crossing (with data-drift too).
 *   data-rise     a large block (a carousel): it rises 72px, grows from 95% and brightens from 40% as its
 *                 parent's top comes up the lower half of the screen, then rests untouched.
 *   data-curtain  a band: it starts a little inset with rounded corners and opens out to the full width as
 *                 it rises into the screen (its top from the foot of the screen to 40% up).
 *   data-count    a figure: the first number in it counts up from 0 (1.4s) the first time it is seen
 *                 (on screen, visible and not faded out), its width held so the line never moves.
 *   (headings)    every split h2 drifts a few pixels against the scroll while it crosses the screen.
 *   (the thread)  a slim dash-dot thread across the top of the screen, the journey thread's rhythm in
 *                 orange to burnt, fills with the share of the page scrolled, a saffron bead at its end.
 *
 *   Ambient loops (CSS in globals.css; they run only while their section is on screen)
 *   Every section and the footer gets `--lp: running` while it is in view (one IntersectionObserver) and
 *   `paused` when it leaves; the loop classes (.lp-sway, .lp-breathe, .lp-glow, .lp-wobble, .lp-glint and
 *   the emphasis glint) take their animation-play-state from it, so nothing loops off screen and, before
 *   the script runs, every loop holds its first frame, which is the element at rest.
 *   The emphasis glint: the coloured emphasis of every split heading (em, the orange and burnt words) and
 *   any [data-sweep] heading's [data-sweep-unit] words catch a soft light that runs through them letter by
 *   letter every 10 seconds (brightness and a faint gold glow, a filter); data-sweep="ms" sets the step.
 *
 * One requestAnimationFrame loop does all the scroll-driven work, the counting and the scrambling: it runs
 * when the page scrolls or resizes and keeps going only while a figure counts or a label shuffles. Only
 * transform, opacity, filter and clip-path change. The split heading keeps its words for assistive
 * technology (aria-label; the letters are hidden from it), and nothing is hidden before the script has run.
 * Reduced motion: none of this; the text is simply there, the loops are off and the thread is not drawn.
 */

/** "power3.out", as wabcoffeeco.com eases its letters. */
const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const CHAR_MS = 1000;
const CHAR_STAGGER = 11;
/** The faintest a word gets before the scroll reaches it: still readable, never washed out. */
const WORD_FLOOR = 0.4;
/** The glyphs a scrambling label shuffles through, and how often they change. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SHUFFLE_MS = 55;
const COUNT_MS = 1400;
/** How often a figure that is on screen but not yet visible (a hidden journey stage) is looked at again. */
const COUNT_POLL_MS = 300;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

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

/** Splits every text node under `el` into word spans, leaving its elements in place. */
function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  for (const node of textNodes(el)) {
    const parts = (node.textContent ?? "").split(/(\s+)/);
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.append(document.createTextNode(part));
        continue;
      }
      const word = document.createElement("span");
      word.className = "tm-wd";
      word.textContent = part;
      frag.append(word);
      words.push(word);
    }
    node.replaceWith(frag);
  }
  return words;
}

/** Relative luminance of a computed rgb() colour, 0 (black) to 1 (white); 1 when it cannot be read. */
function luminance(color: string) {
  const channels = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  if (channels.length < 3 || channels.some(Number.isNaN)) return 1;
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

type Scramble = { nodes: Text[]; finals: string[]; total: number; start: number; duration: number; shuffled: number };
type Counter = { el: HTMLElement; node: Text; final: string; head: string; tail: string; target: number; commas: boolean; start: number };
type Drifter = { el: HTMLElement; frame: Element; y: number; turn: number; last: string };

export default function TextMotion() {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || typeof document.body.animate !== "function") return;
    const cleanups: Array<() => void> = [];

    // Headings: letters rising out of their masks.
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
      const animations = chars.map((ch, i) =>
        ch.animate([{ transform: "translateY(110%)" }, { transform: "none" }], { duration: CHAR_MS, delay: i * CHAR_STAGGER, easing: EASE, fill: "backwards" }),
      );
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.play());
      observer.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    });
    cleanups.push(() => observer.disconnect());

    // The emphasis glint: the coloured emphasis letters of split headings, and [data-sweep] words.
    document.querySelectorAll<HTMLElement>("[data-split], [data-sweep]").forEach((heading) => {
      const units = new Set<HTMLElement>(heading.querySelectorAll<HTMLElement>("[data-sweep-unit]"));
      heading.querySelectorAll<HTMLElement>("em, [data-reveal-em], .text-orange, .text-burnt").forEach((em) => {
        // Dark emphasis (the newspaper's ink italic) has no light to catch.
        if (luminance(getComputedStyle(em).color) < 0.06) return;
        em.querySelectorAll<HTMLElement>(".tm-ch").forEach((ch) => units.add(ch));
      });
      if (!units.size) return;
      const step = Number(heading.dataset.sweep);
      if (step) heading.style.setProperty("--gs", `${step}ms`);
      let i = 0;
      units.forEach((unit) => {
        unit.classList.add("tm-glint");
        unit.style.setProperty("--gi", String(i++));
      });
      cleanups.push(() => {
        heading.style.removeProperty("--gs");
        units.forEach((unit) => {
          unit.classList.remove("tm-glint");
          unit.style.removeProperty("--gi");
        });
      });
    });

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

    // Cards, lists, photos and labels: entrances, once, as they come into view (not when already on screen).
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
    const arm = (el: HTMLElement, animations: Animation[]) => {
      animations.forEach((a) => a.pause());
      (el as Playable).tmPlay = () => animations.forEach((a) => a.play());
      enter.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    };
    document.querySelectorAll<HTMLElement>("[data-zoom]").forEach((el) => {
      if (!below(el)) return;
      arm(el, [el.animate([{ opacity: 0, transform: "translateY(48px) scale(0.94)" }, { opacity: 1, transform: "none" }], { duration: 900, easing: EASE, fill: "backwards" })]);
    });
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((el) => {
      if (!below(el)) return;
      const items = Array.from(el.children) as HTMLElement[];
      arm(el, items.map((item, i) => item.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: i * 70, easing: EASE, fill: "backwards" })));
    });
    const WIPES: Record<string, string> = { up: "inset(100% 0 0 0)", down: "inset(0 0 100% 0)", left: "inset(0 0 0 100%)", right: "inset(0 100% 0 0)" };
    document.querySelectorAll<HTMLElement>("[data-wipe]").forEach((el) => {
      if (!below(el)) return;
      const delay = Number(el.dataset.wipeDelay) || 0;
      const from = WIPES[el.dataset.wipe ?? ""] ?? WIPES.up;
      const animations = [el.animate([{ clipPath: from }, { clipPath: "inset(0 0 0 0)" }], { duration: 1100, delay, easing: EASE, fill: "backwards" })];
      const picture = el.querySelector("img");
      if (picture) animations.push(picture.animate([{ scale: "1.12" }, { scale: "1" }], { duration: 1400, delay, easing: EASE, fill: "backwards" }));
      arm(el, animations);
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
        scrambles.push({ nodes, finals, total, start: performance.now(), duration: Math.min(1100, 420 + total * 22), shuffled: 0 });
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
            const settled = progress >= 0.3 + 0.7 * (k++ / job.total);
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

    // Leads, pictures, ornaments, blocks, bands and the thread: driven by the scroll position.
    const leads = Array.from(document.querySelectorAll<HTMLElement>("[data-words]"), (el) => ({
      el,
      words: el.dataset.tmDone ? Array.from(el.querySelectorAll<HTMLElement>(".tm-wd")) : splitWords(el),
      lit: 0,
    }));
    leads.forEach(({ el }) => (el.dataset.tmDone = "1"));
    const drifting = Array.from(document.querySelectorAll<HTMLElement>("h2[data-split]"));
    const pictures = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"), (el) => ({ el, amount: Number(el.dataset.par) || 6 }));
    const drifters: Drifter[] = Array.from(document.querySelectorAll<HTMLElement>("[data-drift], [data-turn]"), (el) => ({
      el,
      frame: el.closest("[data-drift-frame]") ?? el.parentElement?.closest("section, footer") ?? el.parentElement ?? el,
      y: Number(el.dataset.drift) || 0,
      turn: Number(el.dataset.turn) || 0,
      last: "",
    }));
    const risers = Array.from(document.querySelectorAll<HTMLElement>("[data-rise]"));
    const curtains = Array.from(document.querySelectorAll<HTMLElement>("[data-curtain]"));
    const thread = threadRef.current;
    const fill = thread?.querySelector<HTMLElement>("[data-thread-fill]");
    const bead = thread?.querySelector<HTMLElement>("[data-thread-bead]");

    const scrollUpdate = () => {
      const vh = window.innerHeight;
      for (const lead of leads) {
        const { el, words } = lead;
        if (!words.length || lead.lit >= words.length) continue;
        const top = el.getBoundingClientRect().top;
        // 0 when its top is at the foot of the screen, 1 when it has risen to 65% (or is above it).
        const progress = clamp01((vh - top) / (vh * 0.35));
        const lit = Math.max(lead.lit, progress * words.length);
        if (lit === lead.lit) continue;
        lead.lit = lit;
        words.forEach((word, i) => {
          word.style.opacity = String(WORD_FLOOR + (1 - WORD_FLOOR) * clamp01(lit - i));
        });
      }
      for (const el of drifting) {
        const box = el.getBoundingClientRect();
        const progress = clamp01((vh - box.top) / (vh + box.height));
        el.style.translate = `0 ${(14 - 28 * progress).toFixed(1)}px`;
      }
      for (const { el, amount } of pictures) {
        const frameBox = (el.parentElement ?? el).getBoundingClientRect();
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
      for (const el of risers) {
        const top = (el.parentElement ?? el).getBoundingClientRect().top;
        // 0 with its top at the foot of the screen, 1 once it has come halfway up (then left alone).
        const progress = clamp01((vh - top) / (vh * 0.5));
        if (progress >= 1) {
          if (el.style.transform) {
            el.style.transform = "";
            el.style.opacity = "";
          }
          continue;
        }
        const e = easeOut(progress);
        el.style.transform = `translateY(${((1 - e) * 72).toFixed(1)}px) scale(${(0.95 + 0.05 * e).toFixed(4)})`;
        el.style.opacity = (0.4 + 0.6 * e).toFixed(3);
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
      if (thread && fill && bead) {
        const doc = document.documentElement.getBoundingClientRect();
        const share = clamp01(-doc.top / Math.max(1, doc.height - vh));
        fill.style.clipPath = `inset(0 ${((1 - share) * 100).toFixed(3)}% 0 0)`;
        bead.style.transform = `translateX(${(share * 100).toFixed(3)}%)`;
        thread.toggleAttribute("data-on", share > 0.002);
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
      risers.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
      });
      thread?.removeAttribute("data-on");
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // The scroll thread: a faint dash-dot track, its saffron-to-burnt fill and the bead at the fill's end.
  return (
    <div ref={threadRef} aria-hidden="true" className="tm-thread">
      <span className="tm-thread__track" />
      <span data-thread-fill className="tm-thread__fill" />
      <span data-thread-bead className="tm-thread__bead" />
    </div>
  );
}
