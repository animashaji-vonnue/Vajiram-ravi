"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CarouselDots } from "@/components/ui/CarouselControls";
import Cta from "@/components/ui/Cta";
import Icon from "@/components/ui/Icon";
import { campusGallery, campuses, locationsIntro } from "@/data/contact";
import { prefersReducedMotion } from "@/lib/motion";

const ART = "/images/locations";
const MAP = `${ART}/map`;

/** The map tile: 634 × 196, the map image (1584 × 672) covering it a little enlarged. */
const FRAME = { w: 634, h: 196 };
const COVER = Math.max(FRAME.w / 1584, FRAME.h / 672) * 1.15;
const IMAGE = { w: 1584 * COVER, h: 672 * COVER };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** The map's zoom steps (+ and −), about the campus's point. */
const ZOOMS = [1, 1.35, 1.8, 2.4];

/**
 * The + and − of a map: a small white box tucked into the tile's bottom right corner (16px in, as a map's
 * own controls sit), the two buttons split by a hairline; the signs are drawn icons, so they sit dead centre.
 */
function ZoomControl({ step, onStep }: { step: number; onStep: (by: number) => void }) {
  const button =
    "flex size-8 cursor-pointer items-center justify-center text-ink [transition:background-color_var(--dur-fast)_var(--ease-out),color_var(--dur-fast)_var(--ease-out)] hover:bg-[#f3ece1] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-burnt disabled:cursor-default disabled:text-ink/30 disabled:hover:bg-transparent";
  return (
    <div className="absolute right-4 bottom-4 flex flex-col overflow-clip rounded-[6px] bg-white shadow-[0_2px_6px_rgb(43_18_5/0.22)] ring-1 ring-black/5">
      <button type="button" aria-label="Zoom in" disabled={step >= ZOOMS.length - 1} onClick={() => onStep(1)} className={button}>
        <Icon name="plus" className="size-3.5" />
      </button>
      <span aria-hidden="true" className="mx-1.5 h-px bg-black/12" />
      <button type="button" aria-label="Zoom out" disabled={step <= 0} onClick={() => onStep(-1)} className={button}>
        <Icon name="minus" className="size-3.5" />
      </button>
    </div>
  );
}

/** A teardrop pin, as on the drawn map, for a campus the drawing does not mark. */
function Pin() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 52" width={34} height={44} className="drop-shadow-[0_4px_4px_rgba(43,18,5,0.25)]">
      <path d="M20 2C10.06 2 2 10.06 2 20c0 13.5 18 30 18 30s18-16.5 18-30C38 10.06 29.94 2 20 2Z" fill="#f08a3c" stroke="#c9651c" strokeWidth="2" />
      <circle cx="20" cy="19" r="6.5" fill="#fff8ec" stroke="#c9651c" strokeWidth="2" />
    </svg>
  );
}

function Fact({ icon, children }: { icon: string; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[16px]/[23px] font-medium text-ink">
      <img src={`${MAP}/${icon}.svg`} alt="" aria-hidden="true" width={16} height={16} className="size-4 shrink-0" />
      {children}
    </span>
  );
}

/**
 * "Our locations", after Figma "11 Location · concept D (photo grid)" (2541:5713), kept low (feedback item
 * 41): the heading "Where can you find us?" (the emphasis in orange, no lead), then a 460px grid. On the
 * left a cream tile with the New Delhi centre's address, landmark, hours and phone (the one centre; there
 * are no city tabs), and under it the street map with "View on maps" over it; on the right the institute's
 * photographs as a carousel, one at a time (Gallery).
 *
 * Motion: the heading reveals with the page's text motion; the tiles rise in one after another. "View on
 * maps" opens Google Maps in a new tab.
 */
