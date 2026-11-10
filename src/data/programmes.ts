import { links, type Href } from "@/data/links";

/**
 * Explore UPSC Programmes (IA 4; Figma "03 · Explore Our Programmes", 2377:4612), in the client's copy of
 * 10 Nov 2026: the heading, the flagship General Studies programme on the frosted card with its figures,
 * every other programme family of vajiramandravi.com as illustrated cards, and a line pointing to the counsellors.
 */

/** A section heading: the words before the italic emphasis, the emphasis, and the words after it. */
export type HeadingParts = { before: string; em: string; after: string };

export const programmesIntro = {
  eyebrow: "UPSC PROGRAMMES",
  title: { before: "A programme for", em: "every part", after: "of your UPSC preparation." } satisfies HeadingParts,
  lead: "Whether you’re building your foundation, strengthening a specific subject or preparing for the next examination stage, find the academic support that matches your preparation needs.",
};

/** A figure of the flagship programme: the number as shown (it rolls up, see ui/CountUp) and what it counts. */
export type ProgrammeFigure = { value: string; label: string };

export type ProgrammeLink = { label: string; href: Href };

/** 01, the flagship: General Studies – Prelims & Mains. */
export const flagshipProgramme = {
  number: "01",
  title: "General Studies – Prelims & Mains",
  text: "Build your understanding of the complete General Studies syllabus, from foundational concepts to exam-focused application.",
  figures: [
    { value: "300+", label: "Class Lectures" },
    { value: "900+", label: "Teaching Hours" },
    { value: "18", label: "Yellow Books" },
    { value: "30", label: "Prelims Tests" },
    { value: "6 Months", label: "Additional Mains Support" },
  ] satisfies ProgrammeFigure[],
  cta: { label: "View General Studies Programme", href: links.gsCourse } satisfies ProgrammeLink,
};

/**
 * The courses under General Studies PCM, as vajiramandravi.com lists them on its GS page (checked 13 Nov
 * 2026): the Prelims & Mains programme in the classroom and LIVE-Online, for CSE 2028. `facts` are the
 * page's own figures for each. (The two-year Fledgling has its own card in the grid.)
 */
export type GsCourse = { mode: "Classroom" | "LIVE-Online"; name: string; target: string; length: string; facts: string; href: Href };

export const gsCoursesLabel = "Courses under General Studies";

export const gsCourses: GsCourse[] = [
  {
    mode: "Classroom",
    name: "GS Prelims & Mains Classroom Programme",
    target: "CSE 2028",
    length: "Over a year",
    facts: "350+ sessions · 900+ teaching hours · classes 7 days a week",
    href: links.gsClassroom,
  },
  {
    mode: "LIVE-Online",
    name: "GS Prelims & Mains LIVE-Online Programme",
    target: "CSE 2028",
    length: "Over a year",
    facts: "350+ sessions · 900+ teaching hours · classes 7 days a week",
    href: links.gsOnline,
  },
];

export type Programme = {
  number: string;
  title: string;
  text: string;
  /** How it is taught, as the all-courses page lists it. */
  modes: string;
  cta: ProgrammeLink;
  /** Its cover on the course shelf: the cover's colour, and whether the type on it is light or dark. */
  cover: { colour: string; type: "light" | "dark" };
};

const VIEW = "View courses";

/**
 * 02 to 11: every other programme family of vajiramandravi.com's all-courses page (checked 13 Nov 2026),
 * in the client's order, each linking to its family page there. Optional Subjects keeps the client's own
 * sentence; the others say what the family's page lists.
 */
export const programmes: Programme[] = [
  {
    number: "02",
    title: "GS PCM 2-Year Fledgling",
    text: "General Studies over two years for CSE 2028, from the basics in the first year to full Prelims and Mains preparation in the second.",
    modes: "Classroom · LIVE-Online",
    cta: { label: VIEW, href: links.twoYearCourse },
    cover: { colour: "#e57512", type: "light" },
  },
  {
    number: "03",
    title: "UPSC Mentorship Program",
    text: "StepUp mentorship that plans, tracks and guides your preparation, in English and Hindi medium.",
    modes: "Offline · Online",
    cta: { label: VIEW, href: links.mentorshipPrograms },
    cover: { colour: "#2b1206", type: "light" },
  },
  {
    number: "04",
    title: "Module Courses",
    text: "Focused modules for SMART Current Affairs, Economics, Ethics and Essay, and the Ranker's Programme.",
    modes: "Classroom · LIVE-Online",
    cta: { label: VIEW, href: links.moduleCourses },
    cover: { colour: "#f4c430", type: "dark" },
  },
  {
    number: "05",
    title: "Optional Subjects",
    text: "Develop in-depth subject knowledge and prepare for the Optional Papers with focused teaching and examination-oriented practice.",
    modes: "13 subjects · Classroom · LIVE-Online",
    cta: { label: VIEW, href: links.optionalSubject },
    cover: { colour: "#fff8ec", type: "dark" },
  },
  {
    number: "06",
    title: "CSAT",
    text: "Build the aptitude, reasoning and comprehension that the CSAT paper of Prelims asks for.",
    modes: "Classroom · LIVE-Online",
    cta: { label: VIEW, href: links.csatCourses },
    cover: { colour: "#cc5500", type: "light" },
  },
  {
    number: "07",
    title: "Mains Test Series",
    text: "Sure Shot Mains, Mains CAMP, Essay and PYQ test series, with evaluation and feedback on every answer.",
    modes: "Offline · Online",
    cta: { label: VIEW, href: links.mainsTestSeriesAll },
    cover: { colour: "#3b2416", type: "light" },
  },
  {
    number: "08",
    title: "Optional Subject Crash Course",
    text: "Fast-paced revision with test practice for Sociology, History, PSIR, Mathematics and more.",
    modes: "Offline · Online",
    cta: { label: VIEW, href: links.crashCourses },
    cover: { colour: "#ffd98a", type: "dark" },
  },
  {
    number: "09",
    title: "Prelims Test Series",
    text: "PowerUp, Prelims Camp and Prelims Plus tests, practised under examination conditions.",
    modes: "Offline · Online",
    cta: { label: VIEW, href: links.prelimsTestSeries },
    cover: { colour: "#fff1dc", type: "dark" },
  },
  {
    number: "10",
    title: "Interview Guidance Programme",
    text: "Mock interviews, DAF guidance and feedback for the UPSC CSE and IFoS Personality Tests.",
    modes: "Offline · Online",
    cta: { label: VIEW, href: links.interviewGuidance },
    cover: { colour: "#5a160f", type: "light" },
  },
  {
    number: "11",
    title: "IFoS Programmes",
    text: "Forestry and Geology optionals, their test series and interview guidance for the Indian Forest Service.",
    modes: "Classroom · LIVE-Online",
    cta: { label: VIEW, href: links.ifos },
    cover: { colour: "#a8431a", type: "light" },
  },
];

/** The closing line under the cards, and its button to the counselling form. */
export const programmesClosing = {
  text: "Not sure which programme is right for you? Speak with our academic counsellors.",
  cta: { label: "Get Expert Guidance", href: "#counselling" } satisfies ProgrammeLink,
};

/** The choices of "Programme of Interest" in the counselling form: the flagship and the ten families above. */
export const programmeChoices: string[] = ["General Studies PCM", ...programmes.map((programme) => programme.title)];
