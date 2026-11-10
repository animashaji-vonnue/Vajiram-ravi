/**
 * The hero (Figma "01 · Hero", 2392:5234): the banner and the achievements bar under it. The copy is the
 * client's (homepage content, "01. Hero section"), word for word.
 */

/** A run of the heading; `em` runs are set in italic burnt orange. */
export type HeadlineRun = { text: string; em?: boolean };

export const hero = {
  eyebrow: "UPSC CIVIL SERVICES EXAMINATION PREPARATION",
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
};

export type Achievement = {
  /** The figure in the laurel; its number rolls in (ui/CountUp). */
  figure: string;
  /** Who or what it is. */
  name: string;
  exam: string;
};

/** The achievements bar's accessible name. */
export const achievementsLabel = "UPSC 2025 results";

/** The achievements bar, left to right. */
export const achievements: Achievement[] = [
  { figure: "AIR 1", name: "Anuj Agnihotri", exam: "UPSC 2025" },
  { figure: "AIR 2", name: "Rajeshwari Suve M", exam: "UPSC 2025" },
  { figure: "36/50", name: "Top 50 associates", exam: "UPSC 2025" },
];
