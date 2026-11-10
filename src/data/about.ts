/**
 * "About Vajiram & Ravi" (the client's homepage content of 10 Nov 2026, section 03): the heading, the lead,
 * then the six cards about the institution in the About coverflow.
 */

export const aboutIntro = {
  /**
   * The heading, one sentence (client feedback 16: the three sentences it was made "A" a capital twice),
   * in the client's words. The emphasis, its last beat, is set in the emphasis colour.
   */
  heading: {
    lead: "Five decades of experience, a dedicated academic team and",
    emphasis: "a legacy in Civil Services preparation.",
  },
  lead: "Since 1976, Vajiram & Ravi has built a strong academic foundation in Civil Services preparation, bringing together experienced subject specialists, dedicated educators and structured programmes to guide generations of aspirants.",
};

/** The line icons in the cards' medallions (About). */
export type InstitutionIcon = "trophy" | "faculty" | "mentor" | "books" | "location" | "modes";

/**
 * A card of the coverflow: its number (for order), icon, title and sentence, and its paper (the light
 * gradient it rests on while it is to the side, from Figma 2397:6766).
 */
export type InstitutionCard = { number: string; icon: InstitutionIcon; title: string; text: string; paper: [string, string] };

/**
 * The six cards, in the client's order and words (homepage copy of 14 Nov 2026).
 */
export const institutionCards: InstitutionCard[] = [
  {
    number: "01",
    icon: "trophy",
    title: "Proven track record",
    text: "With over five decades of experience, Vajiram & Ravi has consistently produced UPSC toppers, reflecting its commitment to academic excellence.",
    paper: ["#fff1d6", "#eeae68"],
  },
  {
    number: "02",
    icon: "faculty",
    title: "Distinguished faculty",
    text: "Learn from experienced subject specialists across General Studies, optional subjects and essay preparation.",
    paper: ["#fff6e6", "#f6c391"],
  },
  {
    number: "03",
    icon: "mentor",
    title: "Personalised learning",
    text: "Receive personalised mentorship from your first class through to your final interview.",
    paper: ["#ffefc9", "#f2b45a"],
  },
  {
    number: "04",
    icon: "books",
    title: "Comprehensive resources",
    text: "Access extensive study materials and current affairs resources to support your preparation across the UPSC syllabus.",
    paper: ["#fff3e3", "#f0a86c"],
  },
  {
    number: "05",
    icon: "location",
    title: "Centres in Delhi & Chennai",
    text: "Study at Vajiram & Ravi centres in New Delhi and Chennai, with dedicated spaces for Civil Services preparation.",
    paper: ["#fff3dd", "#f1b764"],
  },
  {
    number: "06",
    icon: "modes",
    title: "Flexible learning modes",
    text: "Choose between classroom programmes and LIVE-Online classes, with flexible learning options to suit your preparation needs.",
    paper: ["#f8ebd2", "#d6a15e"],
  },
];
