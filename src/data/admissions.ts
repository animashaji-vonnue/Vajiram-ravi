import type { HeadingParts } from "@/data/programmes";
import { links, type Href } from "@/data/links";

export type BatchMode = "Classroom" | "LIVE-Online";

/** A batch, as the batch CMS will send it. */
export type Batch = {
  id: string;
  programme: string;
  /** Start date, ISO with the year (YYYY-MM-DD). Batches that have started are hidden. */
  startDate: string;
  /** Which modes the batch runs in, for the All / Classroom / LIVE-Online filter. */
  modes: BatchMode[];
  /** The UPSC CSE year the batch prepares for. */
  targetYear: number;
  /** Only when the batch is actually flagged: the ticket then carries the "Limited seats" stamp. */
  seatStatus?: "limited";
  /** Only when admissions have confirmed it: the ticket then reads "Admissions open". */
  admissionOpen?: boolean;
  /**
   * The batch the featured ticket above the track already shows (FeaturedBatch): the track leaves it out,
   * so it is not shown twice. It stays in the list for the site search.
   */
  featured?: boolean;
  /** The faint line drawing on the ticket's head, one for each batch's subject (BatchTicket's TicketArt). */
  art?: TicketArtName;
};

/** The ticket heads' line drawings: a camp tent, a globe, a newspaper and an open book. */
export type TicketArtName = "camp" | "globe" | "newspaper" | "book";

const BOTH: BatchMode[] = ["Classroom", "LIVE-Online"];

/** Every batch in the CMS. The page shows those that have not started yet (see upcomingBatches). */
// TODO: per-batch detail pages. Until the CMS gives each batch its page, "Details" opens the programme's page
// where we know it (the GS programme) and the live site's upcoming batches listing otherwise.
export const batches: Batch[] = [
  {
    id: "gs-pcm-2027",
    programme: "General Studies Prelims cum Mains Programme 2027",
    startDate: "2026-11-27",
    modes: BOTH,
    targetYear: 2027,
    admissionOpen: true,
    featured: true,
  },
  {
    id: "prelims-camp-3",
    programme: "Prelims CAMP Batch 3",
    startDate: "2027-01-03",
    modes: BOTH,
    targetYear: 2027,
    seatStatus: "limited",
    art: "camp",
  },
  {
    id: "smart-prelims-ca-2026",
    programme: "SMART Prelims Current Affairs Programme 2026",
    startDate: "2027-01-17",
    modes: BOTH,
    targetYear: 2027,
    seatStatus: "limited",
    art: "globe",
  },
  {
    // TODO: confirm with client — stale? It targets UPSC CSE 2026, which has passed. The design names no
    // mode for it either; LIVE-Online until admissions confirm.
    id: "smart-ca-2026",
    programme: "SMART Current Affairs Program 2026",
    startDate: "2027-01-17",
    modes: ["LIVE-Online"],
    targetYear: 2026,
    seatStatus: "limited",
    art: "newspaper",
  },
  {
    id: "gs-comprehensive-11m",
    programme: "11 Months Prelims cum Mains General Studies Comprehensive Programme",
    startDate: "2027-01-29",
    modes: BOTH,
    targetYear: 2027,
    art: "book",
  },
];

/** Today as YYYY-MM-DD in the visitor's own time zone. */
export function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/** The batches that have not started by `today` (YYYY-MM-DD), earliest first. */
export function upcomingBatches(today: string): Batch[] {
  return batches.filter((batch) => batch.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export const batchFilters = ["All", "Classroom", "LIVE-Online"] as const;
export type BatchFilter = (typeof batchFilters)[number];

/** Upcoming Batches & Admissions (IA 5; Figma "04 · Upcoming Batches", 2377:4662), in the client's copy of 10 Nov 2026. */
export const batchesCopy = {
  title: { before: "Explore", em: "upcoming batches", after: "for your UPSC preparation." } satisfies HeadingParts,
  lead: "Check upcoming start dates, learning options and programme details to plan your preparation with confidence.",
  viewAll: "View all upcoming batches",
  empty: "No batches for this selection",
  emptyLink: "get notified",
};

/** The featured batch, on the wide ticket above the batch tabs. */
export const featuredBatch = {
  label: "Featured batch",
  programme: "General Studies – Prelims & Mains",
  status: "Admissions open",
  targetYear: 2028,
  kind: "UPSC CSE preparation programme",
  /** The batch's start, as the ticket shows it under "Batch starts". */
  // TODO: placeholder. The client's copy has "[Verified date]" here: replace this with the verified start
  // date (e.g. "12 July 2027") when admissions confirm it.
  start: "January 2027 (to be confirmed)",
  /** The ticket's details, in the copy's order. */
  details: { start: "Batch starts", mode: "Mode", location: "Location" },
  mode: "Classroom / LIVE-Online",
  location: "New Delhi (for classroom)",
  cta: { label: "View programme details", href: links.gsCourse as Href },
};

/** The choices of "Preferred learning mode" in the counselling form. */
export const learningModes: BatchMode[] = ["Classroom", "LIVE-Online"];

/** Counselling & Academic Guidance (IA 6; Figma "05 · Personalised Counselling", 2377:4839) and its postcard form. */
export const counsellingCopy = {
  title: { before: "Let's talk about", em: "your UPSC preparation.", after: "" } satisfies HeadingParts,
  text: [
    "Have questions about programmes, upcoming batches or learning options? Our academic counsellors can help you understand the available choices and guide you towards the right preparation path.",
  ],
  cta: "Get expert guidance",
  postcardTitle: "Book your free session today!",
  labels: {
    name: "Full name",
    phone: "Mobile number",
    email: "Email address",
    programme: "Programme of interest",
    mode: "Preferred learning mode",
    query: "Your query",
  },
  /** After "Your query", which is the one field that may stay empty. */
  optional: "(optional)",
  /** The hints in an empty field once it has the focus and its label has risen to the border. */
  placeholders: {
    name: "Your full name",
    email: "you@email.com",
    programme: "Pick a programme",
    mode: "Pick a mode",
    query: "What would you like to ask?",
  },
  submit: "Request a call back",
  thanks: "Thank you",
  thanksText: "Your postcard is on its way. A counsellor will call you soon.",
  again: "Book another session",
  /** Shown above the button when sending fails. */
  failed: "Couldn’t send that. Please try again.",
  errors: {
    name: "Enter your name",
    phone: "Enter a 10-digit mobile number",
    email: "Enter a valid email",
    programme: "Choose a programme",
    mode: "Choose a learning mode",
  },
};
