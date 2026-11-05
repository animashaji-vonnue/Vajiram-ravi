/**
 * The hero and the stats band under it (Figma "the final design": "01 Hero – Lady Justice niche (dark)",
 * 2256:5586, and "04 · Stats band", 2256:5656).
 */

import { links } from "@/data/links";
import { toppers } from "@/data/toppers";

export const heroIntro = {
  /** The ornament eyebrow above the heading (set in uppercase as drawn). */
  eyebrow: "SINCE 1976 · NEW DELHI · CHENNAI",
  headline: "Best IAS Coaching",
  /** The second line of the heading, in saffron italic. */
  accent: "in Delhi, India",
  lead: "For five decades, aspirants have trusted us to take them from their first class to the interview with experienced faculty, a structured method and honest guidance.",
  primary: { label: "Find your course", href: "#courses" },
  /** The postcard enquiry form. */
  secondary: { label: "Talk to a counsellor", href: "#counsellor" },
  // TODO: confirm the target with the client; a "how the preparation works" page could replace the GS programme section.
  newToUpsc: { text: "New to UPSC?", link: "See how the preparation works", href: "#gs-programme" },
};

export type HeroAvatar = { rank: number; name: string; image: string };

/**
 * The proof card on the statue's plinth: AIR 1 to 8 of UPSC CSE 2025 as avatars (the design's own
 * photos, which differ from the portrait cut-outs used elsewhere). Names and ranks come from the toppers
 * data. The card links to the selections page.
 */
export const heroProof = {
  eyebrow: "UPSC CSE 2025",
  title: "Ranks 1 to 10 all studied with us",
  href: links.toppers,
  avatars: toppers.slice(0, 8).map(
    (topper): HeroAvatar => ({ rank: topper.rank, name: topper.name, image: `/images/hero/avatars/air-${topper.rank}.webp` }),
  ),
};

export type HeroStat = {
  /** The figure as shown; its first number counts up (see CountUp). */
  value: string;
  label: string;
  /** Set in saffron instead of white, as drawn. */
  accent?: boolean;
};

/** The stats band, left to right. */
export const heroStats: HeroStat[] = [
  { value: "59", label: "Questions reflected in Prelims" },
  { value: "50+", label: "Years of experience since 1976" },
  { value: "10/10", label: "Top rankers from V&R courses", accent: true },
  { value: "36/50", label: "CSE 2025 rankers from V&R", accent: true },
];
