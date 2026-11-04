import type { ComponentType } from "react";
import {
  CalendarIcon,
  ChatBubbleIcon,
  ListChecksIcon,
  PenLineIcon,
  QuoteMarkIcon,
  ScaleIcon,
  type IconProps,
} from "@/components/icons";
import type { Faq } from "./faqs";

/** The Recitals, Vajiram & Ravi's monthly current affairs magazine: all copy and the issue archive for the magazine page. */

export const magazine = {
  name: "The Recitals",
  /** Date printed on the latest issue, shown in the hero. */
  latestPublished: "25 September 2026",
  firstIssue: "May 2019",
};

/** The covers and PDFs are served from the same object storage the live site uses. */
const CDN = {
  a: "https://vajiramias.sgp1.digitaloceanspaces.com/",
  b: "https://vajiramias.sgp1.cdn.digitaloceanspaces.com/strapi/",
  c: "https://sgp1.digitaloceanspaces.com/vajiramias/",
} as const;

type Src = `${keyof typeof CDN}:${string}`;
const url = (src: Src) => CDN[src[0] as keyof typeof CDN] + src.slice(2);

export type Issue = {
  month: string;
  year: number;
  /** "September 2026" */
  label: string;
  cover: string;
  pdf: string;
  /** Page count and file size, shown on the card so a reader knows what they are opening. */
  pages: number;
  size: string;
};

