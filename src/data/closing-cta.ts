/** The closing call to action: the sun rising over the skyline above the footer (Figma 2258:10076). */

import type { SplitHeading } from "@/data/contact";

export const closingCta = {
  /** Two lines: the question, then "with" and the emphasis. */
  title: { lead: "Ready to begin your UPSC preparation", em: "Vajiram & Ravi?" } satisfies SplitHeading,
  bridge: "with ",
  text: "Take a confident step towards your Civil Services goal with the right preparation, academic support and guidance at every stage.",
  primary: { label: "Explore Programmes", href: "#programmes" },
  secondary: { label: "Speak to an Academic Counsellor", href: "#counselling" },
};


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
