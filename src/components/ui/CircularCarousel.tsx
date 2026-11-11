"use client";

import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { CarouselArrow, CarouselDots } from "@/components/ui/CarouselControls";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * A circular carousel after React Bits' "Circular Carousel" (cylinder preset): the cards stand round a
 * ring, facing out, and each card bends to follow it. The camera looks a little down onto the ring, so
 * the backs of the far cards show above and between the near ones, fading into the paper.
 *
 *   - The card at the front is the active one; the dots sit right under the ring, and `renderCaption`
 *     shows the front item under them, cross-fading as the front changes.
 *   - The ring turns by drag (mouse, finger), a sideways trackpad swipe, the arrows beside the ring (at
 *     `arrowReach` from the centre, or the stage's edges),
 *     the dots, the ← → keys, or a click on a card. A throw keeps going a little, then always settles
 *     square on a card.
 *   - It plays on its own (`interval`), one card at a time, showing the time left in the active dot, and
 *     pauses while the pointer is on the front card (not anywhere on the ring), while keyboard focus is
 *     inside it, while it is off screen or the tab is hidden (no pause button: the client asked for
 *     the dots alone). The pointer hold is let go whenever the front changes, since a card that turns away
 *     from under a still pointer never gets its pointerleave. Moving it by hand restarts the count.
 *   - It enters once, when it comes into view: the ring fades in turning a card and a half, and comes to
 *     rest on the first card within about a second. The caption changes in sequence (the old fades out in 140ms, then the new in 250ms), so it
 *     reads at once, and the first autoplay step waits FIRST_STEP_MS (6s) after it comes into view.
 *   - Reduced motion: no entrance and no autoplay; moves are instant.
 *   - Assistive technology: a carousel region; each item is a slide labelled "n of N" holding the item's
 *     content (`renderSlide`, visually hidden), the bent picture hidden from it, as are the repeat copies
 *     that fill out the ring; moves made by hand are announced politely ("3 of 6: title").
 *
 * The ring is drawn with CSS 3D: a camera, the ring inside it and the cards on the ring, each card cut
 * into vertical strips turned to follow the curve, with a plain back face behind each strip. One rAF loop
 * turns the ring (a critically damped spring toward the card it is heading for), leans the camera, runs
 * the autoplay clock and sets each card's depth fade. It runs only while something moves or the clock
 * counts, and stops itself when everything is still.
 */

/** Strips per card: enough that the bend reads as a curve. */
const STRIPS = 8;
/** The ring holds at least this many cards; fewer items are repeated round it. */
const MIN_CARDS = 10;
/** Camera tilt, degrees: negative looks down onto the ring. */
const TILT = -6;
const PERSPECTIVE = 2400;
/** How far the camera leans toward the pointer, degrees. */
const LEAN = 3.5;
/** Spring stiffness (rad/s) of a move made by hand, of the autoplay and of the entrance. */
const SNAP_HAND = 9;
const SNAP_AUTO = 6.5;
const SNAP_INTRO = 9.5;
/** How far round the ring starts on its entrance, in cards. */
const INTRO_TURN = 1.5;
/** The first autoplay step waits at least this long after the ring comes into view, ms. */
const FIRST_STEP_MS = 6000;
/** The caption's cross-fade, ms. */
const CAPTION_MS = 250;
/** The leaving caption's fade, ms: the new one waits for it, so the two never show at once. */
const CAPTION_OUT_MS = 140;
/** How far a throw carries, seconds of its release speed. */
const MOMENTUM = 0.28;
/** The fastest a throw turns the ring, cards per second. */
const MAX_SPEED = 10;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type CircularCarouselProps<T> = {
  items: readonly T[];
  /** The carousel's accessible name, e.g. "Our educators". */
  label: string;
  /** What one item is called, in lower case: "educator" reads "Previous educator", "Educator 3 of 6". */
  itemName: string;
  /** The item's title, for the announcement of a move. */
  slideTitle: (item: T) => string;
  /** The picture on the item's card. */
  image: (item: T) => string;
  /** Where the card leads; null for a still card. */
  href?: (item: T) => string | null;
  /** The slide's content for assistive technology (visually hidden): the card itself is only a picture. */
  renderSlide: (item: T) => ReactNode;
  /** Shown under the ring for the item at the front, cross-fading as it changes. Visual only. */
  renderCaption?: (item: T, index: number) => ReactNode;
  /** A card, canvas px. */
  width: number;
  height: number;
  /** Space between neighbouring cards round the ring, px. */
  gap?: number;
  /** Autoplay step, ms; 0 for none. */
  interval?: number;
  /** The colour far cards fade into: the section's paper. */
  fadeColor: string;
  /** The colour of a card's back. */
  backColor: string;
  /** "dark" on a dark band (cream controls), "light" on paper. */
  tone?: "light" | "dark";
  /** Space between the ring and what follows it (dots, caption), canvas px. */
  spacing?: number;
  /** How far from the stage's centre the arrows' centres sit, canvas px: just clear of the ring's
   *  visible ends. Without it they stand at the stage's edges. */
  arrowReach?: number;
  className?: string;
};

type Sim = {
  /** Where the ring stands, in cards: card `s` is at the front when pos = s. */
  pos: number;
  /** Its speed, cards per second. */
  vel: number;
  /** The card it is heading for (a whole number unless held by a drag). */
  target: number;
  stiffness: number;
  /** A drag or a trackpad swipe has hold of it: pos follows the hand. */
  held: boolean;
  lean: { x: number; y: number; aimX: number; aimY: number };
  /** Autoplay time counted toward the next step, ms. */
  clock: number;
};

export default function CircularCarousel<T>({
  items,
  label,
  itemName,
  slideTitle,
  image,
  href,
  renderSlide,
  renderCaption,
  width,
  height,
  gap = 32,
  interval = 0,
  fadeColor,
  backColor,
  tone = "light",
  spacing = 32,
  arrowReach,
  className,
}: CircularCarouselProps<T>) {
  const count = items.length;
  // Repeat the items until the ring is full enough to read as a ring.
  const slots = count ? count * Math.max(1, Math.ceil(MIN_CARDS / count)) : 0;
  const step = slots ? 360 / slots : 0;
  /** Distance along the ring from one card to the next: also how far a drag goes per card. */
  const pitch = width + gap;
  const radius = slots ? (slots * pitch) / (2 * Math.PI) : 0;
  /** The camera's tilt lowers the front of the ring; lift it back so the ring sits in the stage's middle. */
  const lift = -radius * Math.sin((-TILT * Math.PI) / 180) * 0.55;
  const stageHeight = Math.round(height + radius * Math.sin((-TILT * Math.PI) / 180) * 0.9 + 24);

  const [front, setFront] = useState(0);
  const [still, setStill] = useState(false);
  const [shown, setShown] = useState(true);
  const [playing, setPlaying] = useState(interval > 0);
  const [grabbing, setGrabbing] = useState(false);
  const active = count ? mod(front, count) : 0;

  const regionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const sim = useRef<Sim>({ pos: 0, vel: 0, target: 0, stiffness: SNAP_HAND, held: false, lean: { x: 0, y: 0, aimX: 0, aimY: 0 }, clock: 0 });
  /** What the loop needs from React's state, kept current. */
  const flags = useRef({ playing: interval > 0, onScreen: false, still: false, entered: true, hover: false, focus: false });
  const frontRef = useRef(0);
  const depths = useRef<string[]>([]);
  const frame = useRef(0);
  const kickRef = useRef<() => void>(() => {});

  // Each strip's place on its card's bend, measured from the card's centre: the same for every card.
  const strips = useMemo(() => {
    if (!radius) return [];
    const wide = width / STRIPS;
    return Array.from({ length: STRIPS }, (_, j) => {
      const angle = (-width / 2 + (j + 0.5) * wide) / radius;
      // A little wider than its share on each inner side, so neighbouring strips overlap and no seam shows.
      const before = j === 0 ? 0 : 1.5;
      const after = j === STRIPS - 1 ? 0 : 1.5;
      return {
        width: wide + before + after,
        /** From the share's centre to the strip's left edge. */
        left: -wide / 2 - before,
        /** Where the strip starts across the picture. */
        offset: j * wide - before,
        transform: `translate3d(${(radius * Math.sin(angle)).toFixed(3)}px, 0, ${(radius * Math.cos(angle) - radius).toFixed(3)}px) rotateY(${((angle * 180) / Math.PI).toFixed(3)}deg)`,
      };
    });
  }, [radius, width]);

  // The one loop: the ring's spring, the camera's lean, the autoplay clock and the depth fades.
  useEffect(() => {
    const s = sim.current;
    const f = flags.current;
    let last = 0;

    let ringLast = "";
    let cameraLast = "";
    const draw = () => {
      const ring = `rotateY(${(-s.pos * step).toFixed(3)}deg)`;
      if (ringRef.current && ring !== ringLast) ringRef.current.style.transform = ringLast = ring;
      const camera = `translate3d(0, ${lift.toFixed(1)}px, ${(-radius).toFixed(1)}px) rotateX(${(TILT - s.lean.y * LEAN * 0.5).toFixed(3)}deg) rotateY(${(s.lean.x * LEAN).toFixed(3)}deg)`;
      if (cameraRef.current && camera !== cameraLast) cameraRef.current.style.transform = cameraLast = camera;
      for (let i = 0; i < slots; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const turn = ((mod(i - s.pos + slots / 2, slots) - slots / 2) * step * Math.PI) / 180;
        // 0 at the front, 0.5 edge on, 1 at the back.
        const depth = ((1 - Math.cos(turn)) / 2).toFixed(3);
        if (depths.current[i] === depth) continue;
        depths.current[i] = depth;
        el.style.setProperty("--cc-depth", depth);
      }
      const nearest = mod(Math.round(s.pos), slots);
      if (nearest !== frontRef.current) {
        frontRef.current = nearest;
        // A card that turns away from under a still pointer never gets its pointerleave.
        f.hover = false;
        setFront(nearest);
      }
    };

    const tick = (time: number) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 1 / 60;
      last = time;
      let busy = false;

      if (!s.held) {
        if (f.still) {
          s.pos = s.target;
          s.vel = 0;
        } else {
          // Semi-implicit Euler on a critically damped spring; dt is capped, so it stays stable.
          const k = s.stiffness;
          s.vel += (k * k * (s.target - s.pos) - 2 * k * s.vel) * dt;
          s.pos += s.vel * dt;
          // Within a tenth of a degree and all but still: done.
          if (Math.abs(s.target - s.pos) < 0.003 && Math.abs(s.vel) < 0.02) {
            s.pos = s.target;
            s.vel = 0;
          } else busy = true;
        }
      } else busy = true;

      const lean = s.lean;
      const ease = 1 - Math.exp(-dt * 5);
      lean.x += (lean.aimX - lean.x) * ease;
      lean.y += (lean.aimY - lean.y) * ease;
      if (Math.abs(lean.aimX - lean.x) > 1e-3 || Math.abs(lean.aimY - lean.y) > 1e-3) busy = true;

      const counting = interval > 0 && f.playing && !f.still && f.entered && f.onScreen && slots > 1;
      if (counting) {
        busy = true;
        if (!f.hover && !f.focus && !s.held && !document.hidden) s.clock += dt * 1000;
        if (s.clock >= interval) {
          s.clock = 0;
          s.target = Math.round(s.target) + 1;
          s.stiffness = SNAP_AUTO;
        }
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${counting ? Math.max(0, Math.min(1, s.clock / interval)).toFixed(4) : 0})`;

      draw();
      frame.current = busy ? requestAnimationFrame(tick) : 0;
      if (!busy) last = 0;
    };

    kickRef.current = () => {
      if (!frame.current) frame.current = requestAnimationFrame(tick);
    };
    draw();
    kickRef.current();
    return () => {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [slots, step, radius, lift, interval]);

  const kick = () => kickRef.current();

  // Motion preference, the entrance and whether it is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const f = flags.current;
    const s = sim.current;
    const reduced = prefersReducedMotion();
    setStill(reduced);
    f.still = reduced;
    if (reduced) {
      setPlaying(false);
      f.playing = false;
    }
    let cancel = () => {};
    const alreadyThere = canvasTop(stage) < (window.innerHeight / getCanvasZoom()) * 0.85;
    if (!reduced && !alreadyThere) {
      // Hide the ring a few cards round, then turn it in as it comes into view.
      f.entered = false;
      setShown(false);
      s.pos = s.target = -INTRO_TURN;
      s.vel = 0;
      kick();
      cancel = whenVisible(stage, 0.35, () => {
        f.entered = true;
        setShown(true);
        s.target = 0;
        s.stiffness = SNAP_INTRO;
        kick();
      });
    }
    let seen = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        f.onScreen = entry.isIntersecting;
        // The first time it comes into view, give the first educator time to be read before the first step.
        if (entry.isIntersecting && !seen) {
          seen = true;
          s.clock = Math.min(0, interval - FIRST_STEP_MS);
        }
        kick();
      },
      { threshold: 0.25 },
    );
    io.observe(stage);
    return () => {
      cancel();
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    flags.current.playing = playing;
    if (!playing) sim.current.clock = 0;
    kick();
  }, [playing]);

  const announce = () => {
    if (!liveRef.current || !count) return;
    const index = mod(Math.round(sim.current.target), count);
    liveRef.current.textContent = `${index + 1} of ${count}: ${slideTitle(items[index])}`;
  };

  /** Turns the ring `by` cards from where it is heading. */
  const move = (by: number, byHand: boolean) => {
    if (!slots || by === 0) return;
    const s = sim.current;
    s.clock = 0;
    s.held = false;
    s.target = Math.round(s.target) + by;
    s.stiffness = SNAP_HAND;
    kick();
    if (byHand) announce();
  };

  /** The shortest way round from the card it is heading for to slot `slot`. */
  const offsetTo = (slot: number) => mod(slot - Math.round(sim.current.target) + Math.floor(slots / 2), slots) - Math.floor(slots / 2);

  const goTo = (index: number) => move(mod(index - mod(Math.round(sim.current.target), count) + Math.floor(count / 2), count) - Math.floor(count / 2), true);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1, true);
  };

  // Drag: a mostly sideways drag takes hold of the ring; a mostly vertical one is the page's scroll.
  const drag = useRef<{ id: number; x: number; y: number; pos: number; moved: boolean; trail: { t: number; pos: number }[] } | null>(null);
  const swallowClick = useRef(false);

  const release = () => {
    const d = drag.current;
    drag.current = null;
    setGrabbing(false);
    if (!d?.moved) return;
    const s = sim.current;
    const trail = d.trail;
    const first = trail[0];
    const lastPoint = trail[trail.length - 1];
    const span = (lastPoint.t - first.t) / 1000;
    // Cards per second over the last moments of the drag, kept within reason (a jerk of the hand, or a
    // drag replayed in a burst, would otherwise send it spinning).
    const speed = span > 0.02 ? Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (lastPoint.pos - first.pos) / span)) : 0;
    s.held = false;
    s.vel = flags.current.still ? 0 : speed;
    const carry = speed * MOMENTUM;
    s.target = Math.round(s.pos + carry);
    s.stiffness = SNAP_HAND;
    s.clock = 0;
    swallowClick.current = true;
    kick();
    announce();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, pos: sim.current.pos, moved: false, trail: [] };
    swallowClick.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    const d = drag.current;
    // The ring does not follow the pointer (the client asked for no pointer tracking); only a drag moves it.
    if (!d || d.id !== event.pointerId) return;
    const zoom = getCanvasZoom();
    const dx = (event.clientX - d.x) / zoom;
    const dy = (event.clientY - d.y) / zoom;
    const s = sim.current;
    if (!d.moved) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        // It takes hold from where the drag began, so the threshold's few px are not lost.
        d.moved = true;
        d.pos = s.pos;
        s.held = true;
        s.vel = 0;
        stage?.setPointerCapture(event.pointerId);
        setGrabbing(true);
        kick();
      } else {
        if (Math.abs(dy) > 10) drag.current = null;
        return;
      }
    }
    s.pos = d.pos - dx / pitch;
    s.target = s.pos;
    const now = performance.now();
    d.trail.push({ t: now, pos: s.pos });
    while (d.trail.length > 2 && now - d.trail[0].t > 90) d.trail.shift();
  };

  // A sideways trackpad swipe turns the ring like a drag (Lenis is told to leave it alone).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let timer = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      (event as WheelEvent & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
      event.preventDefault();
      const s = sim.current;
      const scale = event.deltaMode === 1 ? 16 : 1;
      s.held = true;
      s.vel = 0;
      s.pos += (event.deltaX * scale) / pitch;
      s.target = s.pos;
      s.clock = 0;
      kickRef.current();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        s.held = false;
        s.target = Math.round(s.pos);
        s.stiffness = SNAP_HAND;
        kickRef.current();
        announce();
      }, 140);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(timer);
    };
    // `announce` is the first render's; the items never change.
  }, [pitch]);

  const name = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  const radiusPx = 18;

  if (!count) return null;

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        // Keyboard focus holds the autoplay; a click on a control does not.
        if ((event.target as Element).matches(":focus-visible")) flags.current.focus = true;
      }}
      onBlur={(event) => {
        if (!regionRef.current?.contains(event.relatedTarget as Node | null)) flags.current.focus = false;
      }}
      onPointerLeave={() => {
        const lean = sim.current.lean;
        lean.aimX = lean.aimY = 0;
        kick();
      }}
      className={cx("relative flex w-full flex-col items-center rounded-[28px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burnt", className)}
    >
      {/* The stage: the ring is centred in it and drawn by transforms alone. */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onClickCapture={(event) => {
          if (swallowClick.current) {
            swallowClick.current = false;
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          // A click on a card away from the front turns it to the front.
          const el = (event.target as Element | null)?.closest<HTMLElement>("[data-slot]");
          if (!el) return;
          const by = offsetTo(Number(el.dataset.slot));
          if (by === 0) return;
          event.preventDefault();
          move(by, true);
        }}
        className={cx("relative w-full touch-pan-y select-none", grabbing ? "cursor-grabbing" : "cursor-grab")}
        style={{ height: stageHeight }}
      >
        {/* A soft shadow on the floor under the front of the ring. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 h-12 w-[760px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(77_31_8/0.16),rgb(77_31_8/0))]"
          style={{ top: stageHeight / 2 + height / 2 - 18 }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            perspective: PERSPECTIVE,
            opacity: shown ? 1 : 0,
            transition: still ? "none" : `opacity 450ms ${EASE}`,
          }}
        >
          <div ref={cameraRef} className="relative size-0 [transform-style:preserve-3d]">
            <div ref={ringRef} className="absolute top-0 left-0 size-0 [transform-style:preserve-3d]">
              {Array.from({ length: slots }, (_, slot) => {
                const index = slot % count;
                const item = items[index];
                const copy = slot >= count;
                const isFront = slot === front;
                const link = href?.(item) ?? null;
                const src = image(item);
                const faces = strips.map((strip, j) => {
                  const edge = j === 0 ? "left" : j === STRIPS - 1 ? "right" : null;
                  const round = (side: "left" | "right" | null) =>
                    side === "left" ? `${radiusPx}px 0 0 ${radiusPx}px` : side === "right" ? `0 ${radiusPx}px ${radiusPx}px 0` : "0";
                  const box: CSSProperties = { left: strip.left, top: -height / 2, width: strip.width, height };
                  return (
                    <Fragment key={j}>
                      {/* The front of the strip: its slice of the picture, black and white off the front. */}
                      <span aria-hidden="true" className="absolute outline outline-1 outline-transparent [backface-visibility:hidden]" style={{ ...box, transform: strip.transform }}>
                        <span
                          className={cx(
                            "absolute inset-0 overflow-hidden bg-no-repeat [transition:filter_600ms_var(--ease-out)]",
                            isFront ? "grayscale-0" : "grayscale group-hover/cc:grayscale-0",
                          )}
                          style={{
                            borderRadius: round(edge),
                            backgroundImage: `url("${src}")`,
                            backgroundSize: `${width}px ${height}px`,
                            backgroundPosition: `${-strip.offset}px 0`,
                            backgroundColor: backColor,
                          }}
                        >
                          <span className="absolute inset-0" style={{ background: fadeColor, opacity: "calc(var(--cc-depth, 0) * 0.9)" }} />
                        </span>
                      </span>
                      {/* Its back, seen from inside the ring. */}
                      <span
                        aria-hidden="true"
                        className="absolute outline outline-1 outline-transparent [backface-visibility:hidden]"
                        style={{ ...box, transform: `${strip.transform} rotateY(180deg)` }}
                      >
                        <span className="absolute inset-0 overflow-hidden" style={{ borderRadius: round(edge === "left" ? "right" : edge === "right" ? "left" : null), background: backColor }}>
                          <span className="absolute inset-0" style={{ background: fadeColor, opacity: "calc(var(--cc-depth, 0) * 0.62)" }} />
                        </span>
                      </span>
                    </Fragment>
                  );
                });
                const cardStyle: CSSProperties = { transform: `rotateY(${(slot * step).toFixed(3)}deg) translateZ(${radius.toFixed(2)}px)` };
                const cardClass = "group/cc absolute top-0 left-0 size-0 [transform-style:preserve-3d]";
                return (
                  <div
                    key={slot}
                    ref={(el) => {
                      cardRefs.current[slot] = el;
                    }}
                    data-slot={slot}
                    {...(copy ? { "aria-hidden": true } : { role: "group", "aria-roledescription": "slide", "aria-label": `${index + 1} of ${count}` })}
                    onFocus={() => {
                      // Focus on a card away from the front (a profile link) turns it to the front.
                      const by = offsetTo(slot);
                      if (by !== 0) move(by, true);
                    }}
                    // Only the pointer on the front card holds the autoplay, not the pointer anywhere on the ring.
                    onPointerEnter={isFront ? (event) => event.pointerType === "mouse" && (flags.current.hover = true) : undefined}
                    onPointerLeave={isFront ? () => (flags.current.hover = false) : undefined}
                    className={cardClass}
                    style={cardStyle}
                  >
                    {link !== null ? (
                      <a href={link} draggable={false} tabIndex={copy ? -1 : undefined} className="absolute top-0 left-0 size-0 [transform-style:preserve-3d]">
                        {faces}
                        <div className="sr-only">{renderSlide(item)}</div>
                      </a>
                    ) : (
                      <>
                        {faces}
                        {!copy && <div className="sr-only">{renderSlide(item)}</div>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* The arrows level with the front card: just beside the ring's ends, or at the stage's edges. */}
        {([-1, 1] as const).map((side) => (
          <div
            key={side}
            className={cx("absolute top-1/2 z-10 -translate-y-1/2", arrowReach ? "-translate-x-1/2" : side < 0 ? "left-10" : "right-10")}
            style={arrowReach ? { left: `calc(50% + ${side * arrowReach}px)` } : undefined}
          >
            <CarouselArrow
              direction={side < 0 ? "prev" : "next"}
              label={`${side < 0 ? "Previous" : "Next"} ${itemName}`}
              tone={tone}
              size={48}
              onClick={() => move(side, true)}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center" style={{ marginTop: spacing }}>
        <CarouselDots
          count={count}
          active={active}
          onSelect={goTo}
          label={`Choose ${itemName}`}
          itemName={name}
          tone={tone}
          fillRef={interval && playing && !still ? fillRef : undefined}
        />
      </div>

      {renderCaption && (
        <div aria-hidden="true" className="grid w-full justify-items-center" style={{ marginTop: spacing }}>
          {items.map((item, i) => {
            const on = i === active && shown;
            return (
              <div
                key={i}
                className="col-start-1 row-start-1 w-full"
                // In sequence, never overlapping: the old caption fades out (CAPTION_OUT_MS) and only then
                // does the new one fade in, drifting up just 3px, so the text never seems to jump.
                style={{
                  opacity: on ? 1 : 0,
                  translate: on ? "0 0" : "0 3px",
                  visibility: on ? "visible" : "hidden",
                  transition: still
                    ? "none"
                    : on
                      ? `opacity ${CAPTION_MS}ms ${EASE} ${CAPTION_OUT_MS}ms, translate ${CAPTION_MS}ms ${EASE} ${CAPTION_OUT_MS}ms, visibility 0s linear 0s`
                      : `opacity ${CAPTION_OUT_MS}ms linear, translate 0s linear ${CAPTION_OUT_MS}ms, visibility 0s linear ${CAPTION_OUT_MS}ms`,
                }}
              >
                {renderCaption(item, i)}
              </div>
            );
          })}
        </div>
      )}

      <p ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
}
