import { useId } from "react";

/** The strip's size; the stats sit on it. */
export const PAPER_W = 1360;
export const PAPER_H = 208;

/** A seeded random number generator, so the same tears come out on the server and in the browser. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type Point = [number, number];

/**
 * A torn edge between two points along one axis: the position along it steps a few pixels at a time,
 * and the edge wanders around `base` with a slow wave and fine jitter, like paper torn by hand.
 */
function tear(rand: () => number, from: number, to: number, base: number, amp: number): Point[] {
  const phase = rand() * 10;
  const points: Point[] = [];
  const dir = Math.sign(to - from);
  for (let at = from; dir * (to - at) > 0; at += dir * (5 + rand() * 9)) {
    const wave = Math.sin(at / 97 + phase) * 0.55 + Math.sin(at / 37 + phase * 2) * 0.3;
    points.push([at, base + (wave + (rand() - 0.5) * 0.9) * amp]);
  }
  points.push([to, base + (rand() - 0.5) * amp]);
  return points;
}

/** How much of the pale paper core shows between the rim's edge and the brown face: a few px, wider in patches. */
function core(rand: () => number, at: number, phase: number) {
  return 3 + 6 * Math.max(0, Math.sin(at / 61 + phase)) ** 2 + rand() * 2.5;
}

const f = (n: number) => n.toFixed(1);
const path = (points: Point[]) => `M${points.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;

/**
 * The strip's two shapes: the pale fibrous rim that a tear leaves, and the brown face inset from it.
 * Top and bottom are torn along the length; the short ends are torn too.
 */
function shapes() {
  const rand = seeded(19);
  const top = tear(rand, 10, PAPER_W - 10, 14, 7);
  const right = tear(rand, 16, PAPER_H - 16, PAPER_W - 8, 4).map(([y, x]): Point => [x, y]);
  const bottom = tear(rand, PAPER_W - 10, 10, PAPER_H - 14, 7);
  const left = tear(rand, PAPER_H - 16, 16, 8, 4).map(([y, x]): Point => [x, y]);

  const p1 = rand() * 10;
  const p2 = rand() * 10;
  const faceTop = top.map(([x, y]): Point => [x, y + core(rand, x, p1)]);
  const faceBottom = bottom.map(([x, y]): Point => [x, y - core(rand, x, p2)]);
  const faceRight = right.map(([x, y]): Point => [x - 3 - rand() * 4, y]);
  const faceLeft = left.map(([x, y]): Point => [x + 3 + rand() * 4, y]);
  // Keep the face's corners inside the rim's.
  const inside = (points: Point[]) => points.filter(([x]) => x > 14 && x < PAPER_W - 14);

  return {
    rim: path([...top, ...right, ...bottom, ...left]),
    face: path([...inside(faceTop), ...faceRight, ...inside(faceBottom), ...faceLeft]),
  };
}

const { rim, face } = shapes();

/**
 * A strip of torn kraft paper, after the reference the brief pointed to: a brown face with a fine grain,
 * inside the pale, fibrous rim a tear leaves. Drawn in SVG so it stays crisp; purely decorative.
 * `rimOnly` draws just the pale paper, for the fibres showing along a tear that's still moving.
 */
export default function TornPaper({ className, rimOnly = false }: { className?: string; rimOnly?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      width={PAPER_W}
      height={PAPER_H}
      viewBox={`0 0 ${PAPER_W} ${PAPER_H}`}
      className={className}
    >
      <defs>
        {/* Speckled grain, kept to the shape it's drawn on. */}
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.55" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        {/* Longer, softer blotches, for the uneven colour of recycled card. */}
        <filter id={`${id}-mottle`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves="3" seed="9" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.35" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <path d={rim} className="fill-kraft-rim" />
      <path d={rim} fill="#8a7650" filter={`url(#${id}-grain)`} opacity="0.35" />
      {!rimOnly && (
        <>
          <path d={face} className="fill-kraft" />
          <path d={face} fill="#5c4120" filter={`url(#${id}-mottle)`} opacity="0.5" />
          <path d={face} fill="#4a3418" filter={`url(#${id}-grain)`} opacity="0.45" />
        </>
      )}
    </svg>
  );
}
