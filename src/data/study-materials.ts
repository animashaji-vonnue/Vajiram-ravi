import { links, type Href } from "@/data/links";

/**
 * Free study materials & resources (IA 9), laid out as a broadsheet front page (FreeResources/FrontPage):
 * the nameplate (the logo between its two ears), the dateline, the client's heading (§09) as the front
 * page's headline with its lead as the standfirst, a pull-quote, three columns of headlines and an index
 * of the other free resources. All copy is in sentence case (feedback item 9).
 */
export const resourcesIntro = {
  /** The H2, the front page's headline: its emphasis (the second line) set in italic. */
  heading: { before: "Strengthen your UPSC preparation with", emphasis: "free learning resources.", after: "" },
  /** The standfirst under the headline, opening on a drop cap. */
  lead: "Explore free study materials, current affairs analysis and practice resources to strengthen your understanding, revise key topics and stay updated.",
};

/**
 * The masthead's small print. The volume counts the years since 1976 and the issue the day of the year;
 * both, with the date, are worked out on the reader's own day (FreeResources/Dateline).
 */
export const masthead = {
  /** The year the first volume came out. */
  founded: 1976,
  /** The two ears beside the logo: a line in small caps over a short one. */
  ears: [
    { top: "Since 1976", bottom: "Price: free" },
    { top: "New Delhi · Chennai", bottom: "Daily edition" },
  ],
  /** The paper's address, at the right of the dateline. */
  site: "vajiramandravi.com",
  /** The folio at the foot of the page: the page number (the section's place in the IA) and the paper's name. */
  folio: { page: "Page 9", title: "Vajiram & Ravi · Free learning resources" },
};

/**
 * The pull-quote beside the headline: the institute's own line from the About section (data/about), set
 * the way a paper sets a quote it pulls from the page.
 */
export const resourcesQuote = {
  text: "Established in 1976, Vajiram & Ravi has guided generations of aspirants.",
  source: "Vajiram & Ravi",
};

/** A headline on the front page: the article's title and its page on vajiramandravi.com. */
export type Story = { title: string; href: Href };

/**
 * A column: its section letter and head, the desk it comes from (the byline), the photograph over its lead
 * story, its lead story and five more, and the way to the rest (the client's link wording).
 */
export type ResourceColumn = {
  section: string;
  title: string;
  byline: string;
  /** `position`: the object-position of its crop. */
  photo: { src: string; width: number; height: number; position?: string };
  lead: Story;
  stories: Story[];
  cta: string;
  href: Href;
};

const SITE = "https://vajiramandravi.com";

/**
 * The three columns. The headlines are vajiramandravi.com's own latest articles in each (read from its
 * homepage on 14 Nov 2026), in sentence case; TODO: feed them from the CMS so the front page stays current.
 * TODO: the photographs are the site's existing institute photos, standing in for a picture per article;
 * the bylines name the desks rather than writers until the CMS supplies them.
 */
export const resourceColumns: ResourceColumn[] = [
  {
    section: "A",
    title: "Prelims pointers",
    byline: "By the current affairs desk",
    photo: { src: "/images/programmes/featured-classroom.webp", width: 1024, height: 461 },
    lead: { title: "CAPEX Support Scheme: Cabinet approves ₹2,814 crore for lithium and nickel processing", href: `${SITE}/current-affairs/capex-support-scheme-to-promote-critical-mineral-processing/` },
    stories: [
      { title: "Liocheles similipalensis", href: `${SITE}/current-affairs/liocheles-similipalensis/` },
      { title: "INS Amini: Indian Navy receives indigenous anti-submarine warfare ship", href: `${SITE}/current-affairs/ins-amini/` },
      { title: "Malabar tree toad: Karnataka becomes first Indian state to declare state amphibian", href: `${SITE}/current-affairs/malabar-tree-toad/` },
      { title: "Gaia mission: ESA retires space telescope after mapping nearly 2 billion stars", href: `${SITE}/current-affairs/gaia-mission/` },
      { title: "Exercise Malabar 2026: India, US, Japan and Australia begin joint naval drills", href: `${SITE}/current-affairs/exercise-malabar/` },
    ],
    cta: "Explore Prelims pointers",
    href: links.prelimsPointers,
  },
  {
    section: "B",
    title: "Mains articles & editorial analysis",
    byline: "By the editorial desk",
    photo: { src: "/images/programmes/featured-library.webp", width: 1264, height: 848 },
    lead: { title: "India’s indigenisation drive: 100 critical items and import dependence", href: `${SITE}/current-affairs/indias-indigenisation-drive/` },
    stories: [
      { title: "COP31 – climate overshoot, carbon budget and climate justice", href: `${SITE}/current-affairs/cop31-climate-overshoot/` },
      { title: "Cash after demonetisation: why physical currency still reigns in India", href: `${SITE}/current-affairs/cash-after-demonetisation-why-physical-currency-still-reigns-in-india/` },
      { title: "Right to internet access for children – constitutional framework and online safety", href: `${SITE}/current-affairs/right-to-internet-access-for-children/` },
      { title: "ECI’s Special Summary Revision (SSR) and internal administrative reorganisation", href: `${SITE}/current-affairs/ecis-special-summary-revision-ssr-and-internal-administrative-reorganisation/` },
      { title: "BPaL patent rejection in India: boost for affordable TB treatment", href: `${SITE}/current-affairs/bpal-patent-rejection-in-india-boost-for-affordable-tb-treatment/` },
    ],
    cta: "Explore Mains resources",
    href: links.mainsArticles,
  },
  {
    section: "C",
    title: "UPSC study materials",
    byline: "By the study material desk",
    photo: { src: "/images/programmes/featured-mentoring.webp", width: 760, height: 760, position: "50% 22%" },
    lead: { title: "Bhoodan Movement 1951, history, causes, objectives, challenges", href: `${SITE}/upsc-exam/bhoodan-movement/` },
    stories: [
      { title: "Personal laws in India, provisions, case laws, challenges", href: `${SITE}/upsc-exam/personal-laws-in-india/` },
      { title: "Sendai Framework, 2030 global targets, priority of actions", href: `${SITE}/upsc-exam/sendai-framework/` },
      { title: "Indian puppetry, history, types, string, shadow, glove, rod", href: `${SITE}/upsc-exam/indian-puppetry/` },
      { title: "Duarte Barbosa, biography, visit to India, accounts, UPSC notes", href: `${SITE}/upsc-exam/duarte-barbosa/` },
      { title: "Indira Gandhi (1917-84), biography, books, death, contributions", href: `${SITE}/upsc-exam/indira-gandhi/` },
    ],
    cta: "View all study materials",
    href: links.studyMaterial,
  },
];

/** "Other free resources", the index along the foot of the page. */
export const otherResources: { label: string; href: Href }[] = [
  { label: "Daily current affairs", href: links.dailyCurrentAffairs },
  { label: "Previous year papers", href: links.previousYearPapers },
  { label: "Model answers for Mains", href: links.modelAnswers },
  { label: "Toppers' answer sheets", href: links.toppersAnswerSheets },
  { label: "Yojana magazine", href: links.yojanaKurukshetra },
  { label: "Weekly essay", href: links.essayPractice },
];

export const otherResourcesLabel = "Other free resources";

/** The resources for the search, in the page's order. */
export const freeResourceList: { title: string }[] = [
  ...resourceColumns.map((column) => ({ title: column.title })),
  ...otherResources.map((item) => ({ title: item.label })),
];
