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

/** The dark line above the header (Figma "Header / Utility bar", 2258:10448). */
export const utilityBar = {
  lead: "For registration or seat allotment, call",
  link: { label: "Contact us", href: "#contact" },
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
    { label: "UPSC GS Course 2027", href: links.gsClassroom },
    { label: "UPSC GS Online Course 2027", href: links.gsOnline },
    { label: "UPSC 2 Year Course", href: links.twoYearCourse },
    { label: "UPSC 2 Year Online Course", href: links.twoYearOnline },
    { label: "UPSC Online Coaching", href: links.onlineCoaching },
    { label: "UPSC CSAT Course", href: links.csat },
    { label: "Current Affairs Course", href: links.currentAffairsCourse },
    { label: "UPSC Study Material", href: links.studyMaterial },
  ],
};

const TEST_SERIES: MenuColumn = {
  heading: "Test series & mentorship",
  links: [
    { label: "UPSC Prelims Test Series 2027", href: links.prelimsTestSeries },
    { label: "UPSC Mains Test Series 2027", href: links.mainsTestSeries },
    { label: "UPSC Mains Test Series Hindi Medium", href: links.mainsTestSeriesHindi },
    { label: "UPSC Optional Test Series", href: links.optionalTestSeries },
    { label: "UPSC Mentorship Program 2027", href: links.mentorship },
    { label: "UPSC Mentorship Program Hindi Medium", href: links.mentorshipHindi },
    { label: "UPSC Interview Guidance Program IGP", href: links.interviewGuidance },
  ],
};

const UPSC_EXAM: MenuColumn = {
  heading: "UPSC exam",
  links: [
    { label: "UPSC 2027", href: links.upsc2027 },
    { label: "UPSC Exam Pattern", href: links.examPattern },
    { label: "UPSC Syllabus", href: links.syllabus },
    { label: "UPSC CSAT Syllabus", href: links.csatSyllabus },
    { label: "UPSC Optional Subjects List", href: links.optionalSubjectsList },
    { label: "UPSC Selection Process", href: links.selectionProcess },
    { label: "UPSC Interview", href: links.interview },
    { label: "UPSC Age Limit", href: links.ageLimit },
    { label: "IAS Salary", href: links.iasSalary },
  ],
};

const EXAM_UPDATES: MenuColumn = {
  heading: "Exam updates",
  links: [
    { label: "UPSC Calendar 2027", href: links.calendar },
    { label: "UPSC Admit Card", href: links.admitCard },
    { label: "UPSC Prelims Answer Key", href: links.prelimsAnswerKey },
    { label: "UPSC Cut Off", href: links.cutOff },
    { label: "UPSC Final Result 2025", href: links.finalResult },
  ],
};

const FREE_RESOURCES: MenuColumn = {
  heading: "Free resources",
  links: [
    { label: "UPSC Current Affairs", href: "#resources" },
    { label: "UPSC Previous Year Papers", href: links.previousYearPapers },
    { label: "UPSC Books", href: links.upscBooks },
    { label: "Model Answers for UPSC Mains 2026", href: links.modelAnswers },
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
          { label: "Monthly Current Affairs Magazine", href: links.monthlyMagazine },
          { label: "Yojana & Kurukshetra", href: links.yojanaKurukshetra },
          { label: "UPSC Toppers’ Answer Sheets", href: links.toppersAnswerSheets },
          { label: "Weekly Essay Practice", href: links.essayPractice },
          { label: "Free UPSC Study Material & Notes", href: links.studyMaterial },
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
  { label: "All Courses", href: "#programmes", menu: "courses" },
  { label: "Toppers", href: links.toppers },
  { label: "Study Materials", href: "#resources", menu: "study" },
  { label: "Current Affairs", href: links.currentAffairs },
  { label: "UPSC Exam", href: links.upscExam, menu: "exam" },
  { label: "Upcoming Batches", href: "#batches" },
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
