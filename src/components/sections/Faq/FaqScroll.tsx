"use client";

import { useEffect, useRef, useState } from "react";
import Cta from "@/components/ui/Cta";
import { EyebrowCentred, Flourish } from "@/components/ui/Ornament";
import type { FaqEntry, faqFooter, faqIntro } from "@/data/faq-chat";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";
import FaqAccordion from "./FaqAccordion";

/*
 * The scroll on its 1440 × 780 canvas: the gold frame, the warm spotlight, the 900 × 675 parchment and
 * its two gilded rods. Motion spec (11 FAQ, the signature moment), once, when the band comes into view:
 *   1. The scroll unrolls from the centre: the paper's clip-path opens from a 0px slit to full width
 *      (900ms, --ease-in-out) while the rods travel out from the centre to their places.
 *   2. As the rods stop, their tassels sway once (±4°, 1.2s), swinging on past the way the rods went.
 *   3. Then the eyebrow, heading, flourish, questions and footer fade in, 60ms apart.
 *   4. The wax seal stamps on last (scale 1.3 → 1, 220ms).
 * Under reduced motion, without JavaScript, or when the band is already on screen at load, the scroll is
 * simply open. Afterwards, hovering the seal with a mouse spins it a full turn about its own upright axis,
 * in 3D (after the "3D spin" hover effect): once per hover; not on touch, not under reduced motion.
 */

const UNROLL_MS = 900;
const SWAY_MS = 1200;
const SWAY_DEG = 4;
const FADE_MS = 600;
const STAGGER_MS = 60;
const STAMP_MS = 220;
/** The seal's hover spin: a full turn about its upright axis, seen through a 600px perspective. */
const SPIN_MS = 900;
const SPIN = [{ transform: "perspective(600px) rotateY(0deg)" }, { transform: "perspective(600px) rotateY(360deg)" }];
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
/** The eyebrow's rules grow out from its label, as in every section reveal. */
const RULE_HIDDEN = { lead: "inset(0 0 0 100%)", trail: "inset(0 100% 0 0)" } as const;

type FaqScrollProps = {
  entries: FaqEntry[];
  intro: typeof faqIntro;
  footer: typeof faqFooter;
};

