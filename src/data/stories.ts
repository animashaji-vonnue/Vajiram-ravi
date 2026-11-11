import { links } from "@/data/links";

/** "Student stories & experiences" (IA 8; Figma "09 · Student Stories", 2392:5350). Copy: the client's homepage content, §08. */
export const storiesIntro = {
  /** The H2 (the client's line of 11 Nov 2026); the emphasis, in colour, is who the stories are from. */
  heading: { lead: "The journeys of our", emphasis: "toppers and alumni,", after: "in their own words." },
  /** Shown under the heading once the stories page exists (links.studentStories is null today). */
  cta: { label: "Watch student stories", href: links.studentStories },
};

/** A student's own words, on a postcard: the content asks each story for the name, year, rank and programme. */
export type Story = {
  name: string;
  /** All India Rank: every card shows it once, in the postmark ("AIR" over it), not again under the name. */
  rank: number;
  /** The examination, "CSE", in the line under the name. */
  exam: string;
  /** The examination year, in the line under the name. */
  year: number;
  /** The Vajiram & Ravi programmes the student took. */
  programme: string;
  quote: string;
  /** Cut-out portrait (the toppers' own), shown as the postcard's stamp. */
  image: string;
};

// The first two are the toppers' stories; the four after them are dummy stories (TODO: placeholder names,
// words, photos and ranks, from the `kevin` branch's sample students, to be replaced with real ranked
// students' approved stories: topper interviews, preparation journeys, programme experiences). Their ranks
// and year are placeholders so every card carries a rank, as the client asked; they are not real results.
export const stories: Story[] = [
  {
    name: "Anuj Agnihotri",
    rank: 1,
    exam: "CSE",
    year: 2025,
    programme: "Interview guidance programme (IGP)",
    quote:
      "The mock interviews felt closer to the real board than anything else I tried. The feedback after each round was honest and specific.",
    image: "/images/toppers/anuj-agnihotri.webp",
  },
  {
    name: "Rajeshwari Suve M",
    rank: 2,
    exam: "CSE",
    year: 2025,
    programme: "PowerUp Prelims test series, IGP, Mains test series",
    quote:
      "The test series showed me exactly where I was losing marks. By the last few papers I was finishing on time and still checking my answers.",
    image: "/images/toppers/rajeshwari-suve-m.webp",
  },
  {
    name: "Aditi Rao",
    rank: 14,
    exam: "CSE",
    year: 2025,
    programme: "GS Prelims cum Mains classroom programme",
    quote: "Studying with a batch that took the syllabus as seriously as I did changed my pace. The weekly tests kept me honest about what I had really revised.",
    image: "/images/stories/aditi-rao.webp",
  },
  {
    name: "Karan Mehta",
    rank: 27,
    exam: "CSE",
    year: 2025,
    programme: "Sure Shot Mains test series",
    quote: "My answers used to run out of time and of structure. A few months of evaluated copies taught me to plan an answer before I wrote a word of it.",
    image: "/images/stories/karan-mehta.webp",
  },
  {
    name: "Rohit Verma",
    rank: 45,
    exam: "CSE",
    year: 2025,
    programme: "StepUp mentorship programme",
    quote: "Having a mentor look at my plan every fortnight meant I stopped collecting material and started finishing it.",
    image: "/images/stories/rohit-verma.webp",
  },
  {
    name: "Sneha Iyer",
    rank: 63,
    exam: "CSE",
    year: 2025,
    programme: "Optional subject programme · Sociology",
    quote: "The optional classes linked every thinker to the questions the paper actually asks. I finally knew what to leave out.",
    image: "/images/stories/sneha-iyer.webp",
  },
];
