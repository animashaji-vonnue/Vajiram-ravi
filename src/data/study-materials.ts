import { links, type Href } from "@/data/links";

/**
 * Free study materials & resources (IA 9), laid out as the newspaper front page of Figma "Newspaper"
 * (2392:5787): the masthead (the client's heading, §09), three columns of headlines, and a line of other
 * free resources.
 */
export const resourcesIntro = {
  eyebrow: "LEARN. PRACTISE. STAY UPDATED.",
  /** The H2, the paper's masthead; the emphasis is its italic second beat. */
  heading: { before: "Make", emphasis: "every day", after: "of preparation count." },
  lead: "Access useful study materials, current affairs analysis and practice resources to support your UPSC preparation.",
};

/** A headline on the front page: the article's title and its page on vajiramandravi.com. */
export type Story = { title: string; href: Href };

/** A column: its head, its lead story and five more, and the way to the rest (the client's link wording). */
export type ResourceColumn = { title: string; lead: Story; stories: Story[]; cta: string; href: Href };

const SITE = "https://vajiramandravi.com";

/**
 * The three columns. The headlines are vajiramandravi.com's own latest articles in each (read from its
 * homepage on 14 Nov 2026); TODO: feed them from the CMS so the front page stays current.
 */
export const resourceColumns: ResourceColumn[] = [
  {
    title: "Prelims Pointers",
    lead: { title: "CAPEX Support Scheme: Cabinet Approves ₹2,814 Crore for Lithium and Nickel Processing", href: `${SITE}/current-affairs/capex-support-scheme-to-promote-critical-mineral-processing/` },
    stories: [
      { title: "Liocheles similipalensis", href: `${SITE}/current-affairs/liocheles-similipalensis/` },
      { title: "INS Amini: Indian Navy Receives Indigenous Anti-Submarine Warfare Ship", href: `${SITE}/current-affairs/ins-amini/` },
      { title: "Malabar Tree Toad: Karnataka Becomes First Indian State to Declare State Amphibian", href: `${SITE}/current-affairs/malabar-tree-toad/` },
      { title: "Gaia Mission: ESA Retires Space Telescope After Mapping Nearly 2 Billion Stars", href: `${SITE}/current-affairs/gaia-mission/` },
      { title: "Exercise Malabar 2026: India, US, Japan and Australia Begin Joint Naval Drills", href: `${SITE}/current-affairs/exercise-malabar/` },
    ],
    cta: "Explore Prelims Pointers",
    href: links.prelimsPointers,
  },
  {
    title: "Mains Articles & Editorial Analysis",
    lead: { title: "India’s Indigenisation Drive: 100 Critical Items and Import Dependence", href: `${SITE}/current-affairs/indias-indigenisation-drive/` },
    stories: [
      { title: "COP31 – Climate Overshoot, Carbon Budget and Climate Justice", href: `${SITE}/current-affairs/cop31-climate-overshoot/` },
      { title: "Cash After Demonetisation: Why Physical Currency Still Reigns in India", href: `${SITE}/current-affairs/cash-after-demonetisation-why-physical-currency-still-reigns-in-india/` },
      { title: "Right to Internet Access for Children – Constitutional Framework and Online Safety", href: `${SITE}/current-affairs/right-to-internet-access-for-children/` },
      { title: "ECI’s Special Summary Revision (SSR) and Internal Administrative Reorganisation", href: `${SITE}/current-affairs/ecis-special-summary-revision-ssr-and-internal-administrative-reorganisation/` },
      { title: "BPaL Patent Rejection in India: Boost for Affordable TB Treatment", href: `${SITE}/current-affairs/bpal-patent-rejection-in-india-boost-for-affordable-tb-treatment/` },
    ],
    cta: "Explore Mains Resources",
    href: links.mainsArticles,
  },
  {
    title: "UPSC Study Materials",
    lead: { title: "Bhoodan Movement 1951, History, Causes, Objectives, Challenges", href: `${SITE}/upsc-exam/bhoodan-movement/` },
    stories: [
      { title: "Personal Laws in India, Provisions, Case Laws, Challenges", href: `${SITE}/upsc-exam/personal-laws-in-india/` },
      { title: "Sendai Framework, 2030 Global Targets, Priority of Actions", href: `${SITE}/upsc-exam/sendai-framework/` },
      { title: "Indian Puppetry, History, Types, String, Shadow, Glove, Rod", href: `${SITE}/upsc-exam/indian-puppetry/` },
      { title: "Duarte Barbosa, Biography, Visit to India, Accounts, UPSC Notes", href: `${SITE}/upsc-exam/duarte-barbosa/` },
      { title: "Indira Gandhi (1917-84), Biography, Books, Death, Contributions", href: `${SITE}/upsc-exam/indira-gandhi/` },
    ],
    cta: "View All Study Materials",
    href: links.studyMaterial,
  },
];

/** "Other free resources", the pills along the foot of the page. */
export const otherResources: { label: string; href: Href }[] = [
  { label: "Daily Current Affairs", href: links.dailyCurrentAffairs },
  { label: "Previous Year Papers", href: links.previousYearPapers },
  { label: "Model Answers for Mains", href: links.modelAnswers },
  { label: "Toppers' Answer Sheets", href: links.toppersAnswerSheets },
  { label: "Yojana Magazine", href: links.yojanaKurukshetra },
  { label: "Weekly Essay", href: links.essayPractice },
];

export const otherResourcesLabel = "Other free resources :";

/** The resources for the search, in the page's order. */
export const freeResourceList: { title: string }[] = [
  ...resourceColumns.map((column) => ({ title: column.title })),
  ...otherResources.map((item) => ({ title: item.label })),
];
