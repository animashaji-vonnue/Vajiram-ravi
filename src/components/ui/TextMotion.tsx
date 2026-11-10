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
 *   data-words    a lead paragraph (or a block of them): its words go from faint to full one after another
 *                 as the page scrolls through it (from its top at 78% of the screen to its foot at 55%).
 *   data-par      a picture's wrapper: it drifts against the scroll (from -6% to 6% of its height while
 *                 its frame crosses the screen).
 *   data-curtain  a band: it starts a little inset with rounded corners and opens out to the full width as
 *                 it rises into the screen (its top from the foot of the screen to 40% up).
 *
 * The split heading keeps its words for assistive technology (aria-label; the letters are hidden from it),
 * and nothing is hidden before the script has run. Reduced motion: none of this; the text is simply there.
 */

/** "power3.out", as wabcoffeeco.com eases its letters. */
const EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";
const CHAR_MS = 1000;
const CHAR_STAGGER = 11;
/** The faintest a word gets before the scroll reaches it. */
const WORD_FLOOR = 0.18;

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

    // Leads, pictures and bands: driven by the scroll position.
    const leads = Array.from(document.querySelectorAll<HTMLElement>("[data-words]"), (el) => ({ el, words: el.dataset.tmDone ? [] : splitWords(el) }));
    leads.forEach(({ el }) => (el.dataset.tmDone = "1"));
    const pictures = Array.from(document.querySelectorAll<HTMLElement>("[data-par]"));
    const curtains = Array.from(document.querySelectorAll<HTMLElement>("[data-curtain]"));

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const { el, words } of leads) {
        if (!words.length) continue;
        const box = el.getBoundingClientRect();
        const start = vh * 0.78;
        const end = vh * 0.55;
        // 0 when the top is at 78% of the screen, 1 when the foot has risen to 55%.
        const progress = clamp01((start - box.top) / Math.max(1, start - end + box.height));
        const lit = progress * words.length;
        words.forEach((word, i) => {
          word.style.opacity = String(WORD_FLOOR + (1 - WORD_FLOOR) * clamp01(lit - i));
        });
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
