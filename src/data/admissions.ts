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
};

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
  },
  {
    id: "prelims-camp-3",
    programme: "Prelims CAMP Batch 3",
    startDate: "2027-01-03",
    modes: BOTH,
    targetYear: 2027,
    seatStatus: "limited",
  },
  {
    id: "smart-prelims-ca-2026",
    programme: "SMART Prelims Current Affairs Programme 2026",
    startDate: "2027-01-17",
    modes: BOTH,
    targetYear: 2027,
    seatStatus: "limited",
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
  },
  {
    id: "gs-comprehensive-11m",
    programme: "11 Months Prelims cum Mains General Studies Comprehensive Programme",
    startDate: "2027-01-29",
    modes: BOTH,
    targetYear: 2027,
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
  eyebrow: "UPCOMING BATCHES",
  title: { before: "Your", em: "next step", after: "starts here." } satisfies HeadingParts,
  lead: "Find an upcoming batch and get the details you need to plan your preparation.",
  viewAll: "View All Upcoming Batches",
  empty: "No batches for this selection",
  emptyLink: "get notified",
};

/** The featured batch, on the wide ticket above the batch tabs. */
export const featuredBatch = {
  label: "Featured Batch",
  programme: "General Studies – Prelims & Mains",
  status: "Admissions Open",
  targetYear: 2028,
  kind: "UPSC CSE Preparation Programme",
  /** The batch's start, as the ticket shows it under "Batch starts". */
  // TODO: placeholder. The client's copy has "[Verified date]" here: replace this with the verified start
  // date (e.g. "12 July 2027") when admissions confirm it.
  start: "January 2027 (to be confirmed)",
  /** The ticket's details, in the copy's order. */
  details: { start: "Batch starts", mode: "Mode", location: "Location" },
  mode: "Classroom / LIVE-Online",
  location: "New Delhi (for classroom)",
  cta: { label: "View Programme Details", href: links.gsCourse as Href },
};

/** The choices of "Preferred Learning Mode" in the counselling form. */
export const learningModes: BatchMode[] = ["Classroom", "LIVE-Online"];

/** Counselling & Academic Guidance (IA 6; Figma "05 · Personalised Counselling", 2377:4839) and its postcard form. */
export const counsellingCopy = {
  eyebrow: "NEED HELP GETTING STARTED?",
  title: { before: "Find", em: "clarity", after: "on your next step." } satisfies HeadingParts,
  text: [
    "Choosing a programme is an important part of your preparation. Whether you’re starting from the beginning, planning your next attempt or looking for focused support, our academic counsellors can help you understand the available options.",
    "Speak with our team to find a programme that aligns with your preparation needs.",
  ],
  cta: "Get Expert Guidance",
  postcardTitle: "Book your free session today!",
  labels: {
    name: "Full Name",
    phone: "Mobile Number",
    email: "Email Address",
    programme: "Programme of Interest",
    mode: "Preferred Learning Mode",
    query: "Your Query",
  },
  /** After "Your Query", which is the one field that may stay empty. */
  optional: "(optional)",
  placeholders: {
    name: "Your full name",
    email: "you@email.com",
    programme: "Pick a programme",
    mode: "Pick a mode",
    query: "What would you like to ask?",
  },
  submit: "Request a Call Back",
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
