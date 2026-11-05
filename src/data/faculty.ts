import type { Href } from "@/data/links";

/** "Learn from top educators" (Figma "10 · Faculty — subject gurus", 2271:10583). */

export const facultyIntro = {
  eyebrow: "THE FACULTY",
  heading: { lead: "Learn from", emphasis: "top educators" },
  lead: "Subject specialists for every GS paper, the essay, the optionals and the interview.",
  profile: "View profile",
};

export type Educator = {
  name: string;
  /** The short chip above the name, e.g. "GS", "ESSAY". */
  subject: string;
  /** What they teach, under the name. */
  focus: string;
  /** The design's arch-cut portrait (176 × 220 at 2×, transparent outside the arch). */
  photo: string;
  /** The educator's profile page; null while it does not exist (the card then stays still). */
  profile: Href;
};

// TODO: profile pages for the faculty (vajiramandravi.com has none yet), and more educators; the carousel
// arrows and its progress line come alive once there are more than six.
export const educators: Educator[] = [
  { name: "SK Manocha", subject: "GS", focus: "General Studies · Polity & Governance", photo: "/images/faculty/sk-manocha.webp", profile: null },
  { name: "Brijender Singh", subject: "Essay", focus: "Essay", photo: "/images/faculty/brijender-singh.webp", profile: null },
  { name: "Md. Rizwan", subject: "Geography", focus: "Geography optional", photo: "/images/faculty/md-rizwan.webp", profile: null },
  { name: "Md. Tarique", subject: "History", focus: "History optional", photo: "/images/faculty/md-tarique.webp", profile: null },
  { name: "Mukul Pathak", subject: "Psychology", focus: "Psychology optional", photo: "/images/faculty/mukul-pathak.webp", profile: null },
  { name: "Shyam Sundar", subject: "Economics", focus: "Economics optional", photo: "/images/faculty/shyam-sundar.webp", profile: null },
];
