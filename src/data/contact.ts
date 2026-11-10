/**
 * "Our locations" (Figma 2258:10026): the campus card with its city tabs, the metro note and the street map.
 * The campuses' addresses also fill the footer's contact block.
 */

import { contact } from "@/data/site";

/** A heading as the design sets it: upright words, then the italic emphasis. */
export type SplitHeading = { lead: string; em: string };

/**
 * Where the street map sits for a campus: a pan (px on the 1440 canvas) and a zoom applied to the one map
 * image, as a CSS transform about the map's centre. The image is 1471 × 624 in the 720 × 624 frame, so a
 * pan of up to 735 × scale − 360 sideways and 312 × (scale − 1) up or down keeps it covering the frame.
 */
export type MapView = { x: number; y: number; scale: number };

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
  /** The dark cartouche over the map. */
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
    map: { x: 330, y: -40, scale: 1.2 },
  },
];

export const locationsIntro = {
  eyebrow: "VISIT US",
  title: { lead: "Our ", em: "locations" } satisfies SplitHeading,
  text: "Meet a counsellor, see the classrooms and pick up the brochure — in New Delhi and Chennai.",
  tabsLabel: "Campus",
  /** The burnt label above the address (set in capitals). */
  label: "Location & Timing",
  landmarkPrefix: "Landmark: ",
  mapsCta: "View on maps",
};
