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

/**
 * Campus details come from the CMS on the live site (vajiramandravi.com/contact-vajiram-and-ravi). There is
 * one centre, in New Delhi (the client, 11 Nov 2026: there is no other).
 */
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

];

/** A photograph in the campus gallery: its file and size, and its caption (the main one names the campus). */
export type GalleryPhoto = { src: string; width: number; height: number; caption: string };

/**
 * The campus gallery beside the details and map (feedback item 41): the building, then three views inside (the client took the crowded classroom photo out).
 * TODO: dummy photographs from the site's other sections, as the client allowed; replace them with each
 * campus's own (the building's front, a classroom in session, the library and a counselling or mentoring
 * room).
 */
export const campusGallery: GalleryPhoto[] = [
  { src: "/images/locations/campus-exterior.webp", width: 1024, height: 1024, caption: "The campus" },
  { src: "/images/programmes/featured-library.webp", width: 1264, height: 848, caption: "Library" },
  { src: "/images/free-resources/lecture-wide.webp", width: 1200, height: 797, caption: "A class in session" },
  { src: "/images/programmes/flagship-lecture.webp", width: 1000, height: 1506, caption: "Discussion in class" },
];

export const locationsIntro = {
  /** The client's heading of 11 Nov 2026, with no lead under it. */
  title: { lead: "Where can you ", em: "find us?" } satisfies SplitHeading,
  /** The card's heading. */
  label: "Location & timing",
  landmarkPrefix: "Landmark: ",
  mapsCta: "View on maps",
};