/** Newest first. [label, cover, pdf] */
const rows: Array<[string, Src, Src]> = [
  ["September 2026", "a:RECITALS_COVER_Page_September_2026_136597a977.webp", "c:The_Recitals_September_c120d2e239.pdf"],
  ["August 2026", "a:The_Recital_August_2026_77bd7bcb5e.webp", "c:the_Recital_August_2026_1d736b8d64.pdf"],
  ["July 2026", "a:The_Recitals_July_2026_Cover_Page_502628005c.webp", "c:Recitals_July2026_fb676a8ae1.pdf"],
  ["June 2026", "a:RECITALS_JUNE_COVER_page_page_001_4fc9b2a2d1.webp", "c:Recital_June2026_f87319ee08.pdf"],
  ["May 2026", "a:RECITALS_COVER_page_final_digital_May_2026_pdf_259cd67057.webp", "c:Recitals_May_9fcac46786.pdf"],
  ["April 2026", "a:Recitals_April_Cover_page_83512b9ad4.webp", "c:The_Recitas_April_e5e82849e3.pdf"],
  ["March 2026", "b:RECITALS_COVER_page_March_2026_1_3e82fa8c56.webp", "b:The_Recitals_March2026_6ae82ffdc4.pdf"],
  ["February 2026", "b:RECITALS_COVER_page_7bf4d79db5.webp", "b:RECITALS_Feb_2026_fca0978dbe.pdf"],
  ["January 2026", "b:t_HE_RECITALS_COVER_PAGE_e44347d46a.webp", "b:The_Recital_January_f4b9b3a8c2.pdf"],
  ["December 2025", "b:RECITALS_COVER_December_2025_01546be031.webp", "b:Recital_December_2025_4bf1164161.pdf"],
  ["November 2025", "b:RECITALS_COVER_November_2025_f6bcae7ba8.webp", "b:The_Recital_November_2025_041d559513.pdf"],
  ["October 2025", "b:Cover_Page_The_Recitals_October_2025_67baa6281a.webp", "b:The_Recitals_Oct_2025_aadbea55c6.pdf"],
  ["September 2025", "b:RECITALS_COVER_PAGE_September_2025_d6e4741fc3.webp", "b:Recitals_September_c7fe5044de.pdf"],
  ["August 2025", "b:Recitals_August_New_65f0d6a65e.webp", "b:The_Recitals_August2025_07b0a438c3.pdf"],
  ["July 2025", "b:RECITALS_COVER_July_2025_6386523120.webp", "b:RECITALS_July_2025_cd862eff73.pdf"],
  ["June 2025", "b:RECITALS_COVER_june_2025_2e78063993.webp", "b:Recitals_June_9300a9962b.pdf"],
  ["May 2025", "b:RECITALS_May_2025_Cover_page_edb9898549.webp", "b:The_Recitals_May_2025_5306dd4976.pdf"],
  ["April 2025", "b:RECITALS_April_2025_Cover_page_dd0f055317.webp", "b:Recitals_April_25_merged_178eaa3b94.pdf"],
  ["March 2025", "b:RECITALS_March_2025_Cover_page_004940e77b.webp", "b:The_Recital_March_2025_1ede07a72c.pdf"],
  ["February 2025", "b:RECITALS_Cover_page_2161561072.webp", "b:RECITALS_Cover_page_2025_Feb_d09cab0c17.pdf"],
  ["January 2025", "b:cover_page_1_page_0001_ad3262ffc3.webp", "b:Recitals_jan_25_2_aea2e28071_ea91e0f63f.pdf"],
  ["December 2024", "b:The_Recitals_Dec_2024_Cover_Page_9d6b3b64b2.webp", "b:The_Recitals_Dec_2024_08_01_5b2a8b8dd0.pdf"],
  ["November 2024", "b:Cover_Page_Recitals_Nov_page_0001_7aa2731abf.webp", "b:Recital_Nov_Merged_e9302c4c33.pdf"],
  ["October 2024", "b:RECITALS_Oct_Cover_Page_page_0001_0e44251b67.webp", "b:Recitals_Oct_24_932648bbe6.pdf"],
  ["September 2024", "b:RECITALS_Cover_P_Age_42c8217f46.webp", "b:RECITALS_Sept_c9a7939a4a.pdf"],
  ["August 2024", "b:The_Recitals_Aug_Cover_Page_a1619f59d5.webp", "b:The_Recitals_Aug_240cf94c63.pdf"],
  ["July 2024", "b:Cover_Page_Recitals_3b60fbcdcf.webp", "b:Cover_Page_Recitals_merged_dc942de231.pdf"],
  ["June 2024", "b:freecompress_June_RECITALS_01_4acd2064e1.webp", "b:June_RECITALS_01_merged_da5977274b.pdf"],
  ["May 2024", "b:Cover_Page_Recitals_May_25ffa7a207.jpg", "b:The_Recitals_May2024_updated_c8abecc534.pdf"],
  ["April 2024", "b:Cover_Recitals_April_17c545371c.jpg", "b:Recitals_April_4af2e15ada.pdf"],
  ["March 2024", "b:Cover_Page_March_RECITALS_01_1_e8198282c3.jpg", "b:The_Recitals_March_24_pdf_65245bb587.pdf"],
  ["February 2024", "b:Cover_Page_The_Recitals_Feb_2024_ef9427ef4f.jpg", "b:The_Recitals_Feb_2024_final_b731031d67.pdf"],
  ["January 2024", "b:Cover_Page_8eb27f4fb1.jpg", "b:The_Recitals_January_2024_1_cc8aff0999.pdf"],
  ["December 2023", "b:Cover_Page_Recitals_December_2023_1206f692bf.jpg", "b:The_Recitals_December_2023_4fb4550db5.pdf"],
  ["November 2023", "b:RECITALS_NOVEMBER_COVER_01_1_76156570ab.jpg", "b:The_Recital_Nov_2023_1_2c0a8d37f9.pdf"],
  ["October 2023", "b:RECITALS_OCTOBER_COVER_01_9e693fd20c.jpg", "b:The_Recitals_Oct_2023_9ee1ef0bcc.pdf"],
  ["September 2023", "b:RECITALS_SEPTEMBER_COVER_jpg_4886b31c35.jpg", "b:Recitals_September_23_8893a2079f.pdf"],
  ["August 2023", "b:recitals_cover_august_tiff_02_1_1_ff430ae582.jpg", "b:Recitals_August_2023_f18d7d693c.pdf"],
  ["July 2023", "b:July_2023_6fe1a2a691.png", "b:recitals_july_2023_merged_0de7efe1fe.pdf"],
  ["June 2023", "b:June_2023_1cc7a6d9dd.png", "b:The_Recitals_June_2023_new_cfadc53d7f.pdf"],
  ["May 2023", "b:May_2023_c45366dbd4.png", "b:The_Recitals_May_2023_new_8645c736a8.pdf"],
  ["April 2023", "b:April_2023_2cb3850709.jpg", "b:Vajiram_April_2023_Recitals_f2695f4aca.pdf"],
  ["March 2023", "b:March_2023_a0d05c8b38.png", "b:Vajiram_The_Recitals_Current_Affairs_March_2023_0427499f92.pdf"],
  ["February 2023", "b:Feb_2023_2ac043c2b7.jpg", "b:The_Recitals_Feb_2023_13e78148c2.pdf"],
  ["January 2023", "b:January_2023_2545c5b3b4.jpg", "b:The_Recitals_January_2023_119af1e74e.pdf"],
  ["December 2022", "b:Dec_2022_bb1e597ebc.jpg", "b:The_Recitals_December_2022_Vajiram_IAS_cea40a635f.pdf"],
  ["November 2022", "b:Nov_2022_46acafcd66.jpg", "b:The_Recitals_Nov_2022_2f103e63cf.pdf"],
  ["October 2022", "b:October_2022_c19a309276.jpg", "b:The_Recitals_October_2022_Vajiram_b349a53b79.pdf"],
  ["September 2022", "b:Sept_2022_bf80dfd450.jpg", "b:The_Recitals_September_2022_46840d27c3.pdf"],
  ["August 2022", "b:August_2022_13481c5edf.png", "b:the_recitals_august_2022_fa29d9031c.pdf"],
  ["July 2022", "b:July_2022_7b80ea7006.png", "b:the_recitals_july_2022_c32ece93df.pdf"],
  ["June 2022", "b:June_2022_965682065f.jpg", "b:the_recitals_june_2022_6571b58e26.pdf"],
  ["May 2022", "b:May_2022_34b088c4a1.png", "b:the_recitals_may_2022_77ac6e6acf.pdf"],
  ["April 2022", "b:April_2022_c1cad31640.jpg", "b:the_recitals_april_2022_586808a9c2.pdf"],
  ["March 2022", "b:March_2022_c6d82e4d68.png", "b:the_recitals_march_2022_vajiram_0c9352d601.pdf"],
  ["February 2022", "b:February_2022_64d920aab6.png", "b:the_recitals_february_2022_vajiram_3aafa2e23d.pdf"],
  ["January 2022", "b:January_2022_84e4f6a549.jpg", "b:the_recitals_january_2022_vajiram_753bd8d545.pdf"],
  ["December 2021", "b:December_2021_c6990169df.jpg", "b:the_recitals_december_2021_vajiram_01aeae2028.pdf"],
  ["November 2021", "b:November_2021_e1f568f4a9.jpeg", "b:the_recitals_november_2021_vajiram_f7dcaffd0d.pdf"],
  ["October 2021", "b:October_2021_033fdf156e.jpg", "b:the_recitals_october_2021_vajiram_f2b7e49a1f.pdf"],
  ["September 2021", "b:September_2021_68dcf85071.jpg", "b:the_recitals_september_2021_vajiram_fa427ca70e.pdf"],
  ["August 2021", "b:August_2021_a643d95a55.jpg", "b:the_recitals_august_2021_vajiram_a9d2ffce17.pdf"],
  ["July 2021", "b:July_2021_d4abdebb1b.jpg", "b:the_recitals_july_2021_vajiram_067739354b.pdf"],
  ["June 2021", "b:June_2021_cc6473275e.jpg", "b:the_recitals_june_2021_vajiram_5e58b5a057.pdf"],
  ["May 2021", "b:May_2021_5084999aa5.jpg", "b:the_recitals_may_2021_vajiram_f6a347203f.pdf"],
  ["April 2021", "b:April_2021_bdedd6530a.jpg", "b:the_recitals_april_2021_vajiram_a73606726d.pdf"],
  ["March 2021", "b:March_2021_c6086057ab.jpg", "b:the_recitals_march_2021_vajiram_1e28df5cc5.pdf"],
  ["February 2021", "b:February_2021_a74c11da84.jpg", "b:the_recitals_february_2021_vajiram_abff3b4d8a.pdf"],
  ["January 2021", "b:January_2021_f0ede3a5b4.jpg", "b:the_recitals_january_2021_vajiram_a8bedb90c6.pdf"],
  ["December 2020", "b:December_2020_e2b0d5dbd8.jpg", "b:the_recitals_december_2020_vajiram_239404ebb1.pdf"],
  ["November 2020", "b:November_2020_c4ad9e1b52.jpg", "b:the_recitals_november_2020_vajiram_e6c567dd41.pdf"],
  ["October 2020", "b:October_2020_05bbde21e0.jpg", "b:the_recitals_october_2020_vajiram_c1c3c6ec38.pdf"],
  ["September 2020", "b:September_2020_84937a2144.jpg", "b:the_recitals_september_2020_vajiram_971601d4d6.pdf"],
  ["August 2020", "b:August_2020_c608631dc3.jpg", "b:the_recitals_august_2020_vajiram_10b08713a3.pdf"],
  ["July 2020", "b:July_2020_ebdd5a9ea3.jpg", "b:the_recitals_july_2020_vajiram_bead063c4e.pdf"],
  ["June 2020", "b:June_2020_542aa4b69a.jpg", "b:the_recitals_june_2020_vajiram_dd2d555567.pdf"],
  ["May 2020", "b:May_2020_94b89bbd49.jpg", "b:the_recitals_may_2020_vajiram_2664e02690.pdf"],
  ["April 2020", "b:April_2020_b0468204c8.jpg", "b:the_recitals_april_2020_vajiram_d0f2962f64.pdf"],
  ["March 2020", "b:March_2020_f6ac359cbb.jpg", "b:the_recitals_march_2020_vajiram_51d7d68675.pdf"],
  ["February 2020", "b:February_2020_c3e6ae9a41.jpg", "b:the_recitals_february_2020_vajiram_8da73d5a88.pdf"],
  ["January 2020", "b:January_2020_47cfb18960.jpg", "b:the_recitals_january_2020_vajiram_c5f6d59e05.pdf"],
  ["December 2019", "b:December_2019_fe8583ac1f.jpg", "b:the_recitals_december_2019_vajiram_a96764417b.pdf"],
  ["November 2019", "b:November_2019_788af78733.jpg", "b:the_recitals_november_2019_3e1cf02c9a.pdf"],
  ["October 2019", "b:October_2019_b23f22e71b.jpg", "b:the_recitals_october_2019_5e51fdc8c8.pdf"],
  ["September 2019", "b:September_2019_a2e572e9e2.jpg", "b:September_2019_The_Recitals_e8c40d59d9.pdf"],
  ["August 2019", "b:August_2019_3f440affe0.jpg", "b:the_recitals_august_2019_7b3742c728.pdf"],
  ["July 2019", "b:July_2019_4d1f6784f2.jpg", "b:the_recitals_july_2019_f413152195.pdf"],
  ["June 2019", "b:June_2019_12fb81f97c.jpg", "b:the_recitals_june_2019_49a6a61e8d.pdf"],
  ["May 2019", "b:May_2019_210ad7ecd1.jpg", "b:the_recitals_may_2019_c9ae17f549.pdf"],
];

