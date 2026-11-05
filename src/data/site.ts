import { footerColumns, type FooterLink } from "./footer";
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

/** The header's mega menus. The design draws no panels: their columns come from the footer's link lists. */
export type MenuId = "courses" | "study" | "exam";

export type MenuColumn = { heading: string; links: FooterLink[] };

export type Menu = {
  columns: MenuColumn[];
  /** The panel's closing link to the full listing on the live site. */
  more: { label: string; href: Href };
};

/** A column of the footer, by its heading, so the menus and the footer always list the same links. */
function footerColumn(heading: string): MenuColumn {
  const column = footerColumns.find((c) => c.heading === heading);
  if (!column) throw new Error(`No footer column "${heading}"`);
  return column;
}

export const menus: Record<MenuId, Menu> = {
  courses: {
    columns: [footerColumn("Courses"), footerColumn("Test series & mentorship")],
    more: { label: "View all courses", href: links.allCourses },
  },
  study: {
    columns: [
      footerColumn("Free resources"),
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
    columns: [footerColumn("UPSC exam"), footerColumn("Exam updates")],
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
  { label: "All Courses", href: "#courses", menu: "courses" },
  { label: "Toppers", href: "#toppers" },
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

export const announcements: Announcement[] = [
  { text: "59 questions in UPSC Prelims 2025 reflected from V&R Prelims Test Series", href: links.prelimsTestSeries, icon: "check" },
  { text: "Ranker’s Programme · Admission open", href: "#courses", icon: "trophy" },
  { text: "Classroom GS PCM 2027 · Admission open", href: links.gsClassroom, icon: "book" },
  { text: "Online GS PCM 2027 · Admission open", href: links.gsOnline, icon: "laptop" },
  { text: "StepUp Mentorship 2027 · Admission open", href: links.mentorship, icon: "community" },
];

/** Under reduced motion the strip stands still with its first two items and this link to the rest. */
export const announcementsMore = { label: "View all updates", href: links.upcomingBatches };
