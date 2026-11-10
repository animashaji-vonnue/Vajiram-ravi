import { batches } from "@/data/admissions";
import { campuses } from "@/data/contact";
import { educators } from "@/data/faculty";
import { faqEntries } from "@/data/faq-chat";
import { featuredProgramme, programmes } from "@/data/programmes";
import { mainNav } from "@/data/site";
import { freeResourceList } from "@/data/study-materials";
import { toppers, toppersYear } from "@/data/toppers";

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
  { group: "Sections", title: "Meet our educators", detail: "Faculty", href: "#educators" },
  { group: "Sections", title: "Speak to an academic counsellor", detail: "Request a call back", href: "#counselling" },
  { group: "Sections", title: "Student stories", detail: "Experiences that speak", href: "#stories" },
  { group: "Sections", title: "Our locations", detail: campuses.map((campus) => campus.city).join(" and "), href: "#locations" },
];

/** Everything the search looks through, built from the page's own data. */
export const searchIndex: SearchItem[] = [
  ...sections,
  ...[featuredProgramme.name, ...programmes.map((p) => p.name)].map((title) => ({ group: "Programmes" as const, title, href: "#programmes" })),
  ...batches.map((b) => ({ group: "Upcoming batches" as const, title: b.programme, detail: `Starts ${formatDate(b.startDate)}`, href: "#batches" })),
  ...educators.map((e) => ({ group: "Faculty" as const, title: e.name, detail: e.focus, href: "#educators" })),
  ...freeResourceList.map((r) => ({ group: "Study materials" as const, title: r.title, href: "#resources" })),
  ...faqEntries.map((f) => ({ group: "FAQs" as const, title: f.question, href: "#faq" })),
  // The latest year's top ten, who lead the hero.
  ...toppers.slice(0, 10).map((t) => ({
    group: "Toppers" as const,
    title: t.name,
    detail: `AIR ${t.rank} · CSE ${toppersYear}`,
    href: "#hero",
  })),
];

/** What the search shows before anything is typed. */
export const searchSuggestions: SearchItem[] = [
  ...sections.slice(0, 4),
  ...searchIndex.filter((item) => item.group === "Programmes").slice(0, 4),
];
