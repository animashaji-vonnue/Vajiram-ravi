/*
 * The closing banner's play (ClosingCta/SunRise): everything about the sunrise that answers the visitor,
 * driven by one requestAnimationFrame loop that runs only while the band is on screen. Every frame reads
 * the art's box (and the heading's, while the pointer plays over it) before it writes anything, and it
 * writes only transform, translate, scale and opacity, so the band stays on the compositor.
 *
 *   Scroll    the sunrise is scrubbed by the scroll: from the moment the disc's place (560px down the band)
 *             reaches the foot of the screen until about 420px later, the disc, its rays and its glow rise
 *             240px from below the horizon into place, the rings scale from 0.9 and fade in from the inside
 *             out, a dusk shade over the band lifts and a dawn light at its foot swells and passes.
 *   Pointer   with a mouse or pen over the band, the sun, its rays and its glow follow the pointer a little,
 *             on a lagged spring (up to about 40px), and the rings follow at falling depths, the inner most;
 *             the rays turn five times faster, a warmer glow comes up round the sun, and a soft light follows
 *             the pointer across the band. Off on touch.
 *   Heading   letters near the pointer lift up to 10px, lean towards it and grow 6%, falling off over 150px,
 *             so the words never break apart; once the letters have risen into place (TextMotion) their
 *             masks stop clipping, so a lifted letter keeps its top.
 *   Press     a press or tap anywhere on the band but its links sends a halo ring (and a fainter echo) out
 *             from the point pressed, with a glint there; the sun brightens and swells for a moment and its
 *             rays spin up and settle.
 *
 * The CSS for the ripples, the paused loops and the freed masks is in closing-cta.css. With reduced motion
 * none of this starts: the art is simply in place and still.
 */

/** The layers of the art (SunRise), each moved only here. */
export type SunriseParts = {
  /** The art layer: the canvas's box over the band. Positions below are in its px. */
  root: HTMLElement;
  /** The band (the section): it takes the pointer and is watched for being on screen. */
  band: HTMLElement;
  /** The heading, whose letters TextMotion has split into `.tm-ch` spans (or will). */
  heading: HTMLElement | null;
  dusk: HTMLElement;
  dawn: HTMLElement;
  /** One wrapper per halo ring (the ring and its wave copy), from the inside out. */
  rings: HTMLElement[];
  /** The rays and the glow, which rise with the disc. */
  back: HTMLElement;
  rays: HTMLElement;
  glow: HTMLElement;
  /** The warmer glow that comes up while the pointer is over the band. */
  warm: HTMLElement;
  /** The disc's wrapper (rise and follow), the disc itself (its press swell) and its flare. */
  sun: HTMLElement;
  disc: HTMLElement;
  flare: HTMLElement;
  /** The layer the press ripples go into, and the light that follows the pointer. */
  ripples: HTMLElement;
  spot: HTMLElement;
};

export type SunriseGeometry = {
  /** The sun's centre and the disc's top, in the art's px. */
  sunX: number;
  sunY: number;
  discTop: number;
  /** The band's height. */
  height: number;
};

const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Scroll: how far below its place the sun starts, and the scroll over which it rises. */
const SINK = 240;
const RISE_SPAN = 420;
/** The rise is complete by the time the band's top is this far above the screen (or 120px in, at least). */
const RISE_END_TOP = -80;
/** The rings: each starts 5% of the rise after the one inside it and takes 60% of it; they rise 35% as far. */
const RING_STEP = 0.05;
const RING_SPAN = 0.6;
const RING_SINK = 0.35;
/** The dusk shade at the start, and the dawn light at the band's foot at its brightest (halfway). */
const DUSK = 0.55;
const DAWN = 0.9;

/** Pointer follow, px at the band's edge: the sun, its glow, its rays and the innermost ring (x, y). */
const FOLLOW_SUN = [40, 24] as const;
const FOLLOW_GLOW = [52, 30] as const;
const FOLLOW_RAYS = [32, 18] as const;
const FOLLOW_RING = [36, 22] as const;
/** The outermost ring moves this share of the innermost's, so the rings read as layers at depth. */
const RING_DEPTH_FLOOR = 0.15;
/** The follow spring (per second²; per second): a little under critical, so it settles with a soft sway. */
const STIFFNESS = 60;
const DAMPING = 10;
/** How quickly the hover warmth comes and goes, and the light under the pointer catches up (per second). */
const HOVER_RATE = 5;
const SPOT_RATE = 9;
const SPOT = 440;

