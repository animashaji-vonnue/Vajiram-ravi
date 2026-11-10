"use client";

import { useState, type ReactNode } from "react";
import CrossFade from "@/components/ui/CrossFade";
import Cta from "@/components/ui/Cta";
import { EyebrowLeft } from "@/components/ui/Ornament";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import { campuses, locationsIntro } from "@/data/contact";
import { cx } from "@/lib/cx";

const ART = "/images/locations";
const MAP = `${ART}/map`;
const ID = "locations";

/** The address card's content and the map's pan both move over 300ms (motion spec, city tabs). */
const SWITCH_MS = 300;
/** The zoom buttons step the map by a quarter, from as drawn up to twice the size. */
const ZOOM_STEP = 0.25;
const ZOOM_MAX = 2;
/** The map layer: the frame's size (the image covers it, 1280 × 543 at rest, about its centre). */
const FRAME = { w: 1280, h: 476 };
/** Where the drawn map's own pin (the New Delhi campus) stands on the layer at rest, px. */
const DRAWN_PIN = { x: 1010, y: 193 };

/** The Figma map's soft raised shadow ("Shadow/Raised") for the card and the zoom controls. */
const RAISED = "shadow-[0_10px_30px_-4px_rgba(28,25,23,0.07),0_1px_3px_0_rgba(28,25,23,0.05)]";

/** A row of the card: its icon (the Figma map's iconoir icons, 16px) and its text. */
function Row({ icon, children, top = false }: { icon: string; children: ReactNode; top?: boolean }) {
  return (
    <div className={cx("flex w-full gap-2", top ? "items-start" : "items-center")}>
      <img src={`${MAP}/${icon}.svg`} alt="" aria-hidden="true" width={16} height={16} className={cx("size-4 shrink-0", top && "mt-1")} />
      <div className="flex min-w-0 flex-1 flex-col gap-1 text-[16px]/[23px] font-medium text-clay">{children}</div>
    </div>
  );
}

/** A teardrop pin, as on the drawn map, for a campus the drawing does not mark. */
function Pin() {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 52" width={40} height={52} className="drop-shadow-[0_4px_4px_rgba(43,18,5,0.25)]">
      <path d="M20 2C10.06 2 2 10.06 2 20c0 13.5 18 30 18 30s18-16.5 18-30C38 10.06 29.94 2 20 2Z" fill="#f08a3c" stroke="#c9651c" strokeWidth="2" />
      <circle cx="20" cy="19" r="6.5" fill="#fff8ec" stroke="#c9651c" strokeWidth="2" />
    </svg>
  );
}

/**
 * "Our locations", on the layout of Figma 1901:47945: the heading row, then one wide rounded frame filled
 * with the street map, and over it, on the left, the white "Location & Timing" card (the city tabs, the
 * address with its landmark, the hours, the phone, and "View on maps", the site's button), with the zoom
 * buttons at the map's bottom right. The old map of India stays printed faintly into the paper behind.
 *
 * Motion spec: switching the city tab cross-fades the card's content and pans the map to the campus,
 * 300ms; the zoom buttons step the map in and out about the campus's pin. "View on maps" opens Google Maps in a new
 * tab. The map is decoration; the address and the maps link carry the information.
 */
