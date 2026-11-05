import { links, type Href } from "@/data/links";

/**
 * Free study material, drawn as a newspaper front page (Figma "10 · Free study material — newspaper
 * front page", 2258:9835): each exam stage is an edition with a lead story and five headlines.
 */

export const studyIntro = {
  /** Left of the masthead, in capitals. */
  kicker: "Free study material · Current affairs",
  masthead: "The V&R Analysis",
  /** The italic strap under the masthead. */
  strap: "Study materials for every stage of UPSC",
  /** After the stage's name: "Mains edition". */
  edition: "edition",
  /** The lead story's link, in capitals. */
  readMore: "Read the analysis",
  /** Before the other free resources, in capitals. */
  alsoFree: "Also free:",
  more: "View more",
};

export type StudyIntro = typeof studyIntro;

export type Article = { title: string; href: Href };

export type StudyStage = {
  id: "prelims" | "mains" | "quest";
  label: string;
  /** Six: the first is the lead story, the other five the headlines beside it (numbered 02 to 06). */
  articles: Article[];
  /** The lead story's photo, 680 × 300 in the design, shown with a light sepia. */
  leadImage: string;
  /** "View more" under the page: the stage's listing on the live site. */
  moreHref: Href;
};

/** One stage's articles, all opening the same address. */
const articles = (href: Href, titles: string[]): Article[] => titles.map((title) => ({ title, href }));

/**
 * The design's lead photo: front pages of August 1947. It is drawn as a placeholder, so every edition
 * shows it until the CMS gives each lead story its own image.
 */
// TODO: lead story photo from the CMS
const LEAD_PLACEHOLDER = "/images/free-resources/lead-1947-front-pages.webp";

/**
 * The design only shows the Mains edition. The Prelims and Quest titles carry over from the previous
 * homepage until the client supplies the pieces for those editions. Articles have no pages of their own
 * yet, so each one opens its stage's listing on the live site.
 */
export const studyStages: StudyStage[] = [
  {
    id: "prelims",
    label: "Prelims",
    moreHref: links.currentAffairsPrelims,
    leadImage: LEAD_PLACEHOLDER,
    // TODO: article address from the CMS
    articles: articles(links.currentAffairsPrelims, [
      "United Kingdom Maritime Trade Operations (UKMTO)",
      "Mauritius",
      "Narwhals",
      "Thiksey Monastery",
      "Long Tailed Marmot",
      "Squint Eye",
    ]),
  },
  {
    id: "mains",
    label: "Mains",
    moreHref: links.currentAffairsMains,
    leadImage: LEAD_PLACEHOLDER,
    // TODO: article address from the CMS
    articles: articles(links.currentAffairsMains, [
      "Mobile Phone Manufacturing Scheme (MPMS) – From Assembly Hub to Indian-Owned Brands",
      "US–India Trade Tensions: The Great Transhipment Scam and Tariff Allegations",
      "U.S.–India Electoral Systems: Trump’s Voting ID Rules and the SAVE America Act",
      "NITI Aayog Report Flags Large Gap Between Education and Employment for Indian Youth",
      "India’s Sugar Price Hike: Causes, Government Response and the Ethanol Debate",
      "Census 2027 Questionnaire – New Questions, NPR Link and Concerns Over Data Collection",
    ]),
  },
  {
    id: "quest",
    label: "Quest",
    moreHref: links.studyMaterial,
    leadImage: LEAD_PLACEHOLDER,
    // TODO: article address from the CMS
    articles: articles(links.studyMaterial, [
      "UN Reforms, Need, Security Council, General Assembly, Challenges",
      "World Meteorological Organization (WMO), Headquarters, Members",
      "Article 21, Rights, Doctrines, Challenges, Case Laws, Way Forward",
      "Reserve Bank of India (RBI), Governor, Structure, Functions",
      "Federalism in Indian Polity, Significance, Features",
      "Muslim League, Background, Formation, Objectives, Impacts",
    ]),
  },
];

/** The Mains edition is on the stands first, as drawn: it carries the Current Affairs pieces. */
export const defaultStage: StudyStage["id"] = "mains";

/** A resource with a null `href` (no page yet) renders as plain text, not a link. */
export type FreeResource = { label: string; href: Href };

/** "Also free", along the foot of the page. */
export const otherResources: FreeResource[] = [
  { label: "Monthly magazine", href: links.monthlyMagazine },
  { label: "Yojana & Kurukshetra", href: links.yojanaKurukshetra },
  { label: "Previous year papers", href: links.previousYearPapers },
  { label: "Toppers’ answer sheets", href: links.toppersAnswerSheets },
  { label: "Essay practice", href: links.essayPractice },
];
