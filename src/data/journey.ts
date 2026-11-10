/**
 * "UPSC preparation journey & academic support" (the client's homepage content of 10 Nov 2026, section 02):
 * the three stages of the examination as a path, Prelims → Mains → Personality Test, each with how the
 * institute supports it. There is no Figma frame for this section; see Journey/Journey.tsx.
 */

import { links, type Href } from "@/data/links";

export type StageId = "prelims" | "mains" | "interview";

/** One line of "How Vajiram supports you". */
export type SupportItem = {
  /** The bold run-in label, with its colon (the Personality Test's lines). */
  label?: string;
  text: string;
  /** Numbers in `text` set as Mukta figures; the words stay exactly as written. */
  figures?: string[];
};

export type JourneyStage = {
  id: StageId;
  /** The stage's number on the rail, "01" to "03". */
  number: string;
  /** The stage's name: the rail's label and the start of the title line ("Prelims – …"). */
  name: string;
  /** The rest of the title line, after the name and its dash. */
  title: string;
  description: string;
  support: SupportItem[];
  cta: { label: string; href: Href };
};

export const journeyIntro = {
  eyebrow: "YOUR PREPARATION, EVERY STEP OF THE WAY",
  /** The heading; its emphasis is set in orange italic. */
  heading: {
    lead: "From building your foundation to facing the final interview, prepare with",
    emphasis: "the right academic support.",
  },
  lead: "UPSC preparation doesn't stand still. As you move from one stage to the next, your preparation needs to evolve too. Vajiram & Ravi brings together structured teaching, focused study materials, regular assessments, answer evaluation and interview guidance to support you along the way.",
  /** The heading of each stage's support list. */
  supportLabel: "How Vajiram supports you",
  /** The stage rail's accessible name. */
  tabsLabel: "Preparation stages",
};

export const journeyStages: JourneyStage[] = [
  {
    id: "prelims",
    number: "01",
    name: "Prelims",
    title: "Build your foundation. Test your readiness.",
    description:
      "Start with a structured understanding of General Studies. Learn through subject-focused classes, strengthen your concepts with syllabus-aligned Yellow Books and bring current affairs into your preparation. Put your knowledge to the test through regular assessments and identify where you need to improve.",
    support: [
      { text: "300+ GS class lectures and 900+ teaching hours in the GS 2028 programme.", figures: ["300+", "900+"] },
      { text: "18 Yellow Books covering the General Studies syllabus.", figures: ["18"] },
      { text: "30 Prelims tests covering General Studies and Current Affairs.", figures: ["30"] },
    ],
    cta: { label: "Explore Prelims Preparation", href: links.gsCourse },
  },
  {
    id: "mains",
    number: "02",
    name: "Mains",
    title: "Turn what you know into strong answers.",
    description:
      "Knowing a subject is one thing. Expressing your understanding through clear, relevant and well-structured answers is another. Develop your answer-writing approach through focused practice, evaluate your performance and understand exactly where your answers need improvement.",
    support: [
      { text: "Structured answer-writing practice." },
      { text: "Sectional and full-length Mains tests." },
      { text: "Detailed evaluation and feedback." },
      { text: "Model answers and explanatory sessions." },
      { text: "Mentorship and post-test guidance through relevant programmes." },
    ],
    cta: { label: "Explore Mains Preparation", href: links.mainsTestSeries },
  },
  {
    id: "interview",
    number: "03",
    name: "Personality Test",
    title: "Prepare to present your perspective.",
    description:
      "Reaching the interview stage is a significant milestone. Now it's about presenting your knowledge, experiences and perspectives with clarity. Prepare to approach the Personality Test with greater confidence through focused guidance and practice.",
    support: [
      { label: "DAF Guidance:", text: "Guidance on your Detailed Application Form (DAF) and focused interview preparation." },
      { label: "Mock Interviews:", text: "Practice facing an interview panel and responding to questions." },
      { label: "Personalised Feedback:", text: "Understand your strengths and areas that need improvement." },
      { label: "Current Affairs Sessions:", text: "Strengthen your understanding of important national and international developments." },
    ],
    cta: { label: "Explore Interview Guidance", href: links.interviewGuidance },
  },
];
