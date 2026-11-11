import { links, type Href } from "@/data/links";

/**
 * Explore UPSC Programmes (IA 4), in the `kevin` branch's copy (its `programmes` content, as the client asked
 * on 14 Nov 2026: "use this content only"): the heading, the flagship General Studies programme, and every
 * programme group on the course shelf. The client's round of feedback (items 21 to 27) slimmed the flagship
 * card's lines and put each group in a category for the shelf's filter; nothing else is added beyond that
 * copy. The links are the groups' pages on vajiramandravi.com, and what kevin marked as still to be
 * confirmed is marked so here too.
 */

/** A section heading: the words before the emphasis (shown in orange), the emphasis, and the words after it. */
export type HeadingParts = { before: string; em: string; after: string };

/** The section's heading. Its lead line was removed at the client's request (feedback 24). */
export const programmesIntro = {
  title: { before: "Find the right", em: "UPSC programme", after: "for your preparation." } satisfies HeadingParts,
};

export type ProgrammeLink = { label: string; href: Href };

/**
 * The flagship programme. As in kevin's copy, its benefits describe what the programme covers and are to be
 * confirmed by the academic team. The three lines are the client's of 11 Nov 2026, and the learning modes
 * are a small note under them.
 */
export const featuredProgramme = {
  tag: "Flagship programme",
  name: "General Studies Prelims & Mains programme",
  /** The client's three lines (11 Nov 2026); the figures in them are set in bold. */
  benefits: [
    "300+ class lectures and 900+ teaching hours by experienced subject specialists.",
    "18 Yellow Books covering the General Studies syllabus, alongside The Recitals, the monthly current affairs magazine.",
    "30 Prelims tests and an additional six-month Mains support programme with evaluation and feedback.",
  ],
  /** How it can be taken, as a small note under the lines rather than a block of its own. */
  modes: "Classroom and LIVE-Online",
  /**
   * "Enrol for the programme" opens the counselling postcard with this programme chosen (FlagshipCard).
   * TODO: point it at the programme's enrolment page once the live site has one.
   */
  primary: { label: "Enrol for the programme" },
  secondary: { label: "View programme details", href: links.gsCourse } satisfies ProgrammeLink,
  /**
   * Its photographs, fading from one to the next; `position` is the part of a photo the frame keeps. First
   * the client's photograph of a lecture (a faculty member at the board with the map of India, a student's
   * hand up; 11 Nov 2026), then the library study group.
   */
  photos: [
    { src: "/images/programmes/flagship-lecture.webp", width: 1000, height: 1506, position: "40% 30%" },
    { src: "/images/programmes/featured-library.webp", width: 1264, height: 848, position: "45% 50%" },
  ],
};

/** The emblems stamped in gold foil on the books' covers (Programmes/CoverArt). */
export type CoverEmblem = "books" | "abacus" | "quill" | "layers" | "target" | "pen" | "compass" | "mic";

/** The geometric motifs pressed into the cloth under the foil, from the earlier course wall (Programmes/GeoArt). */
export type CoverArtKind = "bars" | "circles" | "grid" | "arches" | "arcs" | "lines" | "target" | "quarters";

/** The shelf's filter: each programme group belongs to one of these. */
export const programmeCategories = ["Foundation", "Optional", "Tests", "Guidance"] as const;
export type ProgrammeCategory = (typeof programmeCategories)[number];

/**
 * A programme group on the course shelf: its name, its category on the shelf's filter, how many courses it
 * holds, the courses its line names (one page each in the open book), the line, its page, and its cover.
 */
export type Programme = {
  name: string;
  category: ProgrammeCategory;
  count: number;
  courses: string[];
  line: string;
  href: Href;
  /**
   * Its cloth hardcover, in the deep bookbinding colours of the reference shelf (vajiram-ravi.vercel.app),
   * warmed towards the brand's rust and orange: the cloth's light, base and deep tones (the board runs from
   * light to deep, the spine is the deep tone), the gold emblem on it, and the geometric motif pressed into
   * the cloth under the foil, which moves while the book is hovered.
   */
  cover: { light: string; base: string; deep: string; emblem: CoverEmblem; art: CoverArtKind };
};

