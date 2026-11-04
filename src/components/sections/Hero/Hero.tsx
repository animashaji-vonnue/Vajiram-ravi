import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Buttons";
import { hero } from "@/data/home";
import { cx } from "@/lib/cx";
import OpeningCover from "./OpeningCover";
import EmblemMark from "./EmblemMark";
import HeroStats from "./HeroStats";
import OrbitCards from "./OrbitCards";

/**
 * The opening sequence: the emblem draws itself in the middle of the window (about 1.85s), then glides
 * over MOVE_MS to its place, while the cover fades (OpeningCover) and the copy rises in.
 */
const DRAWN_AT = 1850;
const MOVE_MS = 1050;
const RISE = "[animation:intro-rise_1000ms_var(--ease-smooth)_2550ms_both]";
/**
 * The hero fills the window (`--vh` is its height in canvas pixels), but never less than MIN_HEIGHT (enough for
 * the orbit inside the panel), and centres its content in the part below the nav bar (which ends NAV_BOTTOM
 * from the top).
 */
const MIN_HEIGHT = 880;
const NAV_BOTTOM = 100;
const HEIGHT = `max(var(--vh, 900px), ${MIN_HEIGHT}px)`;
/**
 * The design's framed tile (3697:662), drawn 1440 × 839: under the nav bar, an indigo band with a white panel
 * FRAME px in from its edges, its corners scooped out, a pencil line just inside it, and leaf sprigs in the
 * band's corners. The band's size follows the window, so the drawing is nine-sliced: the CORNER pieces
 * (scoops, line curves and sprigs) keep their size and only the straight runs between them stretch.
 */
const FRAME = 30;
const CORNER = { x: 180, y: 160 };
const BAND = {
  borderStyle: "solid",
  borderWidth: `${CORNER.y}px ${CORNER.x}px`,
  borderImage: `url(/images/hero/frame.svg) ${CORNER.y} ${CORNER.x} fill / ${CORNER.y}px ${CORNER.x}px stretch`,
} as CSSProperties;
/**
 * Where the emblem's centre ends up: the middle of the 610 × 568 art area, ART_RIGHT in from the right of the
 * content, which spreads to the panel's width (the window's, `--vw`, less the frame) up to the 1760px "wide"
 * container, and centred under the nav bar. ART_RIGHT keeps the outer ring of cards inside the panel.
 */
const ART_RIGHT = 55;
const EMBLEM_FROM_RIGHT = ART_RIGHT + 610 / 2;
const EMBLEM_Y = `(${NAV_BOTTOM}px + ${HEIGHT}) / 2`;
/** Starts the emblem in the middle of the window. */
const EMBLEM_MOTION = {
  "--settle-x": `calc(${EMBLEM_FROM_RIGHT}px - min(var(--vw, 1440px) - ${2 * FRAME}px, 1760px) / 2)`,
  "--settle-y": `calc(var(--vh, 900px) / 2 - ${EMBLEM_Y})`,
  animation: `emblem-settle ${MOVE_MS}ms var(--ease-smooth) ${DRAWN_AT}ms both, lift ${DRAWN_AT + MOVE_MS + 50}ms step-end both`,
} as CSSProperties;

/**
 * The hero, from the design's split layout: heading, intro, actions and the stats on the left; on the right the
 * emblem with two rings of cards orbiting it (OrbitCards).
 * The page opens on a white cover while the emblem draws itself in the middle of the window, after
 * brand.dropbox.com (OpeningCover, EmblemMark); it then glides to its place on the right as the rest of
 * the hero comes in. The emblem is lifted above the cover until it lands, then dropped back under the header.
 * Like theperformancelab.ca, the hero is exactly one window tall, and on wide screens its content spreads
 * out (to the "wide" container) rather than sitting in a 1440px column.
 */
export default function Hero() {
  return (
    // Pulled up under the 80px header, so the hero's one window of height starts at the top of the window.
    <section
      className="-mt-20 flex flex-col bg-white"
      style={{ height: HEIGHT, paddingTop: NAV_BOTTOM }}
      aria-labelledby="hero-title"
    >
      <OpeningCover />
      <div className="relative flex flex-1 bg-indigo-800" style={{ padding: FRAME }}>
        <div aria-hidden="true" className="absolute inset-0" style={BAND} />
        <div
          className="relative mx-auto flex w-full max-w-wide items-center justify-between pl-[110px]"
          style={{ paddingRight: ART_RIGHT }}
        >
          <div className={cx("flex w-[560px] shrink-0 flex-col gap-10", RISE)}>
            <div className="flex flex-col gap-6">
              {/* A two-part badge: a light pill holding a filled vermilion tag, then vermilion monospaced text. */}
              <p className="inline-flex items-center gap-2.5 self-start rounded-full border border-neutral-200 bg-neutral-50 py-1 pr-4 pl-1">
                <span className="rounded-full bg-vermilion px-3 py-1 font-display text-[14px]/[20px] font-medium text-white">
                  {hero.badge.tag}
                </span>
                <span className="font-mono text-[14px]/[20px] font-medium tracking-[-0.2px] text-vermilion">
                  {hero.badge.text}
                </span>
              </p>
              <h1
                id="hero-title"
                className="font-display text-[64px]/[71px] font-semibold text-balance text-neutral-900"
              >
                {hero.heading} <span className="text-brand-500">{hero.highlight}</span>
              </h1>
              <p className="font-sans text-[18px]/[25px] font-medium text-neutral-500">{hero.intro}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} tone="secondary">
                {hero.secondary.label}
              </Button>
            </div>
            <HeroStats />
          </div>

          {/* Not given a z-index, so the cards and the emblem stack against each other directly. */}
          <div className="relative h-[568px] w-[610px] shrink-0">
            <OrbitCards />
            {/* 272 × 392, the emblem's own proportions. */}
            <EmblemMark
              // Multiplied onto the background, so the picture's white inside takes on whatever is behind it.
              className="absolute top-1/2 left-1/2 -mt-[196px] -ml-[136px] h-[392px] w-[272px] mix-blend-multiply"
              style={EMBLEM_MOTION}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
