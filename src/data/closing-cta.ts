/** The closing call to action: the sun rising over the skyline above the footer (Figma 2258:10076). */

import type { SplitHeading } from "@/data/contact";
import { contact } from "@/data/site";

export const closingCta = {
  proof: "36/50 CSE 2025 RANKERS FROM V&R",
  title: { lead: "Ready to start your ", em: "UPSC preparation?" } satisfies SplitHeading,
  text: "Find the programme that fits your stage, or talk to a counsellor who will help you choose. No pressure to enrol.",
  primary: { label: "Find your course", href: "#courses" },
  secondary: { label: "Talk to a counsellor", href: "#counsellor" },
  call: { lead: "Prefer to call?", phone: contact.phone, phoneHref: contact.phoneHref, hours: contact.hours },
};

/** A silhouette of the skyline behind the sun: its box in the 1440 × 258.75 skyline band, in px, as drawn. */
export type Monument = { name: string; src: string; x: number; y: number; width: number; height: number };

/** The skyline from left to right. */
export const closingSkyline: Monument[] = [
  { name: "Qutub Minar", src: "/images/closing/skyline-qutub.svg", x: 0, y: 17.78, width: 51.5025, height: 240.975 },
  { name: "Gateway of India", src: "/images/closing/skyline-gateway.svg", x: 4.61, y: 98.32, width: 209.25, height: 160.425 },
  { name: "India Gate", src: "/images/closing/skyline-indiagate.svg", x: 161.77, y: 28.35, width: 154.8, height: 230.4 },
  { name: "Rashtrapati Bhavan", src: "/images/closing/skyline-rashtrapati.svg", x: 253.69, y: 153.45, width: 364.5, height: 105.3 },
  { name: "Sansad Bhavan", src: "/images/closing/skyline-sansad.svg", x: 566.1, y: 204.75, width: 318.6, height: 54 },
  { name: "Charminar", src: "/images/closing/skyline-charminar.svg", x: 829.01, y: 68.18, width: 210.375, height: 190.575 },
  { name: "Lotus Temple", src: "/images/closing/skyline-lotus.svg", x: 987.3, y: 163.13, width: 225, height: 95.625 },
  { name: "Gopuram", src: "/images/closing/skyline-gopuram.svg", x: 1171.46, y: 46.8, width: 135, height: 211.95 },
  { name: "Hawa Mahal", src: "/images/closing/skyline-hawa.svg", x: 1254.38, y: 76.84, width: 185.625, height: 181.912 },
];

/**
 * The halo rings around the sun, from the inside out: their file and the SVG's own size (the ring plus its
 * 1px stroke). They share one centre, 750px into the 1500px halo square. The design has twelve; the inner
 * four sit wholly below the band's foot, so only the eight that show are drawn.
 */
export const haloRings: { src: string; size: number }[] = [
  { src: "/images/closing/halo-ring-05.svg", size: 625.167 },
  { src: "/images/closing/halo-ring-06.svg", size: 750 },
  { src: "/images/closing/halo-ring-07.svg", size: 874.833 },
  { src: "/images/closing/halo-ring-08.svg", size: 999.667 },
  { src: "/images/closing/halo-ring-09.svg", size: 1124.5 },
  { src: "/images/closing/halo-ring-10.svg", size: 1249.33 },
  { src: "/images/closing/halo-ring-11.svg", size: 1374.17 },
  { src: "/images/closing/halo-ring-12.svg", size: 1499 },
];