export const issues: Issue[] = rows.map(([label, cover, pdf], i) => {
  const [month, year] = label.split(" ");
  return {
    month,
    year: Number(year),
    label,
    cover: url(cover),
    pdf: url(pdf),
    // Placeholder figures until the real ones come from the content team.
    pages: 104 + ((i * 7) % 22),
    size: `${(17.4 + ((i * 13) % 50) / 10).toFixed(1)} MB`,
  };
});

export const latestIssue = issues[0];

/** Years with at least one issue, newest first. */
export const issueYears = Array.from(new Set(issues.map((issue) => issue.year))).sort((a, b) => b - a);

export const magazineStats: { value: string; label: string }[] = [
  { value: "600+", label: "Prelims MCQs a year" },
  { value: "600+", label: "Mains Q&A a year" },
  { value: "5", label: "Sections an issue" },
  { value: `${issues.length}`, label: "Issues since 2019" },
];

export type Stage = "Prelims" | "Mains" | "Interview" | "Essay" | "Ethics";

export type IssueSection = {
  title: string;
  description: string;
  stages: Stage[];
};

/** The five fixed sections of every issue, in the order they appear in the magazine. */
export const issueSections: IssueSection[] = [
  {
    title: "Feature article",
    description: "Two or three critical topics of the month, analysed in depth with background, debate and the way forward.",
    stages: ["Essay", "Mains"],
  },
  {
    title: "Mains Q&A",
    description:
      "Contemporary issues written as model answers, with an “Extra Mile” note on each for the detail that lifts a good answer.",
    stages: ["Mains"],
  },
  {
    title: "Prelims Q&A",
    description: "UPSC-level multiple-choice questions on the month’s news, each with an explanation to revise from.",
    stages: ["Prelims"],
  },
  {
    title: "Bridging gaps",
    description: "The facts and developments that do not fit a question format but still matter for the exam.",
    stages: ["Prelims", "Mains"],
  },
  {
    title: "Case study",
    description: "A real-world dilemma for GS Paper 4, with the analysis and a worked solution.",
    stages: ["Ethics", "Interview"],
  },
];

