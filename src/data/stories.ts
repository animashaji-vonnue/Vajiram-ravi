import { links } from "@/data/links";

/** "Student stories & experiences" (IA 8; Figma "09 · Student Stories", 2392:5350). Copy: the client's homepage content, §08. */
export const storiesIntro = {
  /** The H2; the emphasis, in colour, is its closing beat: who the stories are from. */
  heading: { lead: "Their journeys, their words, from our", emphasis: "toppers and alumni." },
  lead: "Every aspirant has a different experience. Hear directly from our toppers, alumni and students about their preparation journey and how Vajiram & Ravi supported them along the way.",
  /** Shown under the lead once the stories page exists (links.studentStories is null today). */
  cta: { label: "Watch student stories", href: links.studentStories },
};

/** A student's own words, on a postcard: the content asks each story for the name, year, rank and programme. */
export type Story = {
  name: string;
  /**
   * All India Rank, where there is one: the postmark then reads "AIR" over it. A student still preparing has
   * none, and the card then leaves it out (the postmark shows the exam and its year instead).
   */
  rank?: number;
  /** The examination, "CSE", in the line under the name (and on the postmark when there is no rank). */
  exam: string;
  /** The examination year, in the line under the name (and under the exam on a postmark without a rank). */
  year: number;
  /** The Vajiram & Ravi programmes the student took. */
  programme: string;
  quote: string;
  /** Cut-out portrait (the toppers' own), shown as the postcard's stamp. */
  image: string;
};

// The first two are the toppers' stories; the four after them are dummy stories (TODO: placeholder names,
// words and photos, from the `kevin` branch's sample students, to be replaced with real students' approved
// stories: topper interviews, preparation journeys, programme experiences).
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
    exam: "CSE",
    year: 2026,
    programme: "GS Prelims cum Mains classroom programme",
    quote: "Studying with a batch that took the syllabus as seriously as I did changed my pace. The weekly tests kept me honest about what I had really revised.",
    image: "/images/stories/aditi-rao.webp",
  },
  {
    name: "Karan Mehta",
    exam: "CSE",
    year: 2026,
    programme: "Sure Shot Mains test series",
    quote: "My answers used to run out of time and of structure. A few months of evaluated copies taught me to plan an answer before I wrote a word of it.",
    image: "/images/stories/karan-mehta.webp",
  },
  {
    name: "Rohit Verma",
    exam: "CSE",
    year: 2026,
    programme: "StepUp mentorship programme",
    quote: "Having a mentor look at my plan every fortnight meant I stopped collecting material and started finishing it.",
    image: "/images/stories/rohit-verma.webp",
  },
  {
    name: "Sneha Iyer",
    exam: "CSE",
    year: 2026,
    programme: "Optional subject programme · Sociology",
    quote: "The optional classes linked every thinker to the questions the paper actually asks. I finally knew what to leave out.",
    image: "/images/stories/sneha-iyer.webp",
  },
];