export default function FaqScroll({ entries, intro, footer }: FaqScrollProps) {
  const [open, setOpen] = useState<number | null>(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const sealSpinRef = useRef<HTMLDivElement>(null);
  const rodRefs = useRef<Array<HTMLDivElement | null>>([]);

  /**
   * Hovering the seal (a mouse or trackpad) spins its face once. The seal's own box takes the hover and
   * stays still, so the turning face cannot drop the pointer and start another turn mid-spin.
   */
  const spinSeal = (event: { pointerType: string }) => {
    const seal = sealRef.current;
    const face = sealSpinRef.current;
    if (!seal || !face || typeof face.animate !== "function" || event.pointerType === "touch") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    // Not while the scroll is still rolled up or the seal stamping on, nor while a turn is under way.
    if (seal.style.opacity === "0" || seal.getAnimations().length || face.getAnimations().length) return;
    face.animate(SPIN, { duration: SPIN_MS, easing: EASE_IN_OUT });
  };

  useEffect(() => {
    const root = rootRef.current;
    const paper = paperRef.current;
    const seal = sealRef.current;
    const rods = rodRefs.current.filter((rod): rod is HTMLDivElement => rod !== null);
    if (!root || !paper || !seal || prefersReducedMotion()) return;
    // Already on screen at load (a link straight to #faq): it stays open.
    if (canvasTop(root) < (window.innerHeight / getCanvasZoom()) * 0.85) return;

    const items = Array.from(paper.querySelectorAll<HTMLElement>("[data-unroll]"));
    const rules = Array.from(paper.querySelectorAll<HTMLElement>("[data-eyebrow-rule]"));
    // Each rod starts at the centre of the canvas: how far it travels out to its place.
    const centre = root.offsetWidth / 2;
    const travel = rods.map((rod) => centre - (rod.offsetLeft + rod.offsetWidth / 2));

    // Rolled up until the band comes into view.
    const rolled = () => {
      paper.style.clipPath = "inset(0 50% 0 50%)";
      rods.forEach((rod, i) => (rod.style.transform = `translateX(${travel[i]}px)`));
      items.forEach((el) => (el.style.opacity = "0"));
      seal.style.opacity = "0";
    };
    const unrolled = () => {
      paper.style.clipPath = "";
      rods.forEach((rod) => (rod.style.transform = ""));
      items.forEach((el) => (el.style.opacity = ""));
      seal.style.opacity = "";
    };
    rolled();

    const animations: Animation[] = [];
    const cancelWatch = whenVisible(root, 0.4, () => {
      unrolled();
      const unroll = { duration: UNROLL_MS, easing: EASE_IN_OUT };
      animations.push(paper.animate([{ clipPath: "inset(0 50% 0 50%)" }, { clipPath: "inset(0 0% 0 0%)" }], unroll));
      rods.forEach((rod, i) => {
        animations.push(rod.animate([{ transform: `translateX(${travel[i]}px)` }, { transform: "none" }], unroll));
        // The tassel swings on in the direction its rod was travelling, then back, then settles.
        const tassel = rod.querySelector<HTMLElement>("[data-tassel]");
        const swing = travel[i] > 0 ? SWAY_DEG : -SWAY_DEG;
        const sway = tassel?.animate(
          [{ transform: "rotate(0deg)" }, { transform: `rotate(${swing}deg)` }, { transform: `rotate(${-swing}deg)` }, { transform: "rotate(0deg)" }],
          { duration: SWAY_MS, delay: UNROLL_MS, easing: "ease-in-out" },
        );
        if (sway) animations.push(sway);
      });
      items.forEach((el, i) => {
        animations.push(
          el.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: FADE_MS,
            delay: UNROLL_MS + Math.min(i, 8) * STAGGER_MS,
            easing: EASE_OUT,
            fill: "backwards",
          }),
        );
      });
      rules.forEach((rule) => {
        const side = rule.dataset.eyebrowRule === "lead" ? "lead" : "trail";
        animations.push(
          rule.animate([{ clipPath: RULE_HIDDEN[side] }, { clipPath: "inset(0 0 0 0)" }], {
            duration: 400,
            delay: UNROLL_MS,
            easing: EASE_OUT,
            fill: "backwards",
          }),
        );
      });
      animations.push(
        seal.animate([{ opacity: 0, transform: "scale(1.3)" }, { opacity: 1, transform: "scale(1)" }], {
          duration: STAMP_MS,
          delay: UNROLL_MS + Math.min(items.length, 8) * STAGGER_MS + FADE_MS / 2,
          easing: EASE_IN,
          fill: "backwards",
        }),
      );
    });

    return () => {
      cancelWatch();
      animations.forEach((animation) => animation.cancel());
      unrolled();
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto h-[780px] w-canvas">
      <img
        src="/images/faq/gold-frame.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={780}
        className="pointer-events-none absolute top-0 left-0 h-[780px] w-[1440px] max-w-none"
      />
      <img
        src="/images/faq/warm-spotlight.svg"
        alt=""
        aria-hidden="true"
        width={1100}
        height={760}
        className="pointer-events-none absolute top-[10px] left-[170px] h-[760px] w-[1100px] max-w-none"
      />

      {/* The parchment, 900 × 675; its content column is the questions' 788 width, centred as drawn. */}
      <div
        ref={paperRef}
        className="absolute top-[56px] left-[270px] flex h-[675px] w-[900px] flex-col items-center gap-3 overflow-clip bg-[#fff1dc] pt-10 pr-[50px] pb-16 pl-[62px]"
      >
        <PaperDecoration />

        <div data-unroll className="relative">
          <EyebrowCentred reveal={false} labelClassName="text-orange uppercase">
            {intro.eyebrow}
          </EyebrowCentred>
        </div>
        <h2 id="faq-h" data-unroll className="relative font-serif text-[52px]/[1.08] tracking-[-0.78px] whitespace-nowrap text-[#5e1710]">
          {intro.title} <em className="text-burnt">{intro.accent}</em>
        </h2>
        <div data-unroll className="relative">
          {/* The shared flourish, at the 200 × 46 the scroll draws it. */}
          <Flourish className="h-[46px]! w-[200px]!" />
        </div>

        <FaqAccordion entries={entries} open={open} onToggle={(index) => setOpen((current) => (current === index ? null : index))} />

        <div data-unroll className="relative flex w-[788px] shrink-0 items-center justify-between border-t border-[rgb(94_23_16/0.25)] pt-4">
          <p className="w-[470px] text-[13.5px]/[1.5] text-[#7a5e4c]">{footer.note}</p>
          <Cta variant="primary" size="md" href={footer.href}>
            {footer.cta}
          </Cta>
        </div>

        {/* The V&R wax seal, top right, turned 12°. Hovering it spins it a full turn in 3D (not focusable). */}
        <div ref={sealRef} aria-hidden="true" onPointerEnter={spinSeal} className="absolute top-[48.56px] left-[771.43px] size-[92px] rotate-12">
          <div ref={sealSpinRef} className="pointer-events-none absolute inset-0">
            <img
              src="/images/faq/wax-seal.svg"
              alt=""
              width={108}
              height={106.76}
              className="absolute top-[-3.38px] left-[-8px] h-[106.76px] w-[108px] max-w-none"
            />
            <img src="/images/faq/seal-ring.svg" alt="" width={65} height={65} className="absolute top-[13.5px] left-[13.5px] size-[65px] max-w-none" />
            <span className="absolute inset-x-0 top-[33px] text-center font-serif text-[24px]/[26px] whitespace-nowrap text-[#ffe5b4]">V&amp;R</span>
            <span className="absolute inset-x-0 top-[60px] text-center font-mono text-[9px]/[10px] whitespace-nowrap text-[#ffe5b4]/85">1976</span>
          </div>
        </div>
      </div>

      <Rod
        className="left-[230px]"
        rodRef={(el) => {
          rodRefs.current[0] = el;
        }}
      />
      <Rod
        className="left-[1150px]"
        rodRef={(el) => {
          rodRefs.current[1] = el;
        }}
      />
    </div>
  );
}

/** The parchment's texture, curl shading, double manuscript rule and corner buttas, as drawn. */
function PaperDecoration() {
  const corners = ["top-4 left-4", "top-4 left-[872px]", "top-[647px] left-4", "top-[647px] left-[872px]"];
  return (
    <>
      <img
        src="/images/free-resources/paper-texture.webp"
        alt=""
        aria-hidden="true"
        width={1024}
        height={1440}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-40"
      />
      <span aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-[675px] w-[26px] bg-linear-to-r from-[rgb(89_46_15/0.28)] to-[rgb(89_46_15/0)]" />
      <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[874px] h-[675px] w-[26px] bg-linear-to-l from-[rgb(89_46_15/0.28)] to-[rgb(89_46_15/0)]" />
      <span aria-hidden="true" className="pointer-events-none absolute top-[22px] left-[22px] h-[631px] w-[856px] border border-[rgb(204_85_0/0.45)]" />
      <span aria-hidden="true" className="pointer-events-none absolute top-[28px] left-[28px] h-[619px] w-[844px] border-[0.5px] border-[rgb(204_85_0/0.45)]" />
      {corners.map((place) => (
        <img
          key={place}
          src="/images/faq/corner-butta.svg"
          alt=""
          aria-hidden="true"
          width={12}
          height={12}
          className={`pointer-events-none absolute size-3 ${place}`}
        />
      ))}
    </>
  );
}

/**
 * A gilded rod, 60 × 675, with its tassel hanging below. The rod's drawing carries a tassel of its own;
 * it is cut off at the rod's foot and the separate tassel drawn in its place, so that one can sway.
 */
function Rod({ className, rodRef }: { className: string; rodRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={rodRef} aria-hidden="true" className={`pointer-events-none absolute top-[46px] h-[675px] w-[60px] ${className}`}>
      <div className="absolute top-[-3px] left-0 h-[678px] w-[60px] overflow-hidden">
        <img src="/images/faq/scroll-rod.svg" alt="" width={60} height={719.2} className="block h-[719.2px] w-[60px] max-w-none" />
      </div>
      <img
        data-tassel
        src="/images/faq/tassel.svg"
        alt=""
        width={11.52}
        height={43.2}
        className="absolute top-[673px] left-[24.24px] h-[43.2px] w-[11.52px] max-w-none origin-top"
      />
    </div>
  );
}
