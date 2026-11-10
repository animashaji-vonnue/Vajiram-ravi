/**
 * "Our locations" (Figma 1901:47945): the "Location & Timing" card with its city tabs over the street map.
 * The campuses' addresses also fill the footer's contact block.
 */

import { contact } from "@/data/site";

/** A heading as the design sets it: upright words, then the italic emphasis. */
export type SplitHeading = { lead: string; em: string };

/**
 * Where the street map sits for a campus: a pan (px) and a zoom applied to the one map image, which covers
 * the 1280 × 476 frame (1280 × 543 at rest), about the frame's centre; at a zoom of s it can pan up to
 * 640 × (s − 1) sideways and 271 × s − 238 up or down. The drawing's own pin marks New Delhi;
 * `pin` places another (its tip, px on the frame before the pan) for a campus the drawing does not mark.
 */
export type MapView = { x: number; y: number; scale: number; pin?: { left: number; top: number } };

export type Campus = {
  /** Tab id. */
  id: string;
  city: string;
  address: string;
  /** Left out where the CMS has none: the landmark row then hides. */
  landmark?: string;
  /** The nearest metro station and its exit, a line under the address. Left out where there is none. */
  metro?: { label: string };
  hours: string;
  phone: string;
  phoneHref: string;
  mapsUrl: string;
  /** What the map shows, for the frame's accessible description. */
  mapLabel: string;
  map: MapView;
};

/** Campus details come from the CMS on the live site (vajiramandravi.com/contact-vajiram-and-ravi). */
export const campuses: Campus[] = [
  {
    id: "new-delhi",
    city: "New Delhi",
    address: "1-B/7, Pusa Road, Old Rajinder Nagar, New Delhi – 110060",
    landmark: "Adjacent to Gate 5, Karol Bagh Metro Station & Pillar no. 103",
    metro: { label: "Karol Bagh Metro · Gate 5 & Pillar no. 103" },
    hours: contact.hours,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060",
    mapLabel: "Old Rajinder Nagar, New Delhi",
    // As drawn.
    map: { x: 0, y: 0, scale: 1 },
  },
  {
    id: "chennai",
    city: "Chennai",
    address: "No. 63, Police Commissioner Office Road, Egmore, Chennai – 600008",
    // TODO: the CMS has no landmark or metro note for Chennai; confirm its hours match New Delhi's.
    hours: contact.hours,
    phone: "080-6220-6333",
    phoneHref: "tel:+918062206333",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+63+Police+Commissioner+Office+Road+Egmore+Chennai+600008",
    mapLabel: "Egmore, Chennai",
    // TODO: the design has one (placeholder) street map; replace this pan across it with a real Chennai map.
    // Panned so the drawing's own pin (New Delhi) leaves the frame; `pin` marks Chennai instead.
    map: { x: 190, y: 0, scale: 1.3, pin: { left: 617, top: 280 } },
  },
];

export const locationsIntro = {
  eyebrow: "VISIT US",
  title: { lead: "Our ", em: "locations" } satisfies SplitHeading,
  text: "Meet a counsellor, see the classrooms and pick up the brochure — in New Delhi and Chennai.",
  tabsLabel: "Campus",
  /** The card's heading. */
  label: "Location & Timing",
  landmarkPrefix: "Landmark: ",
  mapsCta: "View on maps",
};