export type StageUse = {
  title: string;
  description: string;
  icon: ComponentType<IconProps>;
};

/** How the magazine helps at each stage of the exam. */
export const stageUses: StageUse[] = [
  {
    title: "Prelims",
    description:
      "Hundreds of MCQs to UPSC standard show how a news item turns into a question, and build a year of revision material.",
    icon: ListChecksIcon,
  },
  {
    title: "Mains",
    description:
      "Structured answers teach you to address the demand of the question and connect events to their political, economic and social context.",
    icon: PenLineIcon,
  },
  {
    title: "Interview",
    description:
      "Issues are presented from several perspectives, so you can discuss them coherently and with confidence before the board.",
    icon: ChatBubbleIcon,
  },
  {
    title: "Essay",
    description: "The feature articles build the multidimensional view of an issue that a compelling essay needs.",
    icon: QuoteMarkIcon,
  },
  {
    title: "Ethics (GS Paper 4)",
    description: "The monthly case study gives practical exposure to ethical reasoning and decision-making.",
    icon: ScaleIcon,
  },
  {
    title: "Long-term readiness",
    description: "One issue a month, read on time, replaces the last-minute compilation and keeps what you learn.",
    icon: CalendarIcon,
  },
];

/** What comes with the magazine on the Student Portal and the mobile app. */
export const portalFeatures: { title: string; description: string }[] = [
  { title: "Daily news snippets", description: "The day’s developments, filtered for the exam." },
  { title: "Editorial summaries", description: "The arguments of the day’s editorials, in brief." },
  { title: "Daily quiz and monthly tests", description: "Check what you retained before the month closes." },
  { title: "News archive", description: "Every past article and issue, searchable in one place." },
];

