"use client";

import { useState, type ReactNode } from "react";
import CrossFade from "@/components/ui/CrossFade";
import Cta from "@/components/ui/Cta";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import { campusGallery, campuses, locationsIntro } from "@/data/contact";

const ART = "/images/locations";
const MAP = `${ART}/map`;
const ID = "locations";

/** The map tile: 634 × 196, the map image (1584 × 672) covering it a little enlarged. */
const FRAME = { w: 634, h: 196 };
const COVER = Math.max(FRAME.w / 1584, FRAME.h / 672) * 1.15;
const IMAGE = { w: 1584 * COVER, h: 672 * COVER };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

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
 * 41): the heading (the emphasis in orange) and lead, then a 460px grid. On the left a cream tile with
 * the city tabs at its head beside the centre's name, then the address, landmark, hours and phone, and
 * under it the street map with "View on maps" over it; on the right a bento gallery of the institute
 * (Gallery).
 *
 * Motion: the heading and lead reveal with the page's text motion; the tiles rise in one after another.
 * Switching the city tab cross-fades the details and moves the map to the campus (300ms). Each photograph
 * eases in a little closer on hover. "View on maps" opens Google Maps in a new tab.
 */
export default function Locations() {
  const [active, setActive] = useState(campuses[0].id);
  const campus = campuses.find((place) => place.id === active) ?? campuses[0];
  const { focus, pin } = campus.map;
  const point = { x: focus.x * IMAGE.w, y: focus.y * IMAGE.h };
  const left = clamp(FRAME.w / 2 - point.x, FRAME.w - IMAGE.w, 0);
  const top = clamp(FRAME.h / 2 - point.y, FRAME.h - IMAGE.h, 0);
  const { title } = locationsIntro;

  return (
    <section id="locations" aria-labelledby="locations-h" className="relative bg-cream">
      <div className="mx-auto flex w-canvas flex-col gap-12 px-20 pt-10 pb-24">
        {/* The heading and lead. */}
        <div className="flex items-end justify-between gap-10">
          <div className="flex w-[820px] flex-col gap-4">
            <h2 id="locations-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] text-ink">
              {title.lead}
              <em data-reveal-em className="text-orange italic">
                {title.em}
              </em>
            </h2>
            <p data-words className="w-[640px] text-[17px]/[1.55] text-clay">
              {locationsIntro.text}
            </p>
          </div>
        </div>

        {/* The grid. */}
        <div data-stagger className="grid h-[460px] grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {/* The details tile: the city tabs at its head, then the chosen campus's details. */}
            <div className="flex h-[252px] shrink-0 flex-col rounded-[20px] border border-[#eadbc4] bg-[#fbf3e6] px-9 pt-6 pb-7">
              <div className="flex items-center justify-between gap-6">
                <CrossFade id={campus.id} duration={300}>
                  <p className="font-mono text-[12px]/[16px] tracking-[0.01em] text-burnt">{campus.city} centre</p>
                </CrossFade>
                <TraditionalTabs
                  tabs={campuses.map((place) => ({ id: place.id, label: place.city }))}
                  value={active}
                  onChange={setActive}
                  label={locationsIntro.tabsLabel}
                  idPrefix={ID}
                  className="shrink-0"
                />
              </div>
              <div id={`${ID}-panel`} role="tabpanel" aria-labelledby={`${ID}-tab-${active}`} className="mt-3 flex flex-1 flex-col justify-between">
              <CrossFade id={campus.id} duration={300} className="flex flex-col gap-2">
                <h3 className="font-heading text-[24px]/[31px] font-medium text-ink">{campus.address}</h3>
                {campus.landmark && (
                  <p className="text-[16px]/[24px] text-clay">
                    {locationsIntro.landmarkPrefix}
                    {campus.landmark}
                  </p>
                )}
              </CrossFade>
              <CrossFade id={campus.id} duration={300} className="flex items-center gap-8">
                <Fact icon="icon-clock">{campus.hours}</Fact>
                <Fact icon="icon-phone">
                  <a href={campus.phoneHref} className="[transition:color_var(--dur-fast)_var(--ease-out)] hover:text-burnt">
                    {campus.phone}
                  </a>
                </Fact>
              </CrossFade>
              </div>
            </div>

            {/* The map tile, with "View on maps" over it. */}
            <div className="relative min-h-0 flex-1 overflow-clip rounded-[20px] bg-[#ece8df]">
              <div
                role="img"
                aria-label={`Street map: ${campus.mapLabel}`}
                className="absolute [transition:left_300ms_var(--ease-in-out),top_300ms_var(--ease-in-out)]"
                style={{ left, top, width: IMAGE.w, height: IMAGE.h }}
              >
                <img src={`${MAP}/map.webp`} alt="" width={1584} height={672} loading="lazy" decoding="async" className="size-full max-w-none" />
                {pin && (
                  <span className="absolute -translate-x-1/2 -translate-y-full" style={{ left: point.x, top: point.y + 6 }}>
                    <Pin />
                  </span>
                )}
              </div>
              <div className="absolute bottom-6 left-6 shadow-[0_10px_24px_-8px_rgb(43_18_5/0.45)]">
                <Cta variant="ink" size="lg" href={campus.mapsUrl} target="_blank" ariaLabel={`${locationsIntro.mapsCta}: ${campus.city} campus (opens in a new tab)`}>
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

/** Where each photo sits in the gallery's 4 × 2 grid: the building tall at the left, then two wide ones stacked. */
const TILES = ["col-span-2 row-span-2", "col-span-2", "col-span-2"];

/**
 * The gallery: a bento of three photographs of the institute in the right half of the grid (the building,
 * the classrooms and the library), each captioned
 * at its foot over a soft shade and easing in a little closer on hover (the shade deepens with it). The
 * first, the building, is captioned with the campus and its place. As the grid comes into view the
 * photographs are uncovered from their foot up one after another, settling from a little large (ui/
 * TextMotion, data-wipe), and they drift in their frames with the scroll (data-par). With reduced motion
 * the zoom, the wipe and the drift are off.
 */
function Gallery({ city, place }: { city: string; place: string }) {
  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-3">
      {campusGallery.map((photo, i) => (
        <figure
          key={photo.src}
          data-wipe
          data-wipe-delay={160 + i * 140}
          className={`group/photo relative overflow-clip rounded-[20px] bg-[#e8dccb] ${TILES[i] ?? ""}`}
        >
          {/* TODO: dummy photographs (see campusGallery); replace with each campus's own. */}
          <div data-par className="absolute inset-x-0 -inset-y-[7%]">
          <img
            src={photo.src}
            alt=""
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover [transition:scale_900ms_var(--ease-out)] group-hover/photo:scale-[1.06] motion-reduce:group-hover/photo:scale-100"
          />
          </div>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/60 to-transparent opacity-85 [transition:opacity_var(--dur-base)_var(--ease-out)] group-hover/photo:opacity-100"
          />
          <figcaption className={`absolute text-white ${i === 0 ? "bottom-6 left-6" : "bottom-4 left-4"}`}>
            {i === 0 ? (
              <>
                <span className="block font-heading text-[18px]/[1.3] font-medium">Vajiram &amp; Ravi, {city}</span>
                <span className="block text-[13px]/[18px] text-white/85">{place}</span>
              </>
            ) : (
              <span className="block font-heading text-[15px]/[1.3] font-medium">{photo.caption}</span>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
