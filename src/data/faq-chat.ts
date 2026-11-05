import { contact } from "./site";

export type FaqEntry = { question: string; answer: string };

/** The FAQ scroll (Figma "11 · FAQ — the scroll", 2258:9884). */
export const faqIntro = {
  /** The centred eyebrow, shown in capitals. */
  eyebrow: "Frequently asked",
  title: "Questions aspirants",
  /** The Newsreader italic words after the title. */
  accent: "ask us",
};

/** The line along the foot of the scroll, and its button to the enquiry form. */
export const faqFooter = {
  note: `Still have questions? A counsellor will listen and help you choose · ${contact.hours}`,
  cta: "Talk to a counsellor",
  /** The section holding the enquiry form. */
  href: "#counsellor",
};

/**
 * The questions of the FAQ accordion. The first answer is the design's; the others are the answers
 * vajiramandravi.com publishes for the same questions today. A question whose answer is not approved yet
 * has `answer: null` and stays off the page and out of the FAQPage schema.
 */
const faqs: Array<{ question: string; answer: string | null }> = [
  {
    question: "Which coaching is best for UPSC?",
    answer:
      "Vajiram & Ravi is renowned for its comprehensive and structured approach, making it one of the top choices for UPSC coaching in India.",
  },
  {
    question: "Which UPSC coaching is best in Delhi?",
    answer:
      "Vajiram & Ravi is considered one of the best UPSC coaching institutes in Delhi for its proven track record and effective teaching methods.",
  },
  {
    question: "Which coaching is best for IAS in Delhi?",
    answer:
      "Vajiram & Ravi is highly regarded as one of the best coaching institutes for IAS preparation in Delhi due to its expert faculty and comprehensive study materials.",
  },
  {
    question: "Which coaching institute has the most UPSC toppers?",
    answer:
      "Vajiram & Ravi is known for producing a significant number of UPSC toppers, reflecting its strong track record in IAS coaching.",
  },
];

/** The questions with an approved answer: the only ones the page and its FAQPage schema show. */
export const faqEntries: FaqEntry[] = faqs.filter((faq): faq is FaqEntry => faq.answer !== null);