export default function Locations() {
  const [active, setActive] = useState(campuses[0].id);
  const [zoom, setZoom] = useState(1);
  const campus = campuses.find((place) => place.id === active) ?? campuses[0];
  const { map } = campus;
  // The pin's point on the frame once the map is panned, which the zoom keeps in place.
  const pinAt = map.pin ? { x: map.pin.left, y: map.pin.top } : DRAWN_PIN;
  const focus = {
    x: FRAME.w / 2 + (pinAt.x - FRAME.w / 2) * map.scale + map.x,
    y: FRAME.h / 2 + (pinAt.y - FRAME.h / 2) * map.scale + map.y,
  };

  return (
    <section id="locations" data-curtain aria-labelledby="locations-h" className="relative overflow-hidden bg-[#ffefd5]">
      {/* The old map of India, printed faintly into the paper. */}
      <img
        src={`${ART}/old-india-map.webp`}
        alt=""
        aria-hidden="true"
        width={480}
        height={686}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute top-[-80px] left-[max(-120px,calc(50%-840px))] h-[994px] w-[760px] max-w-none object-cover opacity-[.0792] mix-blend-multiply"
      />

      <div className="relative mx-auto flex w-canvas flex-col gap-12 px-20 py-24">
        <div className="flex flex-col items-start gap-3">
          <EyebrowLeft>{locationsIntro.eyebrow}</EyebrowLeft>
          <h2 id="locations-h" data-split className="font-heading text-[56px]/[1.08] tracking-[-0.02em] whitespace-nowrap text-ink">
            {locationsIntro.title.lead}
            <em data-reveal-em className="text-orange italic">
              {locationsIntro.title.em}
            </em>
          </h2>
          <p data-words className="w-[560px] text-[17px]/[1.55] text-clay">
            {locationsIntro.text}
          </p>
        </div>

        {/* The map frame (Figma 1901:47945): 20px corners, 24px padding round the card. */}
        <div data-reveal className="relative flex min-h-[476px] w-full items-start overflow-clip rounded-[20px] bg-[#ece8df] p-6 shadow-[0_4px_8px_rgba(56,56,56,0.1)]">
          <div
            role="img"
            aria-label={`Street map: ${campus.mapLabel}`}
            className="absolute inset-0 [transition:transform_300ms_var(--ease-in-out),transform-origin_300ms_var(--ease-in-out)]"
            style={{ transform: `scale(${zoom})`, transformOrigin: `${focus.x}px ${focus.y}px` }}
          >
            <div
              className="absolute inset-0 [transition:transform_300ms_var(--ease-in-out)]"
              style={{ transform: `translate(${map.x}px, ${map.y}px) scale(${map.scale})` }}
            >
              <img src={`${MAP}/map.webp`} alt="" width={1584} height={672} loading="lazy" decoding="async" className="absolute inset-0 size-full max-w-none object-cover" />
              {map.pin && (
                <span className="absolute -translate-x-1/2 -translate-y-full" style={{ left: map.pin.left, top: map.pin.top }}>
                  <Pin />
                </span>
              )}
            </div>
          </div>

          {/* The card: the city tabs over the details, and the maps link at its foot. */}
          <div className={cx("relative flex min-h-[428px] w-[394px] flex-col items-start justify-between gap-6 rounded-2xl bg-white p-7", RAISED)}>
            <div className="flex flex-col items-start gap-4">
              <TraditionalTabs
                tabs={campuses.map((place) => ({ id: place.id, label: place.city }))}
                value={active}
                onChange={setActive}
                label={locationsIntro.tabsLabel}
                idPrefix={ID}
              />
              <div id={`${ID}-panel`} role="tabpanel" aria-labelledby={`${ID}-tab-${active}`} className="flex w-full flex-col items-start gap-4">
                <h3 className="font-heading text-[20px]/[27px] font-semibold text-ink">{locationsIntro.label}</h3>
                <CrossFade id={campus.id} duration={SWITCH_MS} className="flex w-full flex-col items-start gap-4">
                  <Row icon="icon-map-pin" top>
                    <p>{campus.address}</p>
                    {campus.landmark && (
                      <p>
                        {locationsIntro.landmarkPrefix}
                        {campus.landmark}
                      </p>
                    )}
                  </Row>
                  <Row icon="icon-clock">
                    <p>{campus.hours}</p>
                  </Row>
                  <Row icon="icon-phone">
                    <a href={campus.phoneHref} className="w-fit [transition:color_var(--dur-fast)_var(--ease-out)] hover:text-burnt">
                      {campus.phone}
                    </a>
                  </Row>
                </CrossFade>
              </div>
            </div>

            {/* "View on maps": the site's button (ui/Cta), as every call to action. */}
            <Cta
              variant="secondary"
              size="md"
              href={campus.mapsUrl}
              target="_blank"
              ariaLabel={`${locationsIntro.mapsCta}: ${campus.city} campus (opens in a new tab)`}
            >
              {locationsIntro.mapsCta}
            </Cta>
          </div>

          {/* The zoom buttons, bottom right. */}
          <div className={cx("absolute right-6 bottom-6 flex flex-col overflow-clip rounded-xl bg-white", RAISED)}>
            <button
              type="button"
              aria-label="Zoom in on the map"
              disabled={zoom >= ZOOM_MAX}
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              className="flex size-11 cursor-pointer items-center justify-center border-b border-[#e6e6e6] [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-cream disabled:cursor-default disabled:opacity-40"
            >
              <img src={`${MAP}/icon-plus.svg`} alt="" aria-hidden="true" width={22} height={22} className="size-[22px]" />
            </button>
            <button
              type="button"
              aria-label="Zoom out of the map"
              disabled={zoom <= 1}
              onClick={() => setZoom((z) => Math.max(1, z - ZOOM_STEP))}
              className="flex size-11 cursor-pointer items-center justify-center [transition:background-color_var(--dur-fast)_var(--ease-out)] hover:bg-cream disabled:cursor-default disabled:opacity-40"
            >
              <img src={`${MAP}/icon-minus.svg`} alt="" aria-hidden="true" width={22} height={22} className="size-[22px]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
