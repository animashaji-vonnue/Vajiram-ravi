import Image from "next/image";
import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";

/**
 * A ring of cards circling the emblem flat on the page, after the rings of text on
 * contentarchitecture.dev. `radius` is the distance from the emblem's centre to the cards' centres,
 * `size` the cards' side, `icon` the icon's side on it, `period` the seconds per turn, `dir` 1 for
 * clockwise and -1 for anticlockwise, and `phase` where the first card starts, in degrees from the top.
 */
type Ring = { count: number; radius: number; size: number; icon: number; period: number; dir: 1 | -1; phase: number };

/**
 * The hero's two rings, turning opposite ways. The inner ring clears the top and bottom of the emblem
 * and the outer ring clears the inner one, so no card ever covers the emblem or another card.
 */
const RINGS: Ring[] = [
  { count: 4, radius: 232, size: 60, icon: 34, period: 54, dir: 1, phase: 45 },
  { count: 6, radius: 308, size: 80, icon: 46, period: 80, dir: -1, phase: 0 },
];
/**
 * The cards' icons, in order round the inner ring and then the outer one: the study-material icons
 * from the design's icon set (3541:495), which has "One-page notes" twice.
 */
const ICONS = [
  "monthly-magazine",
  "infographics",
  "one-page-notes",
  "subject-notebooks",
  "rural-development",
  "public-policy",
  "quick-revision",
  "answer-writing",
  "economic-growth",
  "one-page-notes",
];
/** The faint dotted circles behind the hero's rings, including one along each ring's path. */
const GUIDES = [156, 194, 232, 270, 308, 348];

/** When the hero's cards fade in, after the opening sequence (ms). The circles come in just before them. */
const APPEAR_AT = 2750;

/** Where a card sits on its ring, turned back upright. */
function seat(radius: number, angle: number, size: number): CSSProperties {
  return {
    width: size,
    height: size,
    margin: `${-size / 2}px 0 0 ${-size / 2}px`,
    transform: `rotate(${angle}deg) translateY(${-radius}px) rotate(${-angle}deg)`,
  };
}

/**
 * A card as a small 3D tile: a white face lit from above with a glossy top, a thick lower edge and a
 * soft shadow under it, and the icon raised off the face.
 */
const TILE =
  "relative grid size-full place-items-center rounded-[14px] border border-white bg-linear-to-b from-white to-sand-100 shadow-[0_5px_0_var(--color-sand-200),0_18px_28px_-10px_rgba(28,25,23,.35),inset_0_-3px_6px_rgba(28,25,23,.05)] before:absolute before:inset-x-1 before:top-1 before:h-1/2 before:rounded-[11px] before:bg-linear-to-b before:from-white before:to-white/0";

/** Dotted circles of the given radii around the centre: round dots (zero-length dashes with round caps) every 6px. */
function Guides({ radii, className, style }: { radii: number[]; className?: string; style?: CSSProperties }) {
  const extent = Math.max(...radii) + 1;
  return (
    <svg
      width={extent * 2}
      height={extent * 2}
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      className={cx("absolute top-1/2 left-1/2 -translate-1/2", className)}
      style={style}
    >
      {radii.map((radius) => (
        <circle
          key={radius}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="0 6"
        />
      ))}
    </svg>
  );
}

/**
 * Rings of cards around the centre. Each ring turns as one piece, so its cards keep their places on
 * it; each card turns back the other way as it goes, so it stays upright and lit from above, like a
 * tile on a turntable. With `appearAt`, the cards fade in one after another from that time (ms).
 */
function Rings({ rings, appearAt }: { rings: Ring[]; appearAt?: number }) {
  let order = 0;
  return rings.map((ring, r) => (
    <div
      key={r}
      className="absolute top-1/2 left-1/2 size-0"
      style={{ animation: `orbit ${ring.period}s linear infinite ${ring.dir < 0 ? "reverse" : "normal"}` }}
    >
      {Array.from({ length: ring.count }, (_, i) => {
        const index = order++;
        return (
          <div
            key={i}
            className="absolute top-0 left-0"
            style={{
              ...seat(ring.radius, ring.phase + (i * 360) / ring.count, ring.size),
              animation: appearAt === undefined ? undefined : `fade-in 900ms var(--ease-smooth) ${appearAt + index * 80}ms both`,
            }}
          >
            <div
              className={TILE}
              style={{ animation: `orbit ${ring.period}s linear infinite ${ring.dir < 0 ? "normal" : "reverse"}` }}
            >
              <Image
                src={`/images/hero/icons/${ICONS[index % ICONS.length]}.svg`}
                alt=""
                width={48}
                height={48}
                className="relative drop-shadow-[0_3px_3px_rgba(28,25,23,.18)]"
                style={{ width: ring.icon, height: ring.icon }}
              />
            </div>
          </div>
        );
      })}
    </div>
  ));
}

/**
 * The orbiting cards in the hero, centred on the emblem. Pure CSS, so they move on the compositor
 * without any script; with reduced motion the rings stay still in their starting places.
 * The cards are decoration, so they're hidden from assistive technology.
 */
export default function OrbitCards() {
  return (
    // Not given a z-index, so the emblem, which comes after it, stays on top.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <Guides
        radii={GUIDES}
        className="text-neutral-300"
        style={{ animation: `fade-in 1200ms var(--ease-smooth) ${APPEAR_AT - 300}ms both` }}
      />
      <Rings rings={RINGS} appearAt={APPEAR_AT} />
    </div>
  );
}
