/**
 * "What are you looking for?" (Figma 2258:9941): the four ways to reach V&R, and "Our locations"
 * (2258:10026): the campus card with its city tabs, the metro line and the street map.
 */

import { links } from "@/data/links";
import { contact } from "@/data/site";

/** A heading as the design sets it: upright words, then the italic emphasis. */
export type SplitHeading = { lead: string; em: string };

export const contactIntro = {
  eyebrow: "CONTACT US",
  title: { lead: "What are you ", em: "looking for?" } satisfies SplitHeading,
  lead: "We’re here to help you anytime, any way",
};

/** The icon inside a card's scalloped medallion (iconoir, from the design). */
export type ContactIcon = "graduation-cap" | "whatsapp" | "mail" | "phone";

export type ContactWay = {
  title: string;
  text: string;
  /** The Indian link at the card's foot. */
  cta: string;
  href: string;
  icon: ContactIcon;
  /** Opens in a new tab (WhatsApp). */
  external?: boolean;
  /** The dark card (the last one); the others are cream. */
  dark?: boolean;
};

export const contactWays: ContactWay[] = [
  {
    title: "Course counselling",
    text: "Not sure which programme fits? A counsellor can help you.",
    cta: "Book a free session",
    // The free-session form sits in the admissions section, under the batches.
    href: "#counsellor",
    icon: "graduation-cap",
  },
  {
    title: "Chat on WhatsApp",
    text: "Quick answers on courses, batches and fees from our admissions team.",
    cta: "Chat on WhatsApp",
    href: links.whatsapp,
    icon: "whatsapp",
    external: true,
  },
  {
    title: "Email us",
    text: `Write to us on: ${contact.email}`,
    cta: "Send an email",
    href: `mailto:${contact.email}`,
    icon: "mail",
  },
  {
    title: "Talk to us",
    text: `Contact us on: ${contact.phone}`,
    cta: "Call now",
    href: contact.phoneHref,
    icon: "phone",
    dark: true,
  },
];

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
