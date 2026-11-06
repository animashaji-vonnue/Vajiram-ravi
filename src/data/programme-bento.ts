import { links, type Href } from "@/data/links";

/**
 * "Featured UPSC CSE programmes" (final design "07 · Programmes", 2257:8844): the programme stages as tabs
 * (All / Learn / Practise / Guidance) over a 4 × 2 grid of illustrated cards, then a line pointing to a counsellor.
 */

export type Stage = "learn" | "practise" | "guidance";

export const stages: { id: Stage; label: string }[] = [
  { id: "learn", label: "Learn" },
  { id: "practise", label: "Practise" },
  { id: "guidance", label: "Guidance" },
];

export type BentoProgramme = {
  title: string;
  stage: Stage;
  modes: string;
  /** Shown after the modes as "N courses"; left out while the count is not confirmed. */
  courseCount?: number;
  /** The programme's page; null while it does not exist yet, and the card then renders without a link. */
  href: Href;
  /** The card's illustration of the course (public/images/courses/art, drawn to the card's 308 × 220 box). */
  art: string;
  /** The flagship card: a dark card with a saffron stage chip and the orange ↗ knob. */
  featured?: boolean;
};

const MODES = "Classroom · LIVE-Online";

/** The programmes in grid order. */
// TODO: confirm the course counts. The design shows them for the GS Foundation (4) and the optionals (26) only.
export const bentoProgrammes: BentoProgramme[] = [
  {
    title: "UPSC GS Foundation Course - PCM",
    stage: "learn",
    modes: MODES,
    courseCount: 4,
    href: links.gsCourse,
    art: "/images/courses/art/gs-foundation.svg",
    featured: true,
  },
  {
    title: "Optional Subject Programme",
    stage: "learn",
    modes: MODES,
    courseCount: 26,
    href: links.optionalSubject,
    art: "/images/courses/art/optional-subject.svg",
  },
  { title: "CSAT Course", stage: "learn", modes: MODES, href: links.csat, art: "/images/courses/art/csat.svg" },
  {
    title: "Prelims Test Series",
    stage: "practise",
    modes: MODES,
    href: links.prelimsTestSeries,
    art: "/images/courses/art/prelims-test-series.svg",
  },
  {
    title: "Mains Test Series",
    stage: "practise",
    modes: MODES,
    href: links.mainsTestSeries,
    art: "/images/courses/art/mains-test-series.svg",
  },
  {
    title: "Optional Test Series",
    stage: "practise",
    modes: MODES,
    href: links.optionalTestSeries,
    art: "/images/courses/art/optional-test-series.svg",
  },
  {
    title: "Mentorship Programme",
    stage: "guidance",
    modes: MODES,
    href: links.mentorship,
    art: "/images/courses/art/mentorship.svg",
  },
  {
    title: "Interview Guidance Programme",
    stage: "guidance",
    modes: MODES,
    href: links.interviewGuidance,
    art: "/images/courses/art/interview-guidance.svg",
  },
];

export const coursesIntro = {
  eyebrow: "FROM YOUR FIRST CLASS TO THE INTERVIEW",
  /** The heading, then its italic emphasis. */
  title: { lead: "Featured UPSC CSE", em: "programmes" },
  lead: "From your first GS class to the interview — pick the stage you’re at, then the programme.",
};

/** The line under the grid, pointing to a counsellor, and the full course list. */
export const counsellingLine = {
  text: "Not sure which programme fits? A counsellor can help you.",
  cta: { label: "Book a free session", href: "#counsellor" },
  viewAll: { label: "View all", href: links.allCourses as Href },
};
