"use client";

import { useState } from "react";
import CrossFade from "@/components/ui/CrossFade";
import IndianLink from "@/components/ui/IndianLink";
import { EyebrowLeft } from "@/components/ui/Ornament";
import Photo from "@/components/ui/Photo";
import TraditionalTabs from "@/components/ui/TraditionalTabs";
import { campuses, locationsIntro } from "@/data/contact";
import { cx } from "@/lib/cx";
import { useInView } from "@/lib/useInView";

const ART = "/images/locations";
const ID = "locations";

/** The address card's content and the map's pan both move over 300ms (motion spec, city tabs). */
const SWITCH_MS = 300;

/** The street map, 1584 × 672, scaled to cover the 720 × 624 frame: 1471 × 624, centred (as drawn). */
const MAP_W = 1470.86;

/**
 * "Our locations": the old map of India on the paper behind, the heading, the address card with its city
 * tabs, and the framed street map with its pin. Motion spec:
 *   - City tabs (traditional tabs): switching cross-fades the card's content and pans and zooms the map
 *     to the city, 300ms.
 *   - The nearest metro station and its exit are a line of text under the address, after a small station dot.
 *   - The map pin's ring pulses (scale 1 to 1.8, opacity 0.4 to 0, 2s) while the map is in view; it
 *     stays still with reduced motion.
 *   - "View on maps" opens Google Maps in a new tab.
 */
