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
  /** Only when the batch is actually flagged. */
  seatStatus?: "limited";
  admissionOpen?: boolean;
};

const BOTH: BatchMode[] = ["Classroom", "LIVE-Online"];

/** Every batch in the CMS. The page shows those that have not started yet (see upcomingBatches). */
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

/** Choices for "Select Programmes" in the enquiry form: the batches above, then the main courses. */
export const enquiryProgrammes: string[] = [
  ...batches.map((batch) => batch.programme),
  "UPSC GS Foundation Course - PCM",
  "GS 2-Year Fledgling Programme",
  "Optional Subject Programme",
  "CSAT Course",
  "Interview Guidance Programme",
  "Mentorship Programme",
  "Mains Test Series",
  "Prelims Test Series",
  "Optional Test Series",
];

export const timePreferences = ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 7 PM)"];

/** The batches section (Figma "Batches", 2257:9039). The phone number in the intro comes from data/site. */
export const batchesCopy = {
  eyebrow: "ADMISSIONS",
  heading: "Next batches starting soon.",
  /** The intro, around the phone number: "Register online, or call 080-6220-6330 for registration or seat allotment." */
  introBefore: "Register online, or call",
  introAfter: "for registration or seat allotment.",
  viewAll: "View all batches",
  empty: "No batches for this selection",
  emptyLink: "get notified",
};

/** The "Talk to us" postcard (Figma "08 Talk to us · India Post postcard form", 2258:9692). */
export const talkToUsCopy = {
  eyebrow: "TALK TO US",
  heading: "Need assistance? Talk to our",
  headingEm: "expert counsellor.",
  text: "Schedule a free call with a Vajiram & Ravi counsellor to answer your questions—no pressure to enrol.",
  postcardTitle: "Book your free session today!",
  placeholders: {
    name: "Your full name",
    email: "you@email.com",
    programme: "Pick a programme",
    time: "Preferred time",
  },
  submit: "Submit",
  thanks: "Thank you",
  thanksText: "Your postcard is on its way. A counsellor will call you soon.",
  again: "Book another session",
  /** Shown above Submit when sending fails; one line in the 306px column. */
  failed: "Couldn’t send that. Please try again.",
  errors: {
    name: "Enter your name",
    email: "Enter a valid email",
    phone: "Enter a 10-digit mobile number",
    programme: "Choose a programme",
    time: "Choose a time",
  },
};