export const magazineFaqs: Faq[] = [
  {
    question: "Is The Recitals free?",
    answer: "Yes. Every issue, back to May 2019, is a free PDF. Open any cover on this page to download it.",
  },
  {
    question: "When does a new issue come out?",
    answer:
      "Once a month, after the month ends, so each issue covers a complete month of news. The latest issue appears at the top of the archive.",
  },
  {
    question: "Which stages of the exam does it cover?",
    answer:
      "All three. Prelims through the MCQs, Mains through the model answers and feature articles, and the Interview through the multi-perspective analysis. The case study section covers Ethics, GS Paper 4.",
  },
  {
    question: "How is it different from a current affairs compilation?",
    answer:
      "A compilation summarises the news. The Recitals turns each issue into the form UPSC asks it in: a multiple-choice question, a model answer or a case study, so reading it is also practice.",
  },
  {
    question: "Which issues should I read for the 2027 attempt?",
    answer:
      "Everything from roughly eighteen months before the exam. For 2027 that means January 2026 onwards, with the most recent twelve read closely and the older ones used for revision.",
  },
  {
    question: "Can I read an issue without downloading it?",
    answer:
      "Yes. Read opens the issue in your browser, and the download arrow saves the PDF only if you want your own copy.",
  },
  {
    question: "Do I have to register or share my email?",
    answer: "No. There is no sign-in, no form and no email wall on any issue, including the current one.",
  },
  {
    question: "Is the magazine enough on its own for current affairs?",
    answer:
      "It is the monthly consolidation. For the daily layer, Vajiram & Ravi’s Student Portal and app add news snippets, editorial summaries and a daily quiz, and the Current Affairs programme adds classes and tests.",
  },
];