export default function Locations() {
  const [active, setActive] = useState(campuses[0].id);
  const campus = campuses.find((place) => place.id === active) ?? campuses[0];
  const [mapRef, mapInView] = useInView<HTMLDivElement>({ once: false });
  const { map } = campus;

  return (
    <section id="locations" aria-labelledby="locations-h" className="relative overflow-hidden bg-[#ffefd5]">
      <div className="relative mx-auto h-[834px] w-canvas">
        {/* The old map of India, printed faintly into the paper. */}
        <img
          src={`${ART}/old-india-map.webp`}
          alt=""
          aria-hidden="true"
          width={480}
          height={686}
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute top-[-80px] left-[-120px] h-[994px] w-[760px] max-w-none object-cover opacity-[.0792] mix-blend-multiply"
        />

        <div className="absolute top-24 left-20 flex w-[520px] flex-col items-start">
          <div className="flex flex-col items-start gap-3">
            <EyebrowLeft>{locationsIntro.eyebrow}</EyebrowLeft>
            <h2 id="locations-h" data-reveal="heading" className="font-serif text-[56px]/[1.08] tracking-[-0.02em] whitespace-nowrap text-ink">
              {locationsIntro.title.lead}
              <em data-reveal-em className="text-orange italic">
                {locationsIntro.title.em}
              </em>
            </h2>
            <p data-reveal="sub" className="w-[520px] text-[17px]/[1.55] text-clay">
              {locationsIntro.text}
            </p>
          </div>

          {/* The address card, 518 wide; it keeps New Delhi's height when a campus has fewer rows. */}
          <div
            data-reveal
            className="mt-[39px] flex min-h-[402px] w-[518px] flex-col items-start gap-4 rounded-2xl border border-burnt/55 bg-cream p-7 shadow-[0_16px_18px_rgba(43,18,5,0.14)]"
          >
            <TraditionalTabs
              tabs={campuses.map((place) => ({ id: place.id, label: place.city }))}
              value={active}
              onChange={setActive}
              label={locationsIntro.tabsLabel}
              idPrefix={ID}
            />
            <div id={`${ID}-panel`} role="tabpanel" aria-labelledby={`${ID}-tab-${active}`} className="flex flex-col items-start gap-4">
              <p className="text-[12px]/[16px] font-bold tracking-[1.44px] whitespace-nowrap text-burnt uppercase">{locationsIntro.label}</p>
              <CrossFade id={campus.id} duration={SWITCH_MS} className="flex flex-col items-start gap-4">
                <p className="w-[460px] font-serif text-[24px]/[30px] text-mahogany">{campus.address}</p>
                {campus.metro && (
                  <p className="flex w-[460px] items-center gap-2 text-[14px]/[20px] font-bold text-mahogany">
                    <svg aria-hidden="true" viewBox="0 0 12 12" width={12} height={12} className="shrink-0">
                      <circle cx="6" cy="6" r="4.5" fill="#fff8ec" stroke="#cc5500" strokeWidth="2" />
                    </svg>
                    {campus.metro.label}
                  </p>
                )}
                {campus.landmark && (
                  <p className="w-[460px] text-[14px]/[20px] font-medium text-clay">
                    {locationsIntro.landmarkPrefix}
                    {campus.landmark}
                  </p>
                )}
                <p className="flex items-start gap-6 text-[14px]/[20px] font-bold whitespace-nowrap text-mahogany">
                  <span>{campus.hours}</span>
                  <a href={campus.phoneHref} className="[transition:color_var(--dur-fast)_var(--ease-out)] hover:text-burnt">
                    {campus.phone}
                  </a>
                </p>
                <IndianLink tone="light" href={campus.mapsUrl} target="_blank" ariaLabel={`${locationsIntro.mapsCta}: ${campus.city} campus (opens in a new tab)`}>
                  {locationsIntro.mapsCta}
                </IndianLink>
              </CrossFade>
            </div>
          </div>
        </div>

        {/* The framed street map, 720 × 624, with its ornamental corners, the place label and the pin. */}
        <div ref={mapRef} data-reveal role="img" aria-label={`Street map: ${campus.mapLabel}`} className="absolute top-24 left-[640px] h-[624px] w-[720px]">
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-[#ffefd5]">
            <div
              className="absolute top-0 h-[624px] [transition:transform_300ms_var(--ease-in-out)]"
              style={{
                left: (720 - MAP_W) / 2,
                width: MAP_W,
                transform: `translate(${map.x}px, ${map.y}px) scale(${map.scale})`,
              }}
            >
              <Photo src={`${ART}/street-map.webp`} alt="" sizes="1471px" className="absolute inset-0 bg-[#ffefd5]" />
            </div>
          </div>
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl border border-burnt/60" />

          <img
            src={`${ART}/ornamental-corners.svg`}
            alt=""
            aria-hidden="true"
            width={745.5}
            height={649.5}
            className="pointer-events-none absolute top-[-12.75px] left-[-12.75px] h-[649.5px] w-[745.5px] max-w-none"
          />
          {[
            [-18, -18],
            [726, -18],
            [-18, 630],
            [726, 630],
          ].map(([x, y]) => (
            <img
              key={`${x},${y}`}
              src={`${ART}/corner-diamond.svg`}
              alt=""
              aria-hidden="true"
              width={12}
              height={12}
              className="absolute size-3 max-w-none"
              style={{ left: x, top: y }}
            />
          ))}

          {/* The place label: a dark cartouche, its text in the space between the curled ends. */}
          <div aria-hidden="true" className="absolute top-6 left-6 h-10 w-[280px]">
            <img src={`${ART}/cartouche.svg`} alt="" width={280} height={40} className="absolute inset-0 h-10 w-[280px] max-w-none" />
            <CrossFade id={campus.id} duration={SWITCH_MS} className="absolute inset-y-0 right-[58px] left-[45px] flex items-center justify-center">
              <span className="text-[13px]/[18px] font-bold whitespace-nowrap text-saffron">{campus.mapLabel}</span>
            </CrossFade>
          </div>

          {/* The pin with its two soft halos, and the ring that pulses out of it while the map is in view. */}
          <img src={`${ART}/pin-halo-outer.svg`} alt="" aria-hidden="true" width={112} height={112} className="absolute top-[287.2px] left-[376px] size-28 max-w-none" />
          <img src={`${ART}/pin-halo-inner.svg`} alt="" aria-hidden="true" width={68} height={68} className="absolute top-[309.2px] left-[398px] size-[68px] max-w-none" />
          <span
            aria-hidden="true"
            className={cx("absolute top-[320.2px] left-[409px] size-[46px] rounded-full bg-[#ec5800] opacity-0", mapInView && "motion-safe:animate-pulse-ring")}
          />
          <span
            aria-hidden="true"
            className="absolute top-[320.2px] left-[409px] size-[46px] rounded-full border-3 border-white bg-[#ec5800] shadow-[0_6px_6px_rgba(43,18,5,0.3)]"
          >
            <img src={`${ART}/icon-map-pin.svg`} alt="" width={20} height={20} className="absolute top-2.5 left-2.5 size-5 max-w-none" />
          </span>
        </div>
      </div>
    </section>
  );
}
