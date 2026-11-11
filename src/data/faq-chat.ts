export type FaqEntry = { question: string; answer: string };

/** The FAQ band (Figma "11 · FAQ", 2392:7383; copy from the homepage content of 10 Nov 2026). */
export const faqIntro = {
  /** The heading, its last words in Mukta italic. */
  title: "Questions on your mind?",
  accent: "We've got answers.",
};

/**
 * The questions of the FAQ accordion, as the client wrote them. A question whose answer is not approved yet
 * can be given `answer: null`: it then stays off the page and out of the FAQPage schema.
 */
const faqs: Array<{ question: string; answer: string | null }> = [
  {
    question: "Which programmes does Vajiram & Ravi offer for UPSC preparation?",
    answer:
      "Vajiram & Ravi offers General Studies, optional subjects, test series, CSAT, current affairs, mentorship and interview guidance programmes.",
  },
  {
    question: "Are classroom and online learning options available?",
    answer:
      "Classroom and LIVE-Online learning options are available for selected programmes. Check the individual programme page for available learning modes.",
  },
  {
    question: "How do I choose the right programme?",
    answer:
      "Explore the programme details or request a counselling call to understand which programme aligns with your preparation stage and requirements.",
  },
  {
    question: "Does the General Studies programme cover both Prelims and Mains?",
    answer:
      "The General Studies Prelims-cum-Mains programme is designed to cover both stages. Its published features include classroom teaching, study material, tests and additional Mains support.",
  },
  {
    question: "Does Vajiram & Ravi provide study material?",
    answer:
      "Yes. The institute provides programme-specific study materials and also publishes free resources, current affairs updates and The Recitals.",
  },
  {
    question: "How can I find upcoming batch dates?",
    answer: "Visit the upcoming batches section to check commencement dates and programme details.",
  },
  {
    question: "How can I speak with an academic counsellor?",
    answer: "Submit the counselling request form on the homepage to connect with the academic team.",
  },
];

/** The questions with an approved answer: the only ones the page and its FAQPage schema show. */
export const faqEntries: FaqEntry[] = faqs.filter((faq): faq is FaqEntry => faq.answer !== null);
