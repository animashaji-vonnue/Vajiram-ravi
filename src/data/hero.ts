/**
 * The hero: the toppers' slideshow panel (after the `kevin` branch's hero) and the results strip under it.
 * The headline, lead and buttons are the client's (homepage content, "01. Hero section"), word for word;
 * the panel's slides are the top three of UPSC CSE 2025.
 */

/** A run of the heading; `em` runs are set in a warm cream, in the heading's one weight (the rank keeps the saffron). */
export type HeadlineRun = { text: string; em?: boolean };

export const hero = {
  /**
   * "Prepare for the UPSC with the institute behind India's top rank-holders." (the client's line of 11 Nov
   * 2026), in the three lines it is set in (each rises in on its own), the last as the emphasis.
   */
  headline: [
    [{ text: "Prepare for the UPSC with " }],
    [{ text: "the institute behind " }],
    [{ text: "India’s top rank-holders.", em: true }],
  ] as HeadlineRun[][],
  lead: "Since 1976, Vajiram & Ravi has brought 50 years of Civil Services teaching experience to your preparation, with expert faculty, structured programmes, comprehensive study resources and flexible learning options.",
  primary: { label: "Explore programmes", href: "#programmes" },
  secondary: { label: "Get expert guidance", href: "#counselling" },
};

/** A topper in the panel's slideshow. */
export type HeroSlide = {
  rank: number;
  name: string;
  year: number;
  /** A wide portrait, the topper standing right of centre (1920 × 822). */
  photo: string;
};

/** The top three of UPSC CSE 2025, in rank order. */
export const heroSlides: HeroSlide[] = [
  { rank: 1, name: "Anuj Agnihotri", year: 2025, photo: "/images/hero/slide-anuj-agnihotri.webp" },
  { rank: 2, name: "Rajeshwari Suve M", year: 2025, photo: "/images/hero/slide-rajeshwari-suve-m.webp" },
  { rank: 3, name: "Akansh Dhull", year: 2025, photo: "/images/hero/slide-akansh-dhull.webp" },
];

export type Achievement = {
  /** The figure in the laurel; its number rolls in (ui/CountUp). */
  figure: string;
  /** What it counts, beside the laurel. */
  text: string;
};

/** The results strip's accessible name. */
export const achievementsLabel = "Vajiram & Ravi at a glance";

/** The strip under the panel, left to right: the four points of Figma "stats bar" (2425:51305), as written there. */
export const achievements: Achievement[] = [
  { figure: "50+", text: "Years of experience since 1976" },
  { figure: "59", text: "Questions reflected in Prelims" },
  { figure: "10/10", text: "Top rankers from V&R courses" },
  { figure: "36/50", text: "CSE 2025 rankers from V&R" },
];
