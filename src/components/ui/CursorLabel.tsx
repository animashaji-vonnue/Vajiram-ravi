"use client";

import { useEffect, useRef, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import { getCanvasZoom } from "@/lib/canvas";
import { prefersReducedMotion } from "@/lib/motion";
import { FINE_POINTER, hasFinePointer } from "./PointerGlow";

/** The disc's diameter, in canvas px. */
const SIZE = 72;
/**
 * The disc sits below and right of the pointer, centre 40px off on both axes, so the system cursor (kept
 * visible) never covers the label.
 */
const OFFSET = 40;
/** The follow's time constant: the disc closes ~63% of the gap to the pointer in this long. */
const LAG_MS = 100;
/** The label swap: in over --dur-fast, out in 70% of it. */
const SWAP_IN_MS = 200;
const SWAP_OUT_MS = 140;
/* The motion tokens, for the Web Animations API (which cannot read CSS variables). */
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_IN = "cubic-bezier(0.4, 0, 1, 1)";
/** The swap's hidden state: small, blurred and clear. */
const AWAY = { opacity: 0, filter: "blur(4px)", transform: "scale(0.6)" };
const HERE = { opacity: 1, filter: "blur(0px)", transform: "scale(1)" };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  if (!window.matchMedia) return () => {};
  const queries = [window.matchMedia(FINE_POINTER), window.matchMedia(REDUCED_MOTION)];
  queries.forEach((query) => query.addEventListener("change", onChange));
  return () => queries.forEach((query) => query.removeEventListener("change", onChange));
}
const canShow = () => hasFinePointer() && !prefersReducedMotion();
const never = () => false;

type CursorLabelProps = {
  /** The region the disc shows over. */
  regionRef: RefObject<HTMLElement | null>;
  /**
   * The label where nothing under the pointer names one; null shows no disc there. An element in the
   * region names its own with `data-cursor-label="View"`, and `data-cursor-label=""` hides the disc over it.
   */
  fallback?: string | null;
};

/**
 * A cursor follower (after Skiper UI's "Hover members"): over its region, a 72px saffron disc follows the
 * pointer with an eased lag and says what a press does there ("View", "Drag"). It scales in from 0 when the
 * pointer comes into the region and out when it leaves, and a new label swaps in with a quick blur and scale
 * cross-fade. The system cursor stays as it is.
 *
 * The disc is portalled to <body> as a fixed element (so no carousel's clipping cuts it off), aria-hidden
 * and without pointer events; it moves by transform only, in a frame loop that runs only while it is on
 * its way. Its listeners are on the region only while the region is on screen. Fine pointers only;
 * nothing on touch or with reduced motion. It renders nothing where it is placed.
 */
