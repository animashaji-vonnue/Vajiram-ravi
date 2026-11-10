/**
 * "UPSC preparation journey & academic support" (the client's homepage content of 10 Nov 2026, section 02):
 * the three stages of the examination as a path, Prelims → Mains → Interview, each with how the
 * institute supports it. There is no Figma frame for this section; see Journey/Journey.tsx.
 */

import { links, type Href } from "@/data/links";

export type StageId = "prelims" | "mains" | "interview";

/** One line of "How Vajiram supports you". */
export type SupportItem = {
  /** The bold run-in label, with its colon (the Interview's lines). */
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
  /** The heading; its emphasis is set in orange italic. */
  heading: {
    lead: "Guidance at every stage of",
    emphasis: "your UPSC journey.",
  },
  lead: "From Prelims to Mains and the Personality Test, Vajiram & Ravi brings together structured teaching, focused study materials, regular assessments and expert guidance to support your preparation throughout the journey.",
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
      "Build a strong foundation in General Studies through subject-focused classes and syllabus-aligned Yellow Books. Strengthen your understanding with current affairs and regular assessments that help you evaluate your preparation and identify areas for improvement.",
    support: [
      { text: "300+ General Studies class lectures and 900+ teaching hours in the GS 2028 programme.", figures: ["300+", "900+"] },
      { text: "18 Yellow Books covering the General Studies syllabus.", figures: ["18"] },
      { text: "30 Prelims tests covering General Studies and Current Affairs.", figures: ["30"] },
    ],
    cta: { label: "Explore Prelims Preparation", href: links.gsCourse },
  },
  {
    id: "mains",
    number: "02",
    name: "Mains",
    title: "Turn your knowledge into well-structured answers.",
    description:
      "Go beyond understanding concepts to expressing them effectively. Develop your answer-writing skills through focused practice, regular evaluation and expert feedback. Identify gaps in your approach and learn to write clear, relevant and well-structured answers.",
    support: [
      { text: "Structured answer-writing practice." },
      { text: "Sectional and full-length Mains tests." },
      { text: "Detailed evaluation and personalised feedback." },
      { text: "Model answers and explanatory sessions." },
      { text: "One-to-one mentorship and post-test guidance." },
    ],
    cta: { label: "Explore Mains Preparation", href: links.mainsTestSeries },
  },
  {
    id: "interview",
    number: "03",
    name: "Interview",
    title: "Present your knowledge with confidence.",
    description:
      "Communicate your knowledge, experiences and perspectives with clarity through focused guidance, mock interviews and expert feedback. Build the confidence to present yourself effectively before the interview board.",
    support: [
      { label: "DAF Guidance:", text: "Assistance with Detailed Application Form (DAF-II) preparation." },
      { label: "Mock Interviews:", text: "Practice sessions with expert interview panels." },
      { label: "Personalised Feedback:", text: "Individual guidance to improve interview readiness." },
      { label: "Current Affairs Sessions:", text: "Focused discussions on important national and international issues." },
    ],
    cta: { label: "Explore Interview Guidance", href: links.interviewGuidance },
  },
];
