"use client";

import { useState, type ReactNode } from "react";
import CrossFade from "@/components/ui/CrossFade";
import Cta from "@/components/ui/Cta";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import { campuses, locationsIntro } from "@/data/contact";

const ART = "/images/locations";
const MAP = `${ART}/map`;
const ID = "locations";

/** The map tile: 634 × 308, the map image (1584 × 672) covering it a little enlarged. */
const FRAME = { w: 634, h: 308 };
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
 * "Our locations", on Figma "11 Location · concept D (photo grid)" (2541:5713) in the site's language: the
 * heading (the emphasis in orange) and lead with the city tabs beside them, then a grid of three tiles: on
 * the left a cream tile with the campus's name, address, landmark, hours and phone, and under it the street
 * map with "View on maps" over it; on the right a tall photograph of the institute, captioned.
 *
 * Motion: the heading and lead reveal with the page's text motion; the tiles rise in one after another.
 * Switching the city tab cross-fades the details and moves the map to the campus (300ms). The photograph
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
    <section id="locations" aria-labelledby="locations-h" className="relative bg-paper">
      <div className="mx-auto flex w-canvas flex-col gap-12 px-20 pt-10 pb-24">
        {/* The heading and lead, and the city tabs. */}
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
          <TraditionalTabs
            tabs={campuses.map((place) => ({ id: place.id, label: place.city }))}
            value={active}
            onChange={setActive}
            label={locationsIntro.tabsLabel}
            idPrefix={ID}
            className="mb-1 shrink-0"
          />
        </div>

        {/* The grid. */}
        <div id={`${ID}-panel`} role="tabpanel" aria-labelledby={`${ID}-tab-${active}`} data-stagger className="grid h-[620px] grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {/* The details tile. */}
            <div className="flex h-[300px] flex-col justify-between rounded-[20px] border border-[#eadbc4] bg-[#fbf3e6] p-9">
              <CrossFade id={campus.id} duration={300} className="flex flex-col gap-2.5">
                <p className="font-mono text-[12px]/[16px] tracking-[0.12em] text-burnt uppercase">{campus.city} centre</p>
                <h3 className="font-heading text-[26px]/[34px] font-medium text-ink">{campus.address}</h3>
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

            {/* The map tile, with "View on maps" over it. */}
            <div className="relative h-[308px] overflow-clip rounded-[20px] bg-[#ece8df]">
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

          {/* The photograph of the institute. */}
          <figure className="group/photo relative overflow-clip rounded-[20px] bg-[#e8dccb]">
            {/* TODO: placeholder photograph (Figma's); replace with each campus's own exterior. */}
            <img
              src={`${ART}/campus-exterior.webp`}
              alt=""
              width={1024}
              height={1024}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover [transition:scale_900ms_var(--ease-out)] group-hover/photo:scale-[1.04]"
            />
            <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/55 to-transparent" />
            <figcaption className="absolute bottom-6 left-6 text-white">
              <span className="block font-heading text-[18px]/[1.3] font-medium">Vajiram &amp; Ravi, {campus.city}</span>
              <span className="block text-[13px]/[18px] text-white/85">{campus.mapLabel}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
