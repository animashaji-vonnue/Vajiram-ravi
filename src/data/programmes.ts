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
  eyebrow: "EXPLORE UPSC PROGRAMMES",
  title: { before: "One goal.", em: "Different paths to get there.", after: "" } satisfies HeadingParts,
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
  line: "Prepare for the core subjects of the examination.",
  benefits: [
    "The General Studies syllabus for both Prelims and Mains, in one programme",
    "Classes with experienced faculty, in the classroom or LIVE-Online",
    "Study material and current affairs to learn and revise from",
    "Regular tests and answer writing, with feedback",
  ],
  details: [
    { term: "Who it's for", value: "Aspirants preparing General Studies for Prelims and Mains" },
    { term: "Learning options", value: "Classroom, Delhi · LIVE-Online" },
    // TODO: placeholder (kevin's copy): the programme's duration, from the academic team.
    { term: "Duration", value: "[Duration to be confirmed]" },
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
export type Programme = {
  name: string;
  count: number;
  courses: string[];
  line: string;
  href: Href;
  cover: { colour: string; type: "light" | "dark" };
};

/** The shelf's heading, as kevin's wall has it. */
export const shelfIntro = {
  title: "More UPSC programmes",
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
    cover: { colour: "#e57512", type: "light" },
  },
  {
    name: "Optional Subject Programme",
    count: 26,
    courses: ["Anthropology", "Sociology"],
    line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
    href: links.optionalSubject,
    cover: { colour: "#2b1206", type: "light" },
  },
  {
    name: "CSAT Course",
    count: 2,
    courses: ["CSAT Course"],
    line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
    href: links.csatCourses,
    cover: { colour: "#f4c430", type: "dark" },
  },
  {
    name: "Interview Guidance Programme",
    count: 2,
    courses: ["UPSC CSE Interview Guidance", "IFoS Interview Guidance"],
    line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
    href: links.interviewGuidance,
    cover: { colour: "#5a160f", type: "light" },
  },
  {
    name: "Mentorship Programme",
    count: 6,
    courses: ["StepUp Mentorship"],
    line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
    href: links.mentorshipPrograms,
    cover: { colour: "#cc5500", type: "light" },
  },
  {
    name: "Mains Test Series",
    count: 11,
    courses: ["Sure Shot Test Series", "Mains CAMP", "Essay Tests"],
    line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
    href: links.mainsTestSeriesAll,
    cover: { colour: "#fff8ec", type: "dark" },
  },
  {
    name: "Prelims Test Series",
    count: 7,
    courses: ["PowerUp Test Series", "Prelims CAMP", "Current Affairs Tests"],
    line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
    href: links.prelimsTestSeries,
    cover: { colour: "#ffd98a", type: "dark" },
  },
  {
    name: "Optional Test Series",
    count: 16,
    courses: ["Year-long Optional Test Series", "Optional Mains Test Series"],
    line: "Year-long and Mains test series to practise answer writing in your optional subject.",
    href: links.optionalTestSeries,
    cover: { colour: "#3b2416", type: "light" },
  },
];

/** The closing line under the shelf, and its button to the counselling form (the client's copy). */
export const programmesClosing = {
  text: "Not sure which programme is right for you? Speak with our academic counsellors.",
  cta: { label: "Get Expert Guidance", href: "#counselling" } satisfies ProgrammeLink,
};

/** The choices of "Programme of Interest" in the counselling form: the featured programme and the groups. */
export const programmeChoices: string[] = [featuredProgramme.name, ...programmes.map((programme) => programme.name)];
