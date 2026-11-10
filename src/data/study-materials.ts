import { links, type Href } from "@/data/links";

/**
 * Free study materials & resources (IA 9; Figma "10 Free resources · newspaper front page", 2392:5785),
 * laid out as a newspaper's front page. Copy: the client's homepage content, §09.
 */
export const resourcesIntro = {
  eyebrow: "LEARN. PRACTISE. STAY UPDATED.",
  /** The H2, the paper's masthead; the emphasis is its italic second beat. */
  heading: { before: "Make", emphasis: "every day", after: "of preparation count." },
  lead: "Access useful study materials, current affairs analysis and practice resources to support your UPSC preparation.",
};

/** One free resource: its name, the content's sentence about it, and its link's wording. */
export type FreeResource = { title: string; text: string; cta: string; href: Href };

/** Where each resource sits on the front page. */
export const freeResources = {
  /** The lead story, under the masthead. */
  lead: {
    title: "The Recitals",
    text: "Stay informed with the monthly current affairs magazine featuring important developments, Prelims questions, Mains answers and analytical coverage.",
    cta: "Read The Recitals",
    href: links.theRecitals,
  },
  /** The three columns under the lead. */
  columns: [
    {
      title: "Daily Current Affairs",
      text: "Stay updated with important national and international developments relevant to the Civil Services Examination.",
      cta: "Read Daily Updates",
      href: links.dailyCurrentAffairs,
    },
    {
      title: "Prelims Pointers",
      text: "Revise examination-relevant information through focused current affairs notes and preparation resources.",
      cta: "Explore Prelims Pointers",
      href: links.prelimsPointers,
    },
    {
      title: "Mains Articles & Editorial Analysis",
      text: "Develop a deeper understanding of current issues and strengthen your analytical approach through relevant articles and editorial analysis.",
      cta: "Explore Mains Resources",
      href: links.mainsArticles,
    },
  ],
  /** Along the foot of the page. */
  foot: {
    title: "UPSC Study Materials",
    text: "Browse notes, infographics, revision resources and other study materials to support your preparation.",
    cta: "View All Study Materials",
    href: links.studyMaterial,
  },
} satisfies { lead: FreeResource; columns: FreeResource[]; foot: FreeResource };

/** The five resources in the content's order. */
export const freeResourceList: FreeResource[] = [freeResources.lead, ...freeResources.columns, freeResources.foot];
