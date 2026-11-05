/** Success stories (Figma "Success stories", 2258:9790): one student's own words at a time. */
export const storiesIntro = {
  /** The centred eyebrow, shown in capitals. */
  eyebrow: "In their words",
  /** The section's name for assistive technology; the design shows only the eyebrow. */
  title: "Hear it from our students",
};

/** A student's own words, for the stories carousel. */
export type Story = {
  name: string;
  /** All India Rank. */
  rank: number;
  exam: string;
  /** Vajiram & Ravi programmes the student took, shown in the mono line under the name. */
  programme: string;
  quote: string;
  /** Cut-out portrait, shown in a round avatar on a peach backdrop inside an amber ring. */
  image: string;
};

export const stories: Story[] = [
  {
    name: "Anuj Agnihotri",
    rank: 1,
    exam: "CSE 2025",
    programme: "Interview Guidance Programme (IGP)",
    quote:
      "The mock interviews felt closer to the real board than anything else I tried. The feedback after each round was honest and specific.",
    image: "/images/toppers/anuj-agnihotri.webp",
  },
  {
    name: "Rajeshwari Suve M",
    rank: 2,
    exam: "CSE 2025",
    programme: "PowerUp Prelims Test Series, IGP, Mains Test Series",
    quote:
      "The test series showed me exactly where I was losing marks. By the last few papers I was finishing on time and still checking my answers.",
    image: "/images/toppers/rajeshwari-suve-m.webp",
  },
];