/** The shelf's heading, in two lines (the emphasis in orange). */
export const shelfIntro = {
  title: { before: "All our ", em: "UPSC programmes", after: ", side by side.", line2: "Choose one to take a closer look." },
};

/**
 * Every programme group, as kevin's wall lists them, shelved by category. Counts and lines are from his
 * design and to be confirmed (TODO); the rest of each group's courses are reached through its "View all" page.
 */
export const programmes: Programme[] = [
  {
    name: "UPSC GS foundation course – PCM",
    category: "Foundation",
    count: 4,
    courses: ["1-year GS foundation course", "2-year GS foundation course"],
    line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
    href: links.gsCourse,
    cover: { light: "#d9581c", base: "#c2410c", deep: "#8f3010", emblem: "books", art: "bars" },
  },
  {
    name: "CSAT course",
    category: "Foundation",
    count: 2,
    courses: ["CSAT course"],
    line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
    href: links.csatCourses,
    cover: { light: "#2e6a80", base: "#1f4a5f", deep: "#14323f", emblem: "abacus", art: "grid" },
  },
  {
    name: "Optional subject programme",
    category: "Optional",
    count: 26,
    courses: ["Anthropology", "Sociology"],
    line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in classroom and LIVE-Online.",
    href: links.optionalSubject,
    cover: { light: "#c0362c", base: "#a3231c", deep: "#701510", emblem: "quill", art: "circles" },
  },
  {
    name: "Optional test series",
    category: "Optional",
    count: 16,
    courses: ["Year-long optional test series", "Optional Mains test series"],
    line: "Year-long and Mains test series to practise answer writing in your optional subject.",
    href: links.optionalTestSeries,
    cover: { light: "#336650", base: "#264f3e", deep: "#18352a", emblem: "layers", art: "quarters" },
  },
  {
    name: "Prelims test series",
    category: "Tests",
    count: 7,
    courses: ["PowerUp test series", "Prelims CAMP", "Current affairs tests"],
    line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
    href: links.prelimsTestSeries,
    cover: { light: "#7a3556", base: "#5e2742", deep: "#3f192c", emblem: "target", art: "target" },
  },
  {
    name: "Mains test series",
    category: "Tests",
    count: 11,
    courses: ["Sure Shot test series", "Mains CAMP", "Essay tests"],
    line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
    href: links.mainsTestSeriesAll,
    cover: { light: "#a3545c", base: "#873f48", deep: "#5e2a31", emblem: "pen", art: "lines" },
  },
  {
    name: "Mentorship programme",
    category: "Guidance",
    count: 6,
    courses: ["StepUp mentorship"],
    line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
    href: links.mentorshipPrograms,
    cover: { light: "#b8673a", base: "#9b5029", deep: "#6e3519", emblem: "compass", art: "arcs" },
  },
  {
    name: "Interview guidance programme",
    category: "Guidance",
    count: 2,
    courses: ["UPSC CSE interview guidance", "IFoS interview guidance"],
    line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
    href: links.interviewGuidance,
    cover: { light: "#5e5f63", base: "#4a4b4e", deep: "#303133", emblem: "mic", art: "arches" },
  },
];

/**
 * The client's closing line ("Not sure which programme is right for you? Speak with our academic
 * counsellors."), set as a card under the shelf: the question as its heading, the rest under it, and its
 * button to the counselling form.
 */
export const programmesClosing = {
  question: "Not sure which programme is right for you?",
  text: "Speak with our academic counsellors.",
  cta: { label: "Get expert guidance", href: "#counselling" } satisfies ProgrammeLink,
};

/** The choices of "Programme of Interest" in the counselling form: the flagship programme and the groups. */
export const programmeChoices: string[] = [featuredProgramme.name, ...programmes.map((programme) => programme.name)];