export default function Locations() {
  const campus = campuses[0];
  const { focus, pin } = campus.map;
  const point = { x: focus.x * IMAGE.w, y: focus.y * IMAGE.h };
  const left = clamp(FRAME.w / 2 - point.x, FRAME.w - IMAGE.w, 0);
  const top = clamp(FRAME.h / 2 - point.y, FRAME.h - IMAGE.h, 0);
  const { title } = locationsIntro;
  const [zoomStep, setZoomStep] = useState(0);
  const zoom = ZOOMS[zoomStep];

  return (
    <section id="locations" aria-labelledby="locations-h" className="relative bg-cream">
      <div className="mx-auto flex w-canvas flex-col gap-12 px-20 pt-10 pb-24">
        {/* The heading (the client asked for no lead under it). */}
        <div className="flex items-end justify-between gap-10">
          <div className="flex w-[820px] flex-col gap-4">
            <h2 id="locations-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
              {title.lead}
              <em data-reveal-em className="text-orange italic">
                {title.em}
              </em>
            </h2>
          </div>
        </div>

        {/* The grid. */}
        <div data-stagger className="grid h-[460px] grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {/* The details tile: the centre's name, then its address, landmark, hours and phone. */}
            <div className="flex h-[252px] shrink-0 flex-col rounded-[20px] border border-[#eadbc4] bg-[#fbf3e6] px-9 pt-7 pb-7">
              <p className="text-[13px]/[16px] font-semibold tracking-[0.01em] text-burnt">{campus.city} centre</p>
              <div className="mt-3 flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-[24px]/[31px] font-medium text-ink">{campus.address}</h3>
                {campus.landmark && (
                  <p className="text-[16px]/[24px] text-clay">
                    {locationsIntro.landmarkPrefix}
                    {campus.landmark}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-8">
                <Fact icon="icon-clock">{campus.hours}</Fact>
                <Fact icon="icon-phone">
                  <a href={campus.phoneHref} className="[transition:color_var(--dur-fast)_var(--ease-out)] hover:text-burnt">
                    {campus.phone}
                  </a>
                </Fact>
              </div>
              </div>
            </div>

            {/* The map tile, with "View on maps" (orange, with a folded map) over it and a + and − at its right to zoom it. */}
            <div className="relative min-h-0 flex-1 overflow-clip rounded-[20px] bg-[#ece8df]">
              <div
                role="img"
                aria-label={`Street map: ${campus.mapLabel}`}
                className="absolute motion-safe:[transition:scale_400ms_var(--ease-out)]"
                // Zoomed about the campus's point, so the pin stays where it is.
                style={{ left, top, width: IMAGE.w, height: IMAGE.h, scale: zoom, transformOrigin: `${point.x}px ${point.y}px` }}
              >
                <img src={`${MAP}/map.webp`} alt="" width={1584} height={672} loading="lazy" decoding="async" className="size-full max-w-none" />
                {pin && (
                  // The pin keeps its size as the map zooms.
                  <span
                    className="absolute -translate-x-1/2 -translate-y-full motion-safe:[transition:scale_400ms_var(--ease-out)]"
                    style={{ left: point.x, top: point.y + 6, scale: 1 / zoom, transformOrigin: "50% 100%" }}
                  >
                    <Pin />
                  </span>
                )}
              </div>
              <ZoomControl step={zoomStep} onStep={(by) => setZoomStep((s) => clamp(s + by, 0, ZOOMS.length - 1))} />
              <div className="absolute bottom-6 left-6 shadow-[0_10px_24px_-8px_rgb(43_18_5/0.45)]">
                <Cta
                  variant="primary"
                  size="lg"
                  href={campus.mapsUrl}
                  target="_blank"
                  ariaLabel={`${locationsIntro.mapsCta}: ${campus.city} campus (opens in a new tab)`}
                  // A folded map in place of the arrow (the client's reference), white as the header's phone.
                  icon={<Icon name="map" className="size-4 brightness-0 invert" />}
                >
                  {locationsIntro.mapsCta}
                </Cta>
              </div>
            </div>
          </div>

          <Gallery city={campus.city} place={campus.mapLabel} />
        </div>
      </div>
    </section>
  );
}

/** The gallery's autoplay step, ms: long enough to look at a photograph and read its caption. */
const GALLERY_MS = 5000;
/** The slide from one photograph to the next, ms. */
const SLIDE_MS = 700;

/**
 * The gallery: a carousel of the institute's photographs filling the right half of the grid, one at a
 * time (the client: "one image… it should feel like a carousel", not a bento). Each is captioned at its
 * foot over a soft shade (the building with the campus and its place); the dots sit at the foot on the
 * right, over the photograph (no arrows). The photographs slide across (700ms, the soft in-out ease),
 * the one coming in settling from a little closer; it moves on by itself every 5 seconds, holding while
 * the pointer is over it or focus is inside it, and the dots and the ← → keys move it too
 * (round from the last to the first). Reduced motion: no autoplay, and the photographs change at once.
 *
 * Assistive technology: a carousel region of slides labelled "n of N", only the shown one reachable.
 */
function Gallery({ city, place }: { city: string; place: string }) {
  const count = campusGallery.length;
  const [active, setActive] = useState(0);
  const [still, setStill] = useState(false);
  const hold = useRef({ hover: false, focus: false });
  const [tick, setTick] = useState(0);

  useEffect(() => setStill(prefersReducedMotion()), []);

  const go = (to: number) => {
    setActive(((to % count) + count) % count);
    setTick((t) => t + 1);
  };

  // The autoplay: one step after GALLERY_MS, restarted whenever it moves (by itself or by hand).
  useEffect(() => {
    if (still || count < 2) return;
    const id = window.setTimeout(() => {
      if (hold.current.hover || hold.current.focus) setTick((t) => t + 1);
      else setActive((a) => (a + 1) % count);
    }, GALLERY_MS);
    return () => window.clearTimeout(id);
  }, [active, tick, still, count]);

  const caption = (photo: (typeof campusGallery)[number], i: number) =>
    i === 0 ? `Vajiram & Ravi, ${city}` : photo.caption;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="The institute in photographs"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(active - 1);
        else if (event.key === "ArrowRight") go(active + 1);
      }}
      onPointerEnter={() => (hold.current.hover = true)}
      onPointerLeave={() => (hold.current.hover = false)}
      onFocus={() => (hold.current.focus = true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold.current.focus = false;
      }}
      className="relative overflow-clip rounded-[20px] bg-[#e8dccb] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burnt"
    >
      {/* The track: the photographs side by side, slid along to the shown one. */}
      <div
        className="flex h-full"
        style={{
          translate: `${-active * 100}% 0`,
          transition: still ? "none" : `translate ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
        }}
      >
        {campusGallery.map((photo, i) => {
          const on = i === active;
          return (
            <figure
              key={photo.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!on}
              inert={!on}
              className="relative h-full w-full shrink-0 overflow-clip"
            >
              {/* TODO: dummy photographs (see campusGallery); replace with each campus's own. */}
              <img
                src={photo.src}
                alt={i === 0 ? `The Vajiram & Ravi building, ${place}` : caption(photo, i)}
                width={photo.width}
                height={photo.height}
                loading={i === 0 ? undefined : "lazy"}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
                style={{
                  scale: on || still ? "1" : "1.06",
                  transition: still ? "none" : `scale ${SLIDE_MS + 500}ms cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              />
              {/* A dark wash up from the foot so the caption and the dots read on any photograph. */}
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-black/80 via-black/45 to-transparent" />
              <figcaption className="absolute bottom-7 left-7 text-white">
                <span className="block font-heading text-[22px]/[1.25] font-medium">{caption(photo, i)}</span>
                {i === 0 && <span className="mt-0.5 block text-[14px]/[20px] text-white/85">{place}</span>}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* The dots, at the foot on the right, over the photograph (no arrows, at the client's request). */}
      {count > 1 && (
        <div className="absolute right-7 bottom-8">
          <CarouselDots count={count} active={active} onSelect={go} label="Choose a photograph" itemName="Photograph" tone="dark" />
        </div>
      )}
    </div>
  );
}
