import { links, type Href } from "@/data/links";

/**
 * Explore UPSC Programmes (IA 4), in the `kevin` branch's copy (its `programmes` content, as the client asked
 * on 14 Nov 2026: "use this content only"): the heading, the featured General Studies programme, and every
 * programme group on the course shelf. Nothing here is added beyond that copy; the links are the groups'
 * pages on vajiramandravi.com, and what kevin marked as still to be confirmed is marked so here too.
 */

/** A section heading: the words before the italic emphasis, the emphasis, and the words after it. */
export type HeadingParts = { before: string; em: string; after: string };

export const programmesIntro = {
  title: { before: "Find the right", em: "UPSC programme", after: "for your preparation." } satisfies HeadingParts,
  lead: "Whether you're building your foundation, strengthening your preparation or getting ready for the next stage, find a programme that fits your needs.",
};

export type ProgrammeLink = { label: string; href: Href };

/**
 * The featured programme. As in kevin's copy, its benefits describe what the programme covers and are to be
 * confirmed by the academic team, and the duration is a placeholder.
 */
export const featuredProgramme = {
  tag: "Featured programme",
  name: "General Studies Prelims & Mains Programme",
  line: "Build a strong foundation in General Studies for both stages of the examination.",
  benefits: [
    "Integrated preparation covering the General Studies syllabus for both Prelims and Mains in one programme.",
    "Experienced faculty delivering classes in the classroom or through LIVE-Online sessions.",
    "18 Yellow Books covering the General Studies syllabus, alongside the monthly current affairs magazine, The Recitals.",
    "Regular assessments through Prelims tests and Mains tests, with evaluation and feedback.",
  ],
  details: [
    { term: "Who it's for", value: "Aspirants preparing General Studies for Prelims and Mains" },
    { term: "Learning options", value: "Classroom, New Delhi & Chennai · LIVE-Online" },
    { term: "Duration", value: "11 months" },
  ],
  primary: { label: "Explore the programme", href: links.gsCourse } satisfies ProgrammeLink,
  secondary: { label: "See upcoming batches", href: "#batches" } satisfies ProgrammeLink,
  /** Its photographs, fading from one to the next; `position` is the part of a photo the frame keeps. */
  photos: [
    { src: "/images/programmes/featured-teacher.webp", width: 1200, height: 1807, position: "30% 22%" },
    { src: "/images/programmes/featured-mentoring.webp", width: 760, height: 760 },
    { src: "/images/programmes/featured-classroom.webp", width: 1024, height: 461 },
    { src: "/images/programmes/featured-library.webp", width: 1264, height: 848 },
  ],
};

/**
 * A programme group on the course shelf: its name, how many courses it holds, the courses its line names
 * (one page each in the open book), the line, its page, and its cover's colour (from the site's palette).
 */
/** The geometric motifs of the covers (Programmes/CoverArt). */
export type CoverArtKind = "bars" | "circles" | "grid" | "arches" | "arcs" | "lines" | "target" | "quarters";

export type Programme = {
  name: string;
  count: number;
  courses: string[];
  line: string;
  href: Href;
  /**
   * Its cover, as the `kevin` branch's wall draws it (sampled from the client's screenshot): the paper, the
   * spine's colour, the ink of its title and figure, its geometric art (accent and soft tones, CoverArt),
   * and the vivid colour the cover floods with on hover.
   */
  cover: { paper: string; spine: string; ink: string; accent: string; soft: string; art: CoverArtKind; vivid: string };
};

/** The shelf's heading (the emphasis in orange) and its lead, as kevin's wall has it. */
export const shelfIntro = {
  title: { lead: "More ", em: "UPSC programmes" },
  intro: "Every programme we run, on one wall. Pick a course to take a closer look.",
};

/**
 * Every programme group, as kevin's wall lists them. Counts and lines are from his design and to be
 * confirmed (TODO); the rest of each group's courses are reached through its "View all" page.
 */
export const programmes: Programme[] = [
  {
    name: "UPSC GS Foundation Course - PCM",
    count: 4,
    courses: ["1-year GS Foundation Course", "2-year GS Foundation Course"],
    line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
    href: links.gsCourse,
    cover: { paper: "#e0cdbf", spine: "#816258", ink: "#4a352d", accent: "#6f4d42", soft: "#b19a8b", art: "bars", vivid: "#a4502c" },
  },
  {
    name: "Optional Subject Programme",
    count: 26,
    courses: ["Anthropology", "Sociology"],
    line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
    href: links.optionalSubject,
    cover: { paper: "#bbd6c2", spine: "#2c7563", ink: "#1f4a3e", accent: "#12624d", soft: "#7eb397", art: "circles", vivid: "#0d9b6a" },
  },
  {
    name: "CSAT Course",
    count: 2,
    courses: ["CSAT Course"],
    line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
    href: links.csatCourses,
    cover: { paper: "#c1c7d6", spine: "#3550a8", ink: "#233a7a", accent: "#26448f", soft: "#8698c6", art: "grid", vivid: "#1f4fe6" },
  },
  {
    name: "Interview Guidance Programme",
    count: 2,
    courses: ["UPSC CSE Interview Guidance", "IFoS Interview Guidance"],
    line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
    href: links.interviewGuidance,
    cover: { paper: "#f0c2c6", spine: "#c4466e", ink: "#7d2a45", accent: "#a42d59", soft: "#dd889b", art: "arches", vivid: "#f0197a" },
  },
  {
    name: "Mentorship Programme",
    count: 6,
    courses: ["StepUp Mentorship"],
    line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
    href: links.mentorshipPrograms,
    cover: { paper: "#fecfac", spine: "#d75f27", ink: "#8a3d18", accent: "#be4415", soft: "#f2a17a", art: "arcs", vivid: "#f2610d" },
  },
  {
    name: "Mains Test Series",
    count: 11,
    courses: ["Sure Shot Test Series", "Mains CAMP", "Essay Tests"],
    line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
    href: links.mainsTestSeriesAll,
    cover: { paper: "#d8c6e4", spine: "#5b2a86", ink: "#3e1f5e", accent: "#4f2677", soft: "#a88ecb", art: "lines", vivid: "#6b22d6" },
  },
  {
    name: "Prelims Test Series",
    count: 7,
    courses: ["PowerUp Test Series", "Prelims CAMP", "Current Affairs Tests"],
    line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
    href: links.prelimsTestSeries,
    cover: { paper: "#f6c3b8", spine: "#b2343a", ink: "#7a1f24", accent: "#911f25", soft: "#d97879", art: "target", vivid: "#e8231e" },
  },
  {
    name: "Optional Test Series",
    count: 16,
    courses: ["Year-long Optional Test Series", "Optional Mains Test Series"],
    line: "Year-long and Mains test series to practise answer writing in your optional subject.",
    href: links.optionalTestSeries,
    cover: { paper: "#c7bcb0", spine: "#2b2322", ink: "#2b2322", accent: "#241e1d", soft: "#92877c", art: "quarters", vivid: "#2f2a27" },
  },
];

/**
 * The client's closing line ("Not sure which programme is right for you? Speak with our academic
 * counsellors."), set as a card on the wall under the shelves: the question as its heading, the rest under
 * it, and its button to the counselling form.
 */
export const programmesClosing = {
  question: "Not sure which programme is right for you?",
  text: "Speak with our academic counsellors.",
  cta: { label: "Get Expert Guidance", href: "#counselling" } satisfies ProgrammeLink,
};

/** The choices of "Programme of Interest" in the counselling form: the featured programme and the groups. */
export const programmeChoices: string[] = [featuredProgramme.name, ...programmes.map((programme) => programme.name)];