export default function CursorLabel({ regionRef, fallback = null }: CursorLabelProps) {
  const enabled = useSyncExternalStore(subscribe, canShow, never);
  const discRef = useRef<HTMLSpanElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);
  const slotA = useRef<HTMLSpanElement>(null);
  const slotB = useRef<HTMLSpanElement>(null);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    fallbackRef.current = fallback;
  }, [fallback]);

  useEffect(() => {
    const region = regionRef.current;
    const disc = discRef.current;
    const face = faceRef.current;
    const slots = [slotA.current, slotB.current];
    if (!enabled || !region || !disc || !face || !slots[0] || !slots[1]) return;
    const [first, second] = slots as [HTMLSpanElement, HTMLSpanElement];

    let attached = false;
    let hovering = false;
    let label: string | null = null;
    let front = first;
    let back = second;
    let under: Element | null = null;
    let frame = 0;
    let last = 0;
    const target = { x: 0, y: 0 };
    const at = { x: 0, y: 0 };

    const write = () => {
      disc.style.transform = `translate3d(${at.x - SIZE / 2}px, ${at.y - SIZE / 2}px, 0)`;
    };

    /** What the element under the pointer asks for, or the region's fallback. */
    const resolve = (): string | null => {
      const named = under?.closest("[data-cursor-label]");
      if (named && region.contains(named)) return named.getAttribute("data-cursor-label") || null;
      return fallbackRef.current;
    };

    const setLabel = (next: string | null) => {
      if (next === label) return;
      const wasShown = label !== null;
      label = next;
      // Hiding keeps the last words on the disc while it scales away.
      face.toggleAttribute("data-shown", next !== null);
      if (next === null) return;
      if (!wasShown) {
        // Coming in from nothing: the disc's own scale-in carries it.
        back.getAnimations().forEach((animation) => animation.cancel());
        front.getAnimations().forEach((animation) => animation.cancel());
        back.style.opacity = "0";
        front.style.opacity = "1";
        front.textContent = next;
        return;
      }
      // Swap like an icon: the old words blur and shrink away as the new ones sharpen into place.
      const leaving = front;
      const arriving = back;
      front = arriving;
      back = leaving;
      arriving.textContent = next;
      leaving.getAnimations().forEach((animation) => animation.cancel());
      arriving.getAnimations().forEach((animation) => animation.cancel());
      leaving.style.opacity = "0";
      arriving.style.opacity = "1";
      leaving.animate([HERE, AWAY], { duration: SWAP_OUT_MS, easing: EASE_IN });
      arriving.animate([AWAY, HERE], { duration: SWAP_IN_MS, easing: EASE_OUT });
    };

    // Eases the disc toward the pointer; stops once it has arrived.
    const step = (time: number) => {
      const dt = last ? Math.min(64, time - last) : 16;
      last = time;
      const k = 1 - Math.exp(-dt / LAG_MS);
      at.x += (target.x - at.x) * k;
      at.y += (target.y - at.y) * k;
      if (Math.abs(target.x - at.x) < 0.1 && Math.abs(target.y - at.y) < 0.1) {
        at.x = target.x;
        at.y = target.y;
        write();
        frame = 0;
        last = 0;
        return;
      }
      write();
      frame = requestAnimationFrame(step);
    };
    const follow = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    // Fixed to the viewport, and the canvas may be zoomed down: screen px over the zoom.
    const aim = (event: PointerEvent) => {
      const zoom = getCanvasZoom();
      target.x = event.clientX / zoom + OFFSET;
      target.y = event.clientY / zoom + OFFSET;
      under = event.target instanceof Element ? event.target : null;
    };

    // `pointerover` rather than `pointerenter`: it bubbles from the element actually under the pointer, so
    // the first label is already the right one (and it fires again whenever that element changes).
    const onOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      aim(event);
      if (!hovering) {
        hovering = true;
        // Appears where the pointer is, rather than flying over from where it last was.
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
        at.x = target.x;
        at.y = target.y;
        write();
      }
      setLabel(resolve());
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!hovering) return onOver(event);
      aim(event);
      setLabel(resolve());
      follow();
    };
    const onLeave = () => {
      hovering = false;
      setLabel(null);
    };

    const attach = () => {
      if (attached) return;
      attached = true;
      region.addEventListener("pointerover", onOver);
      region.addEventListener("pointermove", onMove);
      region.addEventListener("pointerleave", onLeave);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      region.removeEventListener("pointerover", onOver);
      region.removeEventListener("pointermove", onMove);
      region.removeEventListener("pointerleave", onLeave);
      onLeave();
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? attach() : detach()));
      observer.observe(region);
    } else {
      attach();
    }

    return () => {
      observer?.disconnect();
      detach();
      cancelAnimationFrame(frame);
    };
  }, [enabled, regionRef]);

  if (!enabled) return null;
  return createPortal(
    <span ref={discRef} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-40 size-18 will-change-transform">
      <span
        ref={faceRef}
        className="absolute inset-0 scale-0 rounded-full bg-saffron text-ink opacity-0 shadow-rest [transition:scale_calc(var(--dur-fast)*0.7)_var(--ease-in),opacity_calc(var(--dur-fast)*0.7)_var(--ease-in)] data-shown:scale-100 data-shown:opacity-100 data-shown:[transition:scale_var(--dur-fast)_var(--ease-out),opacity_var(--dur-fast)_var(--ease-out)]"
      >
        {[slotA, slotB].map((slot, i) => (
          <span
            key={i}
            ref={slot}
            className="absolute inset-0 flex items-center justify-center font-sans text-[12px]/[14px] font-bold tracking-[0.01em] whitespace-nowrap opacity-0"
          />
        ))}
      </span>
    </span>,
    document.body,
  );
}
