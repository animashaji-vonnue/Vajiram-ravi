/**
 * The hero: the toppers' slideshow panel (after the `kevin` branch's hero) and the results strip under it.
 * The headline, lead and buttons are the client's (homepage content, "01. Hero section"), word for word;
 * the panel's slides are the top three of UPSC CSE 2025.
 */

/** A run of the heading; `em` runs are set in white semibold (the rank keeps the saffron). */
export type HeadlineRun = { text: string; em?: boolean };

export const hero = {
  /**
   * "Your Civil Services ambition deserves a strong foundation. Build it with Vajiram & Ravi.", in the three
   * lines it is set in (each rises in on its own), the last as the emphasis.
   */
  headline: [
    [{ text: "Your Civil Services ambition " }],
    [{ text: "deserves a strong foundation. " }],
    [{ text: "Build it with Vajiram & Ravi.", em: true }],
  ] as HeadlineRun[][],
  lead: "Established in 1976, Vajiram & Ravi brings 50 years of experience in Civil Services preparation, offering expert guidance, structured programmes, comprehensive resources and flexible learning formats to support aspirants at every stage of their UPSC journey.",
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
