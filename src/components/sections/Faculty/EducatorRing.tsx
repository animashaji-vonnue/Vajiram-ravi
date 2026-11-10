"use client";

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { CarouselArrow } from "@/components/ui/CarouselControls";
import CursorLabel from "@/components/ui/CursorLabel";
import Photo from "@/components/ui/Photo";
import type { Educator } from "@/data/faculty";
import { canvasTop, getCanvasZoom } from "@/lib/canvas";
import { cx } from "@/lib/cx";
import { mod, prefersReducedMotion } from "@/lib/motion";
import { whenVisible } from "@/lib/reveal";

/*
 * The educators' ring (after React Bits' "Circular Gallery"). The portrait cards stand on the rim of a
 * large wheel seen from the front: the centre card is upright, in full colour and in front; the cards
 * towards the edges follow the rim down, turn with it (about 5.5° one card out, 17° at the canvas edges,
 * so the names stay easy to read), shrink a little and fade out before the band's edges. Moving the
 * carousel rolls every card round the rim, and the ring never ends: the six educators are laid round it
 * twice, so the point where it wraps is always out of sight.
 *
 *   - The round arrows and the ← → keys roll it one card; clicking a card off centre rolls that one to
 *     the centre (a card with a profile page opens it once it is centred).
 *   - Dragging with the mouse or swiping follows the pointer; letting go keeps the throw's momentum and
 *     comes to rest on a card. A sideways trackpad swipe rolls it too and settles on a card when it
 *     stops. Vertical scrolling is never taken: a mostly vertical drag or wheel is the page's.
 *   - Off-centre cards are black and white and colour on hover; the centred card is in colour. Under
 *     the ring, the educator it rests on is introduced (introduction, qualifications, experience),
 *     cross-fading to the next as soon as a move sets off for it.
 *   - It enters once, when it comes into view: the ring rolls in from the right, five cards' worth,
 *     fast at first and slowing to rest on the first educator (~1.5s), as it fades and rises into place.
 *   - Every move is a critically damped spring run by one frame loop that writes transforms, opacity and
 *     z-index straight to the cards and stops when the ring is still; nothing re-renders React. The
 *     cards are promoted (will-change) only while it moves, so the text is re-rastered crisp at rest.
 *   - Reduced motion: a flat row (no bend, turn or shrink), moves are instant and there is no entrance.
 *   - Assistive technology: a carousel region with labelled arrows; the six slides read "n of 6"; the
 *     repeat copies are hidden and inert; moves by hand are announced politely ("3 of 6: Md. Rizwan,
 *     Geography optional").
 */

/** One card (200) and the gap after it (20): a step along the rim, in canvas px of arc. */
const STEP = 220;
/** The six educators go round the ring this many times. */
const COPIES = 2;
/** The wheel's radius, in canvas px: its centre is this far below the centre card's centre. */
const RADIUS = 2300;
/** Cards are fully opaque up to this far from the centre (screen px), and gone by FADE_END. */
const FADE_START = 500;
const FADE_END = 800;
/** Off-centre cards shrink towards 1 − SHRINK: to 95% one card out, 92% two out. */
const SHRINK = 0.1;
/** Spring rates, 1/s: the arrows, keys and clicks (~0.45s), a drag's release, and the entrance. */
const OMEGA_STEP = 11;
const OMEGA_RELEASE = 5;
const OMEGA_REVEAL = 3.2;
/** The entrance rolls the ring in from this many cards to the right. */
const REVEAL_CARDS = 5;
/** Pointer travel, in canvas px, before a press becomes a drag. */
const DRAG_THRESHOLD = 6;
/** A drag at least this long moves at least one card, however gently it ends. */
const FLICK = 40;
/** The fastest throw counted, canvas px per second. */
const MAX_SPEED = 6000;
/** A pointer held still this long before letting go throws nothing. */
const HOLD_MS = 80;
/** A sideways wheel settles on a card this long after its last event. */
const WHEEL_SETTLE_MS = 140;
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** Where slot `slot` is along the rim, relative to the centre, with the ring rolled to `pos`: in [−loop/2, loop/2). */
const arcOf = (slot: number, pos: number, loop: number) => mod(slot * STEP - pos + loop / 2, loop) - loop / 2;

