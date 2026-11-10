/**
 * "Our locations" (Contact/Locations): each campus's details and street map beside a gallery of the
 * institute. The campuses' addresses also fill the footer's contact block.
 */

import { contact } from "@/data/site";

/** A heading as the design sets it: upright words, then the italic emphasis. */
export type SplitHeading = { lead: string; em: string };

/**
 * Where the street map is centred for a campus, as a point on the map image (fractions of its width and
 * height), and whether to set a pin there: the drawing's own pin marks New Delhi, so it needs none.
 */
export type MapView = { focus: { x: number; y: number }; pin: boolean };

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
    map: { focus: { x: 0.79, y: 0.5 }, pin: false },
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
    map: { focus: { x: 0.3, y: 0.56 }, pin: true },
  },
];

/** A photograph in the campus gallery: its file and size, and its caption (the main one names the campus). */
export type GalleryPhoto = { src: string; width: number; height: number; caption: string };

/**
 * The campus gallery beside the details and map (feedback item 41): the building, then three views inside.
 * TODO: dummy photographs from the site's other sections, as the client allowed; replace them with each
 * campus's own (the building's front, a classroom in session, the library and a counselling or mentoring
 * room, for New Delhi and for Chennai) and give each campus its own set.
 */
export const campusGallery: GalleryPhoto[] = [
  { src: "/images/locations/campus-exterior.webp", width: 1024, height: 1024, caption: "The campus" },
  { src: "/images/programmes/featured-classroom.webp", width: 1024, height: 461, caption: "Classrooms" },
  { src: "/images/programmes/featured-library.webp", width: 1264, height: 848, caption: "Library" },
];

export const locationsIntro = {
  title: { lead: "Find us in ", em: "New Delhi and Chennai." } satisfies SplitHeading,
  text: "Meet with an academic counsellor, explore our classrooms and learn more about our programmes in person.",
  tabsLabel: "Campus",
  /** The card's heading. */
  label: "Location & timing",
  landmarkPrefix: "Landmark: ",
  mapsCta: "View on maps",
};
