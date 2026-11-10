import { links } from "@/data/links";

/** "Student stories & experiences" (IA 8; Figma "09 · Student Stories", 2392:5350). Copy: the client's homepage content, §08. */
export const storiesIntro = {
  eyebrow: "EXPERIENCES THAT SPEAK",
  /** The H2; the emphasis is its italic second beat. */
  heading: { lead: "Every preparation journey", emphasis: "has a story." },
  lead: "Every aspirant's journey is different. Hear from students who have experienced Vajiram & Ravi's teaching, academic resources and guidance, and learn what their preparation journey looked like.",
  /** Shown under the lead once the stories page exists (links.studentStories is null today). */
  cta: { label: "Watch Student Stories", href: links.studentStories },
};

/** A student's own words, on a postcard: the content asks each story for the name, year, rank and programme. */
export type Story = {
  name: string;
  /** All India Rank, where there is one: a student still preparing has none, and the card then leaves it out. */
  rank?: number;
  /** The examination, "CSE", on the postmark and in the line under the name. */
  exam: string;
  /** The examination year, under the exam on the postmark. */
  year: number;
  /** The Vajiram & Ravi programmes the student took. */
  programme: string;
  quote: string;
  /** Cut-out portrait (the toppers' own), shown as the postcard's stamp. */
  image: string;
};

// TODO: more stories (the content lists topper interviews, preparation journeys, programme-specific
// experiences and video testimonials); with more than two the row becomes a carousel by itself.
export const stories: Story[] = [
  {
    name: "Anuj Agnihotri",
    rank: 1,
    exam: "CSE",
    year: 2025,
    programme: "Interview Guidance Programme (IGP)",
    quote:
      "The mock interviews felt closer to the real board than anything else I tried. The feedback after each round was honest and specific.",
    image: "/images/toppers/anuj-agnihotri.webp",
  },
  {
    name: "Rajeshwari Suve M",
    rank: 2,
    exam: "CSE",
    year: 2025,
    programme: "PowerUp Prelims Test Series, IGP, Mains Test Series",
    quote:
      "The test series showed me exactly where I was losing marks. By the last few papers I was finishing on time and still checking my answers.",
    image: "/images/toppers/rajeshwari-suve-m.webp",
  },
];