/** A card's place on the ring, `arc` canvas px of rim from the centre. Flat: the reduced-motion row. */
function pose(arc: number, flat: boolean) {
  const away = Math.abs(arc) / STEP;
  const theta = flat ? 0 : arc / RADIUS;
  const x = flat ? arc : RADIUS * Math.sin(theta);
  const y = flat ? 0 : RADIUS * (1 - Math.cos(theta));
  const scale = flat ? 1 : 1 - (SHRINK * away * away) / (1 + away * away);
  return {
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${((theta * 180) / Math.PI).toFixed(3)}deg) scale(${scale.toFixed(4)})`,
    opacity: round3(clamp((FADE_END - Math.abs(x)) / (FADE_END - FADE_START), 0, 1)),
    // In front at the centre, further back the further round.
    z: 100 - Math.round(away * 10),
  };
}

type Controls = { by: (cards: number) => void };

type EducatorRingProps = {
  educators: Educator[];
  /** The eyebrow, heading and lead, on the left of the heading row. */
  heading: ReactNode;
  /** The note card, at the top right of the heading row, over the arrows. */
  note: ReactNode;
};

export default function EducatorRing({ educators, heading, note }: EducatorRingProps) {
  const count = educators.length;
  const slots = count * COPIES;
  const loop = slots * STEP;
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const detailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const controls = useRef<Controls | null>(null);
  const hasDetails = educators.some((e) => e.qualifications || e.experience || e.introduction);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !count) return;
    const cards = cardRefs.current;
    const flat = prefersReducedMotion();
    // The ring's state, in canvas px of rim: where it is, how fast it moves, where it is going.
    const ring = { pos: 0, vel: 0, target: 0, omega: OMEGA_STEP, springing: false, dragging: false, wheeling: false, frame: 0, last: 0 };
    // The server drew the first educator in the centre.
    let centre = 0;
    const zIndexes: number[] = [];

    // The details under the ring follow where it is going, not each card it passes on the way.
    const showDetails = () => {
      const index = mod(Math.round(ring.target / STEP), count);
      detailRefs.current.forEach((el, i) => el?.toggleAttribute("data-shown", i === index));
    };

    const render = () => {
      for (let slot = 0; slot < slots; slot++) {
        const card = cards[slot];
        if (!card) continue;
        const { transform, opacity, z } = pose(arcOf(slot, ring.pos, loop), flat);
        card.style.transform = transform;
        card.style.opacity = String(opacity);
        card.style.visibility = opacity === 0 ? "hidden" : "";
        if (zIndexes[slot] !== z) card.style.zIndex = String((zIndexes[slot] = z));
      }
      const now = mod(Math.round(ring.pos / STEP), slots);
      if (now !== centre) {
        cards[centre]?.removeAttribute("data-centre");
        cards[now]?.setAttribute("data-centre", "");
        centre = now;
      }
    };

    // The frame loop: runs while the ring springs, is dragged or is wheeled, then stops.
    const tick = (time: number) => {
      ring.frame = 0;
      const dt = ring.last ? Math.min(0.064, (time - ring.last) / 1000) : 1 / 60;
      ring.last = time;
      if (ring.springing) {
        // A critically damped spring, stepped exactly: x(t) = (x0 + (v0 + ωx0)t)·e^(−ωt).
        const x = ring.pos - ring.target;
        const w = ring.omega;
        const decay = Math.exp(-w * dt);
        const b = ring.vel + w * x;
        const next = (x + b * dt) * decay;
        ring.vel = (ring.vel - b * w * dt) * decay;
        ring.pos = ring.target + next;
        if (Math.abs(next) < 0.05 && Math.abs(ring.vel) < 2) {
          ring.pos = ring.target;
          ring.vel = 0;
          ring.springing = false;
        }
      }
      render();
      if (ring.springing || ring.dragging || ring.wheeling) {
        ring.frame = requestAnimationFrame(tick);
        return;
      }
      ring.last = 0;
      stage.removeAttribute("data-moving");
    };
    const run = () => {
      if (ring.frame) return;
      stage.setAttribute("data-moving", "");
      ring.frame = requestAnimationFrame(tick);
    };

    const springTo = (target: number, omega: number) => {
      ring.target = target;
      ring.omega = omega;
      showDetails();
      if (flat) {
        ring.pos = target;
        ring.vel = 0;
        render();
        return;
      }
      ring.springing = true;
      run();
    };
    const snapped = (pos: number) => Math.round(pos / STEP) * STEP;

    // Moves by hand are announced; the entrance is not. A move made before the entrance (an arrow
    // pressed while the ring is still out of sight) brings the ring in at once.
    const announce = () => {
      reveal();
      const index = mod(Math.round(ring.target / STEP), count);
      const educator = educators[index];
      if (liveRef.current) liveRef.current.textContent = `${index + 1} of ${count}: ${educator.name}, ${educator.focus}`;
    };
    const by = (step: number) => {
      springTo(snapped(ring.target) + step * STEP, OMEGA_STEP);
      announce();
    };
    // The shortest way round to put a slot in the centre.
    const toSlot = (slot: number) => {
      springTo(snapped(ring.target) + arcOf(slot, snapped(ring.target), loop), OMEGA_STEP);
      announce();
    };
    controls.current = { by };

    // Drag and swipe.
    type Drag = { id: number; x: number; y: number; from: number; start: number; caught: boolean; active: boolean; samples: Array<[number, number]> };
    let drag: Drag | null = null;
    let swallowClick = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      swallowClick = false;
      // Pressing a moving ring catches it.
      const caught = ring.springing;
      ring.springing = false;
      ring.vel = 0;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY, from: ring.pos, start: ring.pos, caught, active: false, samples: [] };
    };
    const onPointerMove = (event: PointerEvent) => {
      const current = drag;
      if (!current || current.id !== event.pointerId) return;
      if (event.pointerType === "mouse" && event.buttons === 0) return endDrag(event, true);
      // Pointer deltas are in screen px; the canvas may be zoomed down.
      const zoom = getCanvasZoom();
      const dx = (event.clientX - current.x) / zoom;
      if (!current.active) {
        const dy = (event.clientY - current.y) / zoom;
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        // Mostly vertical: the page's scroll, not a swipe.
        if (Math.abs(dy) > Math.abs(dx)) return endDrag(event, true);
        current.active = true;
        // From here the ring follows the pointer, without jumping the threshold.
        current.start = ring.pos;
        current.from = ring.pos + dx;
        stage.setPointerCapture(event.pointerId);
        ring.dragging = true;
        run();
      }
      ring.pos = current.from - dx;
      const now = performance.now();
      current.samples.push([now, ring.pos]);
      while (current.samples.length > 2 && now - current.samples[0][0] > 100) current.samples.shift();
    };
    const endDrag = (event: PointerEvent, cancelled: boolean) => {
      const current = drag;
      if (!current || current.id !== event.pointerId) return;
      drag = null;
      if (!current.active) {
        // A press that never became a drag lets a caught ring finish its move (a click may then redirect it).
        if (current.caught) springTo(snapped(ring.target), OMEGA_STEP);
        return;
      }
      ring.dragging = false;
      swallowClick = true;
      const first = current.samples[0];
      const last = current.samples[current.samples.length - 1];
      let speed = 0;
      if (!cancelled && first && last && last[0] - first[0] > 10 && performance.now() - last[0] < HOLD_MS) {
        speed = clamp(((last[1] - first[1]) / (last[0] - first[0])) * 1000, -MAX_SPEED, MAX_SPEED);
      }
      // Where the throw would coast to, on a card; a deliberate drag moves at least one.
      const travelled = ring.pos - current.start;
      let target = snapped(ring.pos + speed / OMEGA_RELEASE);
      if (!cancelled && target === snapped(current.start) && Math.abs(travelled) > FLICK) target += Math.sign(travelled) * STEP;
      ring.vel = speed;
      springTo(target, OMEGA_RELEASE);
      announce();
    };
    const onPointerUp = (event: PointerEvent) => endDrag(event, false);
    const onPointerCancel = (event: PointerEvent) => endDrag(event, true);

    // A click ending a drag does nothing; a click on a card off centre rolls it to the centre (keyboard "clicks", detail 0, pass).
    const onClick = (event: MouseEvent) => {
      if (swallowClick && event.detail !== 0) {
        swallowClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-slot]");
      if (!card) return;
      const slot = Number(card.dataset.slot);
      if (slot === mod(Math.round(ring.target / STEP), slots)) return;
      event.preventDefault();
      toSlot(slot);
    };
    // A card that takes keyboard focus (one with a profile link) rolls to the centre.
    const onFocusIn = (event: FocusEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-slot]");
      if (card && (event.target as Element).matches(":focus-visible")) toSlot(Number(card.dataset.slot));
    };

    // A sideways trackpad swipe (or shift + wheel) rolls the ring; vertical wheels are left to the page.
    let wheelTimer = 0;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientWidth : 1;
      ring.springing = false;
      ring.vel = 0;
      ring.wheeling = true;
      ring.pos += (event.deltaX * unit) / getCanvasZoom();
      ring.target = ring.pos;
      run();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        ring.wheeling = false;
        springTo(snapped(ring.pos), OMEGA_STEP);
        announce();
      }, WHEEL_SETTLE_MS);
    };
    const onDragStart = (event: DragEvent) => event.preventDefault();

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerCancel);
    stage.addEventListener("click", onClick, true);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("dragstart", onDragStart);

    // The entrance: unless it is already on screen (or motion is reduced), the ring waits out of sight,
    // rolled five cards to the right, then rolls in as it fades and rises into place.
    let revealed = true;
    let cancelReveal = () => {};
    let rise: Animation | null = null;
    function reveal() {
      if (revealed) return;
      revealed = true;
      cancelReveal();
      rise?.play();
    }
    const onScreen = canvasTop(stage) < (window.innerHeight / getCanvasZoom()) * 0.9;
    if (flat || onScreen) {
      render();
    } else {
      ring.pos = -REVEAL_CARDS * STEP;
      render();
      const lift = getComputedStyle(document.documentElement).getPropertyValue("--rise").trim() || "24px";
      rise = stage.animate([{ opacity: 0, transform: `translateY(${lift})` }, { opacity: 1, transform: "none" }], {
        duration: 700,
        easing: EASE_OUT,
      });
      rise.pause();
      revealed = false;
      cancelReveal = whenVisible(stage, 0.35, () => {
        // It starts at full speed and slows to rest: x(t) = x0·e^(−ωt).
        ring.vel = REVEAL_CARDS * STEP * OMEGA_REVEAL;
        springTo(0, OMEGA_REVEAL);
        reveal();
      });
    }

    return () => {
      cancelReveal();
      rise?.cancel();
      cancelAnimationFrame(ring.frame);
      window.clearTimeout(wheelTimer);
      controls.current = null;
      stage.removeAttribute("data-moving");
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerCancel);
      stage.removeEventListener("click", onClick, true);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("dragstart", onDragStart);
    };
  }, [educators, count, slots, loop]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    controls.current?.by(event.key === "ArrowRight" ? 1 : -1);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Our educators" onKeyDown={onKeyDown} className="flex w-full flex-col">
      <div className="mx-auto flex w-canvas items-stretch justify-between gap-10 px-20">
        {heading}
        {/* The note card at the top, the arrows at the foot, just over the ring they turn. */}
        <div className="flex w-[520px] shrink-0 flex-col items-end justify-between gap-[18px]">
          {note}
          <div data-reveal="fade" className="flex items-center gap-2.5">
            <CarouselArrow direction="prev" label="Previous educator" onClick={() => controls.current?.by(-1)} />
            <CarouselArrow direction="next" label="Next educator" tone="solid" onClick={() => controls.current?.by(1)} />
          </div>
        </div>
      </div>

      <CursorLabel regionRef={stageRef} fallback="Drag" />

      {/*
        The ring: the cards are stacked on the canvas centre line and placed round the rim by transform
        alone (the server draws them at rest, so the first paint is already the ring). Not clipped: the
        cards fade out before the canvas edges and the band clips the rest.
      */}
      <div
        ref={stageRef}
        className={cx(
          "group/ring relative mx-auto mt-9 w-canvas cursor-grab touch-pan-y select-none active:cursor-grabbing",
          // With details under it, the stage ends just under the centre card and the lines sit between the
          // lowered cards; without, it holds the ring down to the faded edge cards.
          hasDetails ? "h-[340px]" : "h-[420px]",
        )}
      >
        {Array.from({ length: slots }, (_, slot) => {
          const educator = educators[slot % count];
          const rest = pose(arcOf(slot, 0, loop), false);
          const slide =
            slot < count
              ? { role: "group", "aria-roledescription": "slide", "aria-label": `${slot + 1} of ${count}` }
              : { "aria-hidden": true, inert: true };
          return (
            // The slot's className stays static: the frame loop writes its style and data-centre.
            <div
              key={slot}
              ref={(el) => {
                cardRefs.current[slot] = el;
              }}
              data-slot={slot}
              data-centre={slot === 0 ? "" : undefined}
              {...slide}
              style={{ transform: rest.transform, opacity: rest.opacity, zIndex: rest.z, visibility: rest.opacity === 0 ? "hidden" : undefined }}
              className="group/card absolute top-5 left-1/2 -ml-25 h-75 w-50 [transition:translate_var(--dur-fast)_var(--ease-out)] group-data-[moving]/ring:will-change-transform hover:-translate-y-1"
            >
              <EducatorCard educator={educator} />
            </div>
          );
        })}
      </div>

      {/*
        The centred educator's introduction, qualifications and experience: every educator's lines share
        one cell (so the band keeps the tallest's height) and only the one the ring rests on shows, cross-
        fading as it changes. 600 wide, so it stays clear of the lowered cards beside it. Visual only;
        each slide carries its own lines for assistive technology.
      */}
      {hasDetails && (
        <div aria-hidden="true" data-reveal="fade" className="mx-auto mt-2 grid w-[600px] text-center">
          {educators.map((educator, i) => (
            <div
              key={educator.name}
              ref={(el) => {
                detailRefs.current[i] = el;
              }}
              data-shown={i === 0 ? "" : undefined}
              className="col-start-1 row-start-1 flex flex-col items-center gap-3 opacity-0 [transition:opacity_var(--dur-base)_var(--ease-out)] data-[shown]:opacity-100"
            >
              {educator.introduction && <p className="font-heading text-[20px]/[1.45] text-ink italic">{educator.introduction}</p>}
              {(educator.qualifications || educator.experience) && (
                <p className="font-mono text-[12px]/[1.4] tracking-[0.08em] text-burnt uppercase">
                  {[educator.qualifications, educator.experience].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
}

/**
 * One educator (Figma "faculty · …", 200 × 300): the portrait filling a rounded card, a dark fade at its
 * foot, the name in Source Sans 3 Bold and the subject in Geist Mono under it. Black and white unless it
 * is centred or hovered (the photo eases to colour over 600ms). With a profile page the card is a link;
 * without one it is a still article.
 */
function EducatorCard({ educator }: { educator: Educator }) {
  const { name, focus, photo, profile, qualifications, experience, introduction } = educator;
  const details = [qualifications, experience, introduction].filter(Boolean).join(". ");
  const className =
    "relative block size-full overflow-hidden rounded-2xl bg-[#24211e] shadow-rest [transition:box-shadow_var(--dur-base)_var(--ease-out)] group-data-[centre]/card:shadow-hover";
  const content = (
    <>
      {/* The name is right under it, so the portrait itself is not announced. */}
      <Photo
        src={photo}
        alt=""
        sizes="200px"
        className="absolute inset-0 bg-[#24211e]"
        imageClassName="grayscale group-hover/card:grayscale-0 group-data-[centre]/card:grayscale-0"
      />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[170px] bg-linear-to-b from-[rgb(18_17_16/0)] to-[rgb(18_17_16/0.95)]" />
      <div className="absolute inset-x-3 bottom-4 flex flex-col gap-1.5">
        <h3 className="text-[17px]/[1.2] font-bold text-white">{name}</h3>
        <p className="font-mono text-[11px]/[1.4] tracking-[0.08em] text-white/75 uppercase">{focus}</p>
        {details && <p className="sr-only">{details}</p>}
      </div>
    </>
  );
  if (profile !== null) {
    return (
      <a href={profile} draggable={false} data-cursor-label="View" className={className}>
        {content}
      </a>
    );
  }
  return <article className={className}>{content}</article>;
}
