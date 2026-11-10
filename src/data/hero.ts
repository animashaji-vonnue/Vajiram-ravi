/**
 * The hero: the toppers' slideshow panel (after the `kevin` branch's hero) and the results strip under it.
 * The headline, lead and buttons are the client's (homepage content, "01. Hero section"), word for word;
 * the panel's slides are the top three of UPSC CSE 2025.
 */

/** A run of the heading; `em` runs are set in italic saffron. */
export type HeadlineRun = { text: string; em?: boolean };

export const hero = {
  /**
   * "You have the ambition. Now build the preparation to match it.", in the three lines it is set in (each
   * line rises in on its own), with "the preparation to match it" as the emphasis. Each line ends in a space
   * so the heading reads as one sentence; the space is not drawn at the end of a line.
   */
  headline: [
    [{ text: "You have the ambition. " }],
    [{ text: "Now build " }, { text: "the preparation", em: true }, { text: " " }],
    [{ text: "to match it", em: true }, { text: "." }],
  ] satisfies HeadlineRun[][],
  lead: "Prepare for the Civil Services Examination with experienced educators, structured programmes and focused academic guidance at every stage.",
  primary: { label: "Explore Programmes", href: "#programmes" },
  secondary: { label: "Get Expert Guidance", href: "#counselling" },
  /** The line under the panel, before the results. */
  statement: "Results that speak. Guidance that leads.",
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
  /** The figure; its number rolls in (ui/CountUp). */
  figure: string;
  /** What it counts. */
  label: string;
  /** The line under it. */
  text: string;
};

/** The results strip's accessible name. */
export const achievementsLabel = "Vajiram & Ravi at a glance";

/**
 * The strip under the panel, left to right, as the client asked (14 Nov 2026, after the `kevin` branch's
 * hero): the years since 1976, the top ten of CSE 2025, and 36 of its top 50.
 */
export const achievements: Achievement[] = [
  { figure: "50+", label: "Years of legacy", text: "Established in 1976" },
  { figure: "10 of 10", label: "Top ten ranks", text: "CSE 2025" },
  { figure: "36", label: "Of the top 50", text: "Ranks in CSE 2025" },
];
