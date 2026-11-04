import { useId } from "react";

/** The strip's size; the banner's content is laid out on it. */
export const STRIP = { width: 1180, height: 330 };
/** Where the pin goes into the paper, in the strip's own pixels. */
export const PIN_HOLE = { x: 590, y: 30 };

type Point = [number, number];

/** A seeded random number generator, so the same tear comes out on the server and in the browser. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * A torn line from `a` to `b`, by midpoint displacement: each halving nudges the new point sideways by
 * less, so it wanders in long sweeps with finer jags on top, the way paper gives when it's torn by hand.
 */
function tear(rand: () => number, a: Point, b: Point, amp: number, depth = 7): Point[] {
  if (depth === 0) return [a];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy) || 1;
  const off = (rand() - 0.5) * amp;
  const mid: Point = [(a[0] + b[0]) / 2 - (dy / len) * off, (a[1] + b[1]) / 2 + (dx / len) * off];
  return [...tear(rand, a, mid, amp * 0.55, depth - 1), ...tear(rand, mid, b, amp * 0.55, depth - 1)];
}

/**
 * The strip's two outlines. The rim is the whole torn piece; the face is its brown surface, which tears a
 * few pixels short of the rim along the torn sides and foot, leaving the pale inner fibres showing, as
 * torn paper does. The top is a clean cut, so the face runs right to it.
 */
function outlines() {
  const rand = seeded(23);
  const { width: W, height: H } = STRIP;
  const top = tear(rand, [8, 8], [W - 8, 8], 1.5, 6);
  const right = tear(rand, [W - 8, 8], [W - 12, H - 16], 14);
  const bottom = tear(rand, [W - 12, H - 16], [10, H - 12], 26);
  const left = tear(rand, [10, H - 12], [8, 8], 14);

  // How far the face stops short of the torn edge: 2–8px, in slow patches.
  const phase = rand() * 10;
  const inset = (i: number) => 2 + 3 * (1 + Math.sin(i / 9 + phase)) + rand() * 1.5;
  const face = [
    ...top,
    ...right.map(([x, y], i): Point => [x - inset(i), y]),
    ...bottom.map(([x, y], i): Point => [x, y - inset(i + 40)]),
    ...left.map(([x, y], i): Point => [x + inset(i + 80), y]),
  ];
  const d = (points: Point[]) => `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;
  return { rim: d([...top, ...right, ...bottom, ...left]), face: d(face) };
}

const { rim, face } = outlines();

/**
 * A strip of old paper torn from a larger sheet, as in the reference: a pale fibrous rim along the torn
 * sides and foot, an aged cream face with a fine grain and faint tide-mark stains that darken a little
 * towards its edges, and the small dimpled hole the pin makes. Drawn in SVG; purely decorative.
 */
export default function TornStrip({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const url = (name: string) => `url(#${id}-${name})`;
  const { width: W, height: H } = STRIP;
  return (
    <svg aria-hidden="true" width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={className}>
      <defs>
        {/* Frays an edge into loose fibres. */}
        <filter id={`${id}-fibres`} x="-2%" y="-5%" width="104%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Roughens the face's edge, less finely than the fibres. */}
        <filter id={`${id}-rough`} x="-2%" y="-5%" width="104%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* The paper itself: grain, soft stains, and a little more age towards the edges. */}
        <filter id={`${id}-paper`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="11" result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 .35  0 0 0 0 .27  0 0 0 0 .17  .6 0 0 0 -.24"
            result="grain"
          />
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="4" seed="5" result="s" />
          <feColorMatrix
            in="s"
            type="matrix"
            values="0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .22  .6 0 0 0 -.27"
            result="stains"
          />
          <feGaussianBlur in="SourceAlpha" stdDeviation="22" result="soft" />
          <feComposite in="SourceAlpha" in2="soft" operator="out" result="rimArea" />
          <feFlood floodColor="#8a6a3c" floodOpacity="0.32" />
          <feComposite in2="rimArea" operator="in" result="age" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="stains" />
            <feMergeNode in="grain" />
            <feMergeNode in="age" />
          </feMerge>
          <feComposite in2="SourceAlpha" operator="in" />
        </filter>
        <radialGradient id={`${id}-dimple`}>
          <stop offset="0" stopColor="#2d2010" stopOpacity="0.85" />
          <stop offset="0.35" stopColor="#5a4426" stopOpacity="0.35" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path d={rim} fill="#fbf8f1" filter={url("fibres")} />
      <g filter={url("rough")}>
        <path d={face} fill="#ebe3d0" filter={url("paper")} />
      </g>
      <ellipse cx={PIN_HOLE.x} cy={PIN_HOLE.y} rx="6" ry="4" fill={url("dimple")} />
    </svg>
  );
}
