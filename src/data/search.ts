import { batches } from "@/data/admissions";
import { campuses } from "@/data/contact";
import { educators } from "@/data/faculty";
import { faqEntries } from "@/data/faq-chat";
import { bentoProgrammes } from "@/data/programme-bento";
import { mainNav } from "@/data/site";
import { studyStages } from "@/data/study-materials";
import { toppersByYear, toppersYear } from "@/data/toppers";

/** One thing the nav search can find, and where on the page it leads. */
export type SearchItem = {
  group: "Sections" | "Programmes" | "Upcoming batches" | "Faculty" | "Study materials" | "FAQs" | "Toppers";
  title: string;
  detail?: string;
  /** An anchor on this page. */
  href: string;
};

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const sections: SearchItem[] = [
  ...mainNav.filter((link) => link.href.startsWith("#") && link.href.length > 1).map((link) => ({ group: "Sections" as const, title: link.label, href: link.href })),
  { group: "Sections", title: "General Studies programme", detail: "Our flagship programme", href: "#gs-programme" },
  { group: "Sections", title: "Learn from top educators", detail: "Faculty", href: "#faculty" },
  { group: "Sections", title: "Talk to a counsellor", detail: "Book your free session", href: "#counsellor" },
  { group: "Sections", title: "Hear it from our students", detail: "Success stories", href: "#stories" },
  { group: "Sections", title: "Our locations", detail: campuses.map((campus) => campus.city).join(" and "), href: "#locations" },
];

/** Everything the search looks through, built from the page's own data. */
export const searchIndex: SearchItem[] = [
  ...sections,
  ...bentoProgrammes.map((p) => ({ group: "Programmes" as const, title: p.title, detail: p.modes, href: "#courses" })),
  ...batches.map((b) => ({ group: "Upcoming batches" as const, title: b.programme, detail: `Starts ${formatDate(b.startDate)}`, href: "#batches" })),
  ...educators.map((e) => ({ group: "Faculty" as const, title: e.name, detail: e.focus, href: "#faculty" })),
  ...studyStages.flatMap((stage) =>
    stage.articles.map((a) => ({ group: "Study materials" as const, title: a.title, detail: stage.label, href: "#resources" })),
  ),
  ...faqEntries.map((f) => ({ group: "FAQs" as const, title: f.question, href: "#faq" })),
  // The toppers on the page: this year's ranks 1 to 10 (the stamp carousel has no year switch).
  ...(toppersByYear[toppersYear] ?? []).map((t) => ({
    group: "Toppers" as const,
    title: t.name,
    detail: `AIR ${t.rank} · CSE ${toppersYear}`,
    href: "#toppers",
  })),
];

/** What the search shows before anything is typed. */
export const searchSuggestions: SearchItem[] = [
  ...sections.slice(0, 4),
  ...searchIndex.filter((item) => item.group === "Programmes").slice(0, 4),
];
