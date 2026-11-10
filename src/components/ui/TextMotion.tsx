"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * Text and section motion after wabcoffeeco.com's (its GSAP scene, recreated with the Web Animations API
 * and the scroll position), for the sections from Explore UPSC Programmes down. Mark elements with:
 *
 *   data-split    a heading: its letters, each word in its own mask, rise into place from below the mask
 *                 (from 110% down, 1s, 11ms apart, --ease-out-like "power3.out") once its top passes 82%
 *                 of the screen. Other elements inside it (the orange emphasis) keep their own colour.
 *   data-words    a lead paragraph (or a block of them): its words go from 40% to full one after another
 *                 as it rises into the screen (from its top at the foot of the screen to 65% up), and stay
 *                 full once lit, so a paragraph is never left faint where the page stops.
 *   data-par      a picture's wrapper: it drifts against the scroll (from -6% to 6% of its height while
 *                 its frame crosses the screen).
 *   data-curtain  a band: it starts a little inset with rounded corners and opens out to the full width as
 *                 it rises into the screen (its top from the foot of the screen to 40% up).
 *   data-zoom     a card: once, as it comes into view, it rises 48px and grows from 94% into place (900ms).
 *   data-stagger  a list: once, as it comes into view, its children rise 24px and fade in one after
 *                 another, 70ms apart.
 *   (headings)    every split heading drifts a few pixels against the scroll while it crosses the screen,
 *                 so the sections never sit dead still.
 *
 * The split heading keeps its words for assistive technology (aria-label; the letters are hidden from it),
 * and nothing is hidden before the script has run. Reduced motion: none of this; the text is simply there.
 */

/** "power3.out", as wabcoffeeco.com eases its letters. */
const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const CHAR_MS = 1000;
const CHAR_STAGGER = 11;
/** The faintest a word gets before the scroll reaches it: still readable, never washed out. */
const WORD_FLOOR = 0.4;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/** Splits every text node under `el` into words (masked) of letters, leaving its elements in place. */
function splitLetters(el: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
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
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
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

export default function TextMotion() {
  useEffect(() => {
    if (prefersReducedMotion() || typeof document.body.animate !== "function") return;
    const cleanups: Array<() => void> = [];

    // Headings: letters rising out of their masks.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          (entry.target as HTMLElement & { tmPlay?: () => void }).tmPlay?.();
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
      (el as HTMLElement & { tmPlay?: () => void }).tmPlay = () => animations.forEach((a) => a.play());
      observer.observe(el);
      cleanups.push(() => animations.forEach((a) => a.finish()));
    });
    cleanups.push(() => observer.disconnect());

    // Cards and lists: entrances, once, as they come into view (not when already on screen).
    const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          enter.unobserve(entry.target);
          (entry.target as HTMLElement & { tmPlay?: () => void }).tmPlay?.();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    const arm = (el: HTMLElement, animations: Animation[]) => {
      animations.forEach((a) => a.pause());
      (el as HTMLElement & { tmPlay?: () => void }).tmPlay = () => animations.forEach((a) => a.play());
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
    cleanups.push(() => enter.disconnect());
    const drifting = Array.from(document.querySelectorAll<HTMLElement>("h2[data-split]"));

    // Leads, pictures and bands: driven by the scroll position.
    const leads = Array.from(document.querySelectorAll<HTMLElement>("[data-words]"), (el) => ({ el, words: el.dataset.tmDone ? [] : splitWords(el), lit: 0 }));
    leads.forEach(({ el }) => (el.dataset.tmDone = "1"));
    const pictures = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));
    const curtains = Array.from(document.querySelectorAll<HTMLElement>("[data-curtain]"));

    let frame = 0;
    const update = () => {
      frame = 0;
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
      for (const el of pictures) {
        const frameBox = (el.parentElement ?? el).getBoundingClientRect();
        const progress = clamp01((vh - frameBox.top) / (vh + frameBox.height));
        el.style.transform = `translateY(${(-6 + 12 * progress).toFixed(2)}%)`;
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
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
