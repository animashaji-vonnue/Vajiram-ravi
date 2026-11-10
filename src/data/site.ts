import type { FooterLink } from "./footer";
import { links, type Href } from "./links";

/** A nav link: an in-page anchor or an address from data/links. */
export type LinkItem = { label: string; href: string };

export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  hours: "Mon – Sat, 9 AM – 7 PM",
  email: "admissions@vajiramandravi.com",
};

/** The header's mega menus. The design draws no panels: each lists a subject's links in columns. */
export type MenuId = "courses" | "study" | "exam";

export type MenuColumn = { heading: string; links: FooterLink[] };

export type Menu = {
  columns: MenuColumn[];
  /** The panel's closing link to the full listing on the live site. */
  more: { label: string; href: Href };
};

/**
 * The mega menus' link lists: the live site's full listings, by subject. (The footer has its own, shorter lists.)
 */
const COURSES: MenuColumn = {
  heading: "Courses",
  links: [
    { label: "UPSC GS course 2027", href: links.gsClassroom },
    { label: "UPSC GS online course 2027", href: links.gsOnline },
    { label: "UPSC 2-year course", href: links.twoYearCourse },
    { label: "UPSC 2-year online course", href: links.twoYearOnline },
    { label: "UPSC online coaching", href: links.onlineCoaching },
    { label: "UPSC CSAT course", href: links.csat },
    { label: "Current affairs course", href: links.currentAffairsCourse },
    { label: "UPSC study material", href: links.studyMaterial },
  ],
};

const TEST_SERIES: MenuColumn = {
  heading: "Test series & mentorship",
  links: [
    { label: "UPSC Prelims test series 2027", href: links.prelimsTestSeries },
    { label: "UPSC Mains test series 2027", href: links.mainsTestSeries },
    { label: "UPSC Mains test series, Hindi medium", href: links.mainsTestSeriesHindi },
    { label: "UPSC optional test series", href: links.optionalTestSeries },
    { label: "UPSC mentorship programme 2027", href: links.mentorship },
    { label: "UPSC mentorship programme, Hindi medium", href: links.mentorshipHindi },
    { label: "UPSC interview guidance programme (IGP)", href: links.interviewGuidance },
  ],
};

const UPSC_EXAM: MenuColumn = {
  heading: "UPSC exam",
  links: [
    { label: "UPSC 2027", href: links.upsc2027 },
    { label: "UPSC exam pattern", href: links.examPattern },
    { label: "UPSC syllabus", href: links.syllabus },
    { label: "UPSC CSAT syllabus", href: links.csatSyllabus },
    { label: "UPSC optional subjects list", href: links.optionalSubjectsList },
    { label: "UPSC selection process", href: links.selectionProcess },
    { label: "UPSC interview", href: links.interview },
    { label: "UPSC age limit", href: links.ageLimit },
    { label: "IAS salary", href: links.iasSalary },
  ],
};

const EXAM_UPDATES: MenuColumn = {
  heading: "Exam updates",
  links: [
    { label: "UPSC calendar 2027", href: links.calendar },
    { label: "UPSC admit card", href: links.admitCard },
    { label: "UPSC Prelims answer key", href: links.prelimsAnswerKey },
    { label: "UPSC cut-off", href: links.cutOff },
    { label: "UPSC final result 2025", href: links.finalResult },
  ],
};

const FREE_RESOURCES: MenuColumn = {
  heading: "Free resources",
  links: [
    { label: "UPSC current affairs", href: "#resources" },
    { label: "UPSC previous year papers", href: links.previousYearPapers },
    { label: "UPSC books", href: links.upscBooks },
    { label: "Model answers for UPSC Mains 2026", href: links.modelAnswers },
  ],
};

export const menus: Record<MenuId, Menu> = {
  courses: {
    columns: [COURSES, TEST_SERIES],
    more: { label: "View all courses", href: links.allCourses },
  },
  study: {
    columns: [
      FREE_RESOURCES,
      {
        heading: "Magazines & practice",
        links: [
          { label: "Monthly current affairs magazine", href: links.monthlyMagazine },
          { label: "Yojana & Kurukshetra", href: links.yojanaKurukshetra },
          { label: "UPSC toppers’ answer sheets", href: links.toppersAnswerSheets },
          { label: "Weekly essay practice", href: links.essayPractice },
          { label: "Free UPSC study material & notes", href: links.studyMaterial },
        ],
      },
    ],
    more: { label: "Browse all study material", href: links.studyMaterial },
  },
  exam: {
    columns: [UPSC_EXAM, EXAM_UPDATES],
    more: { label: "Read the UPSC exam guide", href: links.upscExam },
  },
};

/**
 * The main header's links, in the design's order (Figma "Header / Main", 2258:10385). An item with a
 * `menu` is a button that opens that mega menu; its `href` is the section of the page it stands for (the
 * header marks it while that section is in view, and the search lists it), or its page on the live site.
 */
export type NavItem = LinkItem & { menu?: MenuId };

export const mainNav: NavItem[] = [
  { label: "All courses", href: "#programmes", menu: "courses" },
  { label: "Toppers", href: links.toppers },
  { label: "Study materials", href: "#resources", menu: "study" },
  { label: "Current affairs", href: links.currentAffairs },
  { label: "UPSC exam", href: links.upscExam, menu: "exam" },
  { label: "Upcoming batches", href: "#batches" },
  { label: "FAQs", href: "#faq" },
  { label: "Contact us", href: "#contact" },
];

/** The design's iconoir icons in the announcement strip, drawn in saffron. */
export const announcementIcons = {
  check: "/images/header/icon-check-circle.svg",
  trophy: "/images/header/icon-trophy.svg",
  book: "/images/header/icon-open-book.svg",
  laptop: "/images/header/icon-laptop.svg",
  community: "/images/header/icon-community.svg",
} as const;

/** A ticker item of the announcement strip (Figma "Header / Announcement strip", 2258:10386). */
export type Announcement = { text: string; href: string; icon: keyof typeof announcementIcons };

/** The ticker's items, the client's copy of 10 Nov 2026. */
export const announcements: Announcement[] = [
  { text: "Admissions open for upcoming UPSC CSE programmes.", href: "#programmes", icon: "book" },
  { text: "Explore upcoming batches for Prelims 2027.", href: "#batches", icon: "check" },
  { text: "New programmes and admission updates.", href: links.upcomingBatches, icon: "trophy" },
];

/** Under reduced motion the strip stands still with its first two items and this link to the rest. */
export const announcementsMore = { label: "View all updates", href: links.upcomingBatches };
