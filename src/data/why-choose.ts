/**
 * "Why Vajiram & Ravi" (Figma "06 · Why Vajiram & Ravi", 2257:8718): a maroon textured band with the arched
 * Constitution photo and its badge on the left, and the heading over six invitation cards on the right.
 */

export type Reason = {
  title: string;
  description: string;
};

export const whyChoose = {
  eyebrow: "YOUR UPSC CSE SUCCESS STORY STARTS HERE",
  /** The heading; its emphasis is set in saffron italic. */
  heading: { lead: "From expert-led classes", emphasis: "to personalised mentorship" },
  lead: "Get the guidance, resources, and structured preparation you need to move closer to your dream of becoming a civil servant.",
  /** The arched photo. Its quote is part of the image, so the alt text carries it. */
  photo: {
    src: "/images/why-choose/constitution-arch.webp",
    alt: "A raised hand holding up a copy of the Constitution of India, with the words “The power of the people is greater than the people in power.”",
  },
  /** The orange badge at the photo's foot; the figure counts up. */
  badge: { figure: "50+", label: ["Years of experience", "since 1976"] },
};

/** Two columns, three rows, numbered 01 to 06 in reading order. */
export const reasons: Reason[] = [
  {
    title: "Proven track record",
    description: "Five decades of experience and a steady record of producing UPSC toppers.",
  },
  {
    title: "Expert faculty",
    description: "Learn from subject specialists for every GS paper, optional and the essay.",
  },
  {
    title: "Personal guidance",
    description: "A preparation plan shaped around your strengths and weak areas.",
  },
  {
    title: "Complete study material",
    description: "Detailed notes, test series and interview prep for every stage of the exam.",
  },
  {
    title: "Prime location",
    description: "Study at our campus in Old Rajinder Nagar, the heart of UPSC preparation in Delhi.",
  },
  {
    title: "Classroom or online",
    description: "Choose classroom or LIVE-Online for any course, and learn from anywhere.",
  },
];
