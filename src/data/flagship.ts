/** One exam stage in the flagship band's score boxes: how many of its marks General Studies carries. */
export type ScoreBox = { stage: string; gsMarks: number; totalMarks: number };

/** The flagship GS Prelims & Mains Programme band (final design "08 · Flagship GS · Konark sun wheel", 2257:8985). */
export const flagship = {
  eyebrow: "OUR FLAGSHIP PROGRAMME",
  /** The heading, then its italic emphasis. */
  title: { lead: "General Studies decides", em: "most of your UPSC score" },
  body: "Our GS Prelims & Mains Programme covers the full syllabus with daily classes, printed study material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online. Graduates take the 1-year programme; college students start with the 2-year Fledgling.",
  /** Opens the enquiry form with `enquiry` chosen; it must be one of data/admissions' enquiryProgrammes. */
  cta: { label: "Enrol in the GS programme", enquiry: "UPSC GS Foundation Course - PCM" },
  /** Each box's label reads "<stage> · <scoreCaption>", in caps. */
  scoreCaption: "Marks from GS",
  scores: [
    { stage: "Prelims", gsMarks: 200, totalMarks: 200 },
    { stage: "Mains", gsMarks: 1000, totalMarks: 1750 },
  ] satisfies ScoreBox[],
};
