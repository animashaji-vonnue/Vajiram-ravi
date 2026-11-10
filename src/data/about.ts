/**
 * "About Vajiram & Ravi" (the client's homepage content of 10 Nov 2026, section 03), laid out on the Figma
 * frame "07 · Why Students Choose V&R" (2377:4515): a centred heading, an arc carousel of seven cards (the
 * four institutional facts and the ways of learning: classrooms in New Delhi and Chennai, and LIVE-Online), where the preparation can lead, and a link to
 * the about page.
 */

import { links } from "@/data/links";

/** The line icons the cards' medallions carry (About/ArcCard). */
export type AboutIcon = "diya" | "educators" | "book" | "careers" | "classroom" | "online";

/**
 * A card of the arc, each led by the scalloped medallion with its icon: a fact, with its figure under the
 * medallion, or a way of learning.
 */
export type AboutCard =
  | { kind: "fact"; icon: AboutIcon; figure: string; title: string; text: string }
  | { kind: "mode"; icon: AboutIcon; title: string; text: string };

export const aboutIntro = {
  eyebrow: "THE INSTITUTION BEHIND YOUR PREPARATION",
  /** The heading in two sentences' lines; the second line is set in orange italic. */
  heading: {
    lead: "Decades of experience. A dedicated academic team.",
    emphasis: "A legacy in Civil Services preparation.",
  },
  lead: "Since 1976, Vajiram & Ravi has guided aspirants preparing for the Civil Services Examination. Its academic foundation brings together experienced subject specialists, dedicated educators and structured preparation programmes.",
  /** The carousel's accessible name, and what one card is called ("Card 2 of 7"). */
  carouselLabel: "Vajiram & Ravi at a glance",
  itemName: "Card",
};

/** In reading order: the institutional facts, then "Learning with Vajiram & Ravi". The first starts at the centre. */
export const aboutCards: AboutCard[] = [
  { kind: "fact", icon: "diya", figure: "1976", title: "Established", text: "Founded by Professor P. Velayutham." },
  { kind: "fact", icon: "educators", figure: "~30", title: "GS Educators & Mentors", text: "Dedicated academic team for General Studies." },
  { kind: "fact", icon: "book", figure: "2+", title: "Subject Specialists", text: "Minimum of two specialists for each subject, as stated by the institute." },
  {
    kind: "fact",
    icon: "careers",
    figure: "Thousands",
    title: "Civil Services Careers",
    text: "Candidates supported by the institute have gone on to serve in various Central Services.",
  },
  {
    kind: "mode",
    icon: "classroom",
    title: "Classroom Learning",
    text: "Prepare at the institute in Old Rajinder Nagar, New Delhi, through its classroom programmes.",
  },
  {
    kind: "mode",
    icon: "classroom",
    title: "Chennai Campus",
    // TODO: written to match the New Delhi card; confirm with the client which programmes Chennai runs.
    text: "Prepare at the institute in Egmore, Chennai, through its classroom programmes.",
  },
  {
    kind: "mode",
    icon: "online",
    title: "LIVE-Online Learning",
    text: "Access live teaching and relevant academic resources through the institute's online programmes.",
  },
];

/**
 * The button under the carousel, to the about page. (The client took out the "Where can Civil Services
 * preparation lead?" banner that stood here, 13 Nov 2026.)
 */
export const aboutCta = { label: "Discover Vajiram & Ravi", href: links.aboutUs };