/* ------------------------------------------------------------------ why monthly ------- */

export const whyMonthlyStats = [
  { value: "50%+", label: "Share of the GS syllabus current affairs touches" },
  { value: "1 hour", label: "To re-read a month you have already worked through" },
  { value: "12 files", label: "A whole year of current affairs, not 300 loose notes" },
  { value: "0 gaps", label: "Nothing skipped — unbroken since May 2019" },
];

export const whyMonthlyArguments: { title: string; body: string }[] = [
  {
    title: "Current affairs touches more than half the General Studies syllabus.",
    body: "Access to news is not the problem. Every aspirant has more of it than they can read. The problem is turning a year of it into something you can revise in a week.",
  },
  {
    title: "A monthly compilation fixes the unit of revision.",
    body: "One file, one sitting, one month of the syllabus — something you can finish and tick off, instead of an endless feed that never reaches a bottom.",
  },
  {
    title: "The Recitals goes further by changing the format.",
    body: "Most compilations hand you summaries and leave the conversion to exam questions up to you. This one is already written as the questions UPSC asks, so reading it is practice.",
  },
  {
    title: "The compounding matters more than any single issue.",
    body: "Twelve issues give you roughly 600 Prelims questions and 600 Mains answers, built on the months you actually lived through rather than a list handed to you in April.",
  },
];

/* ------------------------------------------------------------------ how to use -------- */

export const readingPasses: { when: string; minutes: string; title: string; body: string }[] = [
  {
    when: "Within a week",
    minutes: "90 min",
    title: "Read it through with the pen down",
    body: "One sitting, no notes, no highlighter. You are building recognition, not records. Most of what you need later is remembering that you have met a topic before.",
  },
  {
    when: "Three weeks later",
    minutes: "45 min",
    title: "Attempt the Prelims Q&A cold",
    body: "Answer the questions without looking back at the articles. The ones you get wrong are the pages worth re-reading, and nothing else is.",
  },
  {
    when: "End of the month",
    minutes: "60 min",
    title: "Pull the Mains notes out and file them",
    body: "Move the answers and the Extra Mile points into one page per topic. By the end of the year that file, not the magazines, is what you revise from.",
  },
];

export const readingTotal = "About three and a half hours an issue, spread across the month it covers.";

/* ------------------------------------------------------------------ read alongside ---- */

export type Collection = { title: string; body: string; cta: string };

export const collections: Collection[] = [
  {
    title: "Yojana Summary",
    body: "Month-by-month summaries of the government's development magazine, with the schemes and arguments an examiner expects you to know.",
    cta: "Open the booklets",
  },
  {
    title: "Kurukshetra Summary",
    body: "Rural development, agriculture and the panchayat system, summarised each month so you are not reading the full magazine twice.",
    cta: "Open the booklets",
  },
  {
    title: "Prelims Quick Revision",
    body: "Condensed booklets built for the last six weeks before Prelims, when there is no time left to read anything at full length.",
    cta: "Open the booklets",
  },
  {
    title: "GS Mains Probable",
    body: "Probable Mains questions on the year's themes, with structure hints, so you can practise before the test series starts.",
    cta: "Open the booklets",
  },
];

/* ------------------------------------------------------------------ page sections ----- */

export const pageSections = [
  { id: "latest", label: "Latest issue" },
  { id: "archive", label: "The archive" },
  { id: "inside", label: "Inside an issue" },
  { id: "how", label: "How to use it" },
  { id: "why", label: "Why monthly" },
  { id: "alongside", label: "Read alongside" },
  { id: "faq", label: "FAQ" },
];