/** The rays' turn, degrees a second: at rest (once in two minutes), while hovered, and the press spin. */
const RAY_SPEED = 3;
const RAY_HOVER = 15;
const RAY_BURST = 90;
/** How quickly the press spin and warmth settle (per second). */
const BURST_DECAY = 2.6;

/** Heading: the pointer's reach, the lift, the lean (share of the distance, at most px) and the growth. */
const LETTER_REACH = 150;
const LETTER_LIFT = 10;
const LETTER_LEAN = 0.07;
const LETTER_LEAN_MAX = 5;
const LETTER_GROW = 0.06;
const LETTER_RATE = 14;

/** Press: the ripple ring's final radius and time, the echo's delay, and the most ripples at once. */
const RIPPLE_R = 460;
const RIPPLE_MS = 1600;
const ECHO_DELAY_MS = 150;
const GLINT_R = 70;
const MAX_RIPPLES = 12;
const FLASH_MS = 1100;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const clamp01 = (n: number) => clamp(n, 0, 1);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const smooth = (t: number) => t * t * (3 - 2 * t);
const px = (n: number) => `${n.toFixed(2)}px`;

type Letter = { el: HTMLElement; cx: number; cy: number; x: number; y: number; s: number };

/** Starts the play on the art's layers and returns a function that stops it. */
export function playSunrise(parts: SunriseParts, geo: SunriseGeometry): () => void {
  const { root, band, heading, dusk, dawn, rings, back, rays, glow, warm, sun, disc, flare, ripples, spot } = parts;

  // Writes only what changed since the last frame.
  const written = new Map<HTMLElement, Record<string, string>>();
  const put = (el: HTMLElement, prop: "transform" | "opacity" | "translate" | "scale", value: string) => {
    let props = written.get(el);
    if (!props) written.set(el, (props = {}));
    if (props[prop] === value) return;
    props[prop] = value;
    el.style[prop] = value;
  };

  let width = root.offsetWidth || 1440;
  /** The mouse or pen, in client px, while it is over the band; null on touch or once it has left. */
  let pointer: { x: number; y: number } | null = null;
  let hover = 0;
  let burst = 0;
  let angle = 0;
  // The follow spring, in units of the band's half-width and half-height.
  let fx = 0;
  let fy = 0;
  let vx = 0;
  let vy = 0;
  let spotX = geo.sunX;
  let spotY = geo.height / 2;

  // The heading's letters, measured from the heading's box (canvas px) when the pointer comes over the band.
  let letters: Letter[] = [];
  let lettersMoving = false;
  let wasHovered = false;
  let freeCheckAt = 0;
  const measureLetters = () => {
    if (!heading) return;
    const els = heading.querySelectorAll<HTMLElement>(".tm-ch");
    if (!els.length) return;
    const box = heading.getBoundingClientRect();
    const z = box.width / heading.offsetWidth || 1;
    const previous = new Map(letters.map((letter) => [letter.el, letter]));
    letters = Array.from(els, (el) => {
      const r = el.getBoundingClientRect();
      const old = previous.get(el);
      const x = old?.x ?? 0;
      const y = old?.y ?? 0;
      // Its centre at rest: the scale is about the centre, so only the lift is taken off.
      return { el, cx: (r.left + r.width / 2 - box.left) / z - x, cy: (r.top + r.height / 2 - box.top) / z - y, x, y, s: old?.s ?? 1 };
    });
  };
  /** Once TextMotion's letter rise has run (no animation left in the heading), its masks may stop clipping. */
  const freeMasks = () => {
    if (!heading || heading.hasAttribute("data-sun-free") || !letters.length) return;
    if (heading.getAnimations({ subtree: true }).length === 0) heading.setAttribute("data-sun-free", "");
  };

  let raf = 0;
  let last = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;

    // Reads.
    const box = root.getBoundingClientRect();
    const scale = box.width / width || 1;
    const vh = window.innerHeight / scale;
    const top = box.top / scale;
    let lx = 0;
    let ly = 0;
    let hovered = false;
    if (pointer) {
      lx = (pointer.x - box.left) / scale;
      ly = (pointer.y - box.top) / scale;
      // The band may have scrolled out from under a still pointer.
      hovered = ly >= 0 && ly <= geo.height;
    }
    if (hovered && !wasHovered) measureLetters();
    wasHovered = hovered;
    if (hovered && now >= freeCheckAt) {
      freeCheckAt = now + 1000;
      freeMasks();
    }
    const headBox = heading && letters.length && (hovered || lettersMoving) ? heading.getBoundingClientRect() : null;

    // The scroll scrub.
    const start = vh - geo.discTop;
    const end = Math.min(start - 120, Math.max(start - RISE_SPAN, RISE_END_TOP));
    const progress = clamp01((start - top) / (start - end));
    // Eased in and out, so the sun is still at the horizon when the band's foot first comes on screen.
    const risen = smooth(progress);
    const rise = (1 - risen) * SINK;

    // The follow spring and the hover warmth.
    const tx = hovered ? clamp((lx - geo.sunX) / (width / 2), -1, 1) : 0;
    const ty = hovered ? clamp((ly - geo.height / 2) / (geo.height / 2), -1, 1) : 0;
    vx += ((tx - fx) * STIFFNESS - vx * DAMPING) * dt;
    vy += ((ty - fy) * STIFFNESS - vy * DAMPING) * dt;
    fx += vx * dt;
    fy += vy * dt;
    hover += ((hovered ? 1 : 0) - hover) * (1 - Math.exp(-dt * HOVER_RATE));
    burst *= Math.exp(-dt * BURST_DECAY);
    angle = (angle + dt * (RAY_SPEED + (RAY_HOVER - RAY_SPEED) * hover + RAY_BURST * burst)) % 360;
    if (hovered) {
      const catchUp = 1 - Math.exp(-dt * SPOT_RATE);
      spotX += (lx - spotX) * catchUp;
      spotY += (ly - spotY) * catchUp;
    }

    // Writes: the sky, the rings, the rays and glow, the sun, the light under the pointer.
    put(dusk, "opacity", ((1 - risen) * DUSK).toFixed(3));
    put(dawn, "opacity", (Math.sin(Math.PI * progress) * DAWN).toFixed(3));
    rings.forEach((ring, i) => {
      const shown = easeOut(clamp01((progress - i * RING_STEP) / RING_SPAN));
      const depth = 1 - ((1 - RING_DEPTH_FLOOR) * i) / Math.max(1, rings.length - 1);
      const x = fx * FOLLOW_RING[0] * depth;
      const y = fy * FOLLOW_RING[1] * depth + (1 - shown) * SINK * RING_SINK;
      put(ring, "opacity", shown.toFixed(3));
      put(ring, "transform", `translate3d(${px(x)}, ${px(y)}, 0) scale(${(0.9 + 0.1 * shown).toFixed(4)})`);
    });
    put(back, "transform", `translate3d(0, ${px(rise)}, 0)`);
    put(rays, "transform", `translate3d(${px(fx * FOLLOW_RAYS[0])}, ${px(fy * FOLLOW_RAYS[1])}, 0) rotate(${angle.toFixed(2)}deg)`);
    put(glow, "transform", `translate3d(${px(fx * FOLLOW_GLOW[0])}, ${px(fy * FOLLOW_GLOW[1])}, 0)`);
    put(warm, "opacity", clamp01(hover * 0.9 + burst * 0.6).toFixed(3));
    put(sun, "transform", `translate3d(${px(fx * FOLLOW_SUN[0])}, ${px(fy * FOLLOW_SUN[1] + rise)}, 0)`);
    put(spot, "transform", `translate3d(${px(spotX - SPOT / 2)}, ${px(spotY - SPOT / 2)}, 0)`);
    put(spot, "opacity", hover.toFixed(3));

    // The heading's letters.
    if (headBox) {
      // Away from the band the letters settle back (the targets are their rest).
      const hx = pointer ? (pointer.x - headBox.left) / scale : 0;
      const hy = pointer ? (pointer.y - headBox.top) / scale : 0;
      const follow = 1 - Math.exp(-dt * LETTER_RATE);
      let moving = false;
      for (const letter of letters) {
        let gx = 0;
        let gy = 0;
        let gs = 1;
        if (hovered) {
          const dx = hx - letter.cx;
          const dy = hy - letter.cy;
          const d = Math.hypot(dx, dy);
          if (d < LETTER_REACH) {
            const f = smooth(1 - d / LETTER_REACH);
            gx = clamp(dx * LETTER_LEAN * f, -LETTER_LEAN_MAX, LETTER_LEAN_MAX);
            gy = -LETTER_LIFT * f;
            gs = 1 + LETTER_GROW * f;
          }
        }
        letter.x += (gx - letter.x) * follow;
        letter.y += (gy - letter.y) * follow;
        letter.s += (gs - letter.s) * follow;
        const resting = Math.abs(letter.x) < 0.02 && Math.abs(letter.y) < 0.02 && Math.abs(letter.s - 1) < 0.0005;
        if (resting && !hovered) {
          letter.x = letter.y = 0;
          letter.s = 1;
          put(letter.el, "translate", "");
          put(letter.el, "scale", "");
          continue;
        }
        moving = true;
        put(letter.el, "translate", `${px(letter.x)} ${px(letter.y)}`);
        put(letter.el, "scale", letter.s.toFixed(4));
      }
      lettersMoving = moving;
    }
  };

  const startLoop = () => {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  };
  const stopLoop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  // The press ripple: rings out from the point, a glint at it, and the sun's flash.
  const press = (x: number, y: number) => {
    const spawn = (className: string, r: number, keyframes: Keyframe[], duration: number, delay = 0) => {
      const el = document.createElement("span");
      el.className = className;
      el.setAttribute("aria-hidden", "true");
      Object.assign(el.style, { left: px(x - r), top: px(y - r), width: px(r * 2), height: px(r * 2) });
      ripples.append(el);
      const animation = el.animate(keyframes, { duration, delay, easing: EASE_OUT, fill: "backwards" });
      animation.onfinish = animation.oncancel = () => el.remove();
    };
    while (ripples.childElementCount > MAX_RIPPLES) ripples.firstElementChild?.remove();
    const ring: Keyframe[] = [
      { transform: "scale(0.04)", opacity: 0 },
      { opacity: 1, offset: 0.08 },
      { transform: "scale(1)", opacity: 0 },
    ];
    spawn("sun-ripple", RIPPLE_R, ring, RIPPLE_MS);
    spawn("sun-ripple sun-ripple-echo", RIPPLE_R * 0.72, ring, RIPPLE_MS, ECHO_DELAY_MS);
    spawn("sun-glint", GLINT_R, [{ transform: "scale(0.2)", opacity: 0.9 }, { transform: "scale(1.3)", opacity: 0 }], 700);
    flare.animate([{ opacity: 0 }, { opacity: 1, offset: 0.22 }, { opacity: 0 }], { duration: FLASH_MS, easing: "ease-out" });
    disc.animate([{ transform: "none" }, { transform: "scale(1.035)", offset: 0.22 }, { transform: "none" }], { duration: FLASH_MS, easing: "ease-out" });
    burst = Math.min(1.5, burst + 1);
    startLoop();
  };

  const isFinePointer = (event: PointerEvent) => event.pointerType === "mouse" || event.pointerType === "pen";
  const onMove = (event: PointerEvent) => {
    pointer = isFinePointer(event) ? { x: event.clientX, y: event.clientY } : null;
  };
  const onLeave = () => {
    pointer = null;
  };
  const onDown = (event: PointerEvent) => {
    onMove(event);
    if (event.button !== 0 || (event.target instanceof Element && event.target.closest("a, button, input, select, textarea"))) return;
    const box = root.getBoundingClientRect();
    const scale = box.width / width || 1;
    press((event.clientX - box.left) / scale, (event.clientY - box.top) / scale);
  };
  const onResize = () => {
    width = root.offsetWidth || width;
    wasHovered = false;
  };

  band.addEventListener("pointermove", onMove, { passive: true });
  band.addEventListener("pointerenter", onMove, { passive: true });
  band.addEventListener("pointerleave", onLeave, { passive: true });
  band.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("resize", onResize);

  // The loop (and the CSS loops: the ripple wave and the breathing glow) only while the band is on screen.
  let observer: IntersectionObserver | undefined;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(([entry]) => {
      root.toggleAttribute("data-playing", entry.isIntersecting);
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    });
    observer.observe(band);
  } else {
    root.setAttribute("data-playing", "");
    startLoop();
  }

  return () => {
    stopLoop();
    observer?.disconnect();
    band.removeEventListener("pointermove", onMove);
    band.removeEventListener("pointerenter", onMove);
    band.removeEventListener("pointerleave", onLeave);
    band.removeEventListener("pointerdown", onDown);
    window.removeEventListener("resize", onResize);
    ripples.replaceChildren();
    root.removeAttribute("data-playing");
  };
}
