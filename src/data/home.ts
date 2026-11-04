/** Version 2 homepage copy. Links go to pages on the main site; "#" marks a page that doesn't exist yet. */

export const hero = {
  /** The badge above the heading: a filled tag, then the text beside it. */
  badge: { tag: "50+ years", text: "Since 1976" },
  heading: "Best IAS Coaching",
  highlight: "in Delhi, India",
  intro:
    "For five decades, aspirants have trusted us to take them from their first class to the interview with experienced faculty, a structured method and honest guidance.",
  primary: { label: "Find your course", href: "https://vajiramandravi.com/all-courses/" },
  secondary: {
    label: "Talk to a counsellor",
    href: "https://vajiramandravi.com/online-counselling-for-admissions-at-vajiram-and-ravi/",
  },
};

export type Topper = {
  /** All India Rank. */
  rank: number;
  name: string;
  /** The exam and year, e.g. "CSE 2025". */
  exam: string;
  photo?: string;
};

export const toppers = {
  eyebrow: "Toppers",
  heading: "Toppers who prepared with Vajiram & Ravi",
  /** The toppers, from the design's toppers panel (2835:42510); the reel fills up to `cards` with empty placeholders if there are fewer. */
  list: [
    { rank: 1, name: "Anuj Agnihotri", exam: "CSE 2025", photo: "/images/toppers/anuj-agnihotri.png" },
    { rank: 2, name: "Rajeshwari Suve M", exam: "CSE 2025", photo: "/images/toppers/rajeshwari-suve-m.png" },
    { rank: 3, name: "Akansh Dhull", exam: "CSE 2025", photo: "/images/toppers/akansh-dhull.png" },
    { rank: 4, name: "Raghav Jhunjhunwala", exam: "CSE 2025", photo: "/images/toppers/raghav-jhunjhunwala.png" },
    { rank: 5, name: "Ishan Bhatnagar", exam: "CSE 2025", photo: "/images/toppers/ishan-bhatnagar.png" },
    { rank: 6, name: "Zinnia Aurora", exam: "CSE 2025", photo: "/images/toppers/zinnia-aurora.png" },
    { rank: 7, name: "A R Rajah Mohaideen", exam: "CSE 2025", photo: "/images/toppers/a-r-rajah-mohaideen.png" },
    { rank: 8, name: "Pakshal Secretry", exam: "CSE 2025", photo: "/images/toppers/pakshal-secretry.png" },
    { rank: 9, name: "Astha Jain", exam: "CSE 2025", photo: "/images/toppers/astha-jain.png" },
    { rank: 10, name: "Ujjwal Priyank", exam: "CSE 2025", photo: "/images/toppers/ujjwal-priyank.png" },
  ] as Topper[],
  cards: 10,
};

/** The stats strip under the hero (design 3541:496). Each stat's motif is in /images/stats. */
export const stats = [
  { value: "10/10", unit: "top rankers", text: "from V&R courses.", motif: "pointed-quatrefoil" },
  { value: "59", unit: "questions", text: "reflected in Prelims.", motif: "ogee-quatrefoil" },
  { value: "36/50", unit: "rankers", text: "in CSE 2025 from V&R.", motif: "eight-petal-flower" },
];

/** "Why choose Vajiram & Ravi", after the toppers (design 3575:1701). */
export const whyChoose = {
  eyebrow: "Why choose Vajiram & Ravi",
  heading: "Your UPSC CSE success story",
  /** The heading's last words, set in grey and followed by an amber full stop. */
  ending: "starts here",
  intro:
    "From expert-led classes to personalised mentorship, get the guidance, resources, and structured preparation you need to move closer to your dream of becoming a civil servant.",
  recap: ["Expert faculty. Complete study material.", "Personal guidance. Classroom or online."],
  video: { label: "Click to watch the video", href: "#" },
};

/** "Our flagship programme", after "Why choose" (design 3575:2050). Links go to the main site; "#" has no page yet. */
export const gsProgramme = {
  eyebrow: "Our flagship programme",
  /** The heading's lines; the last is set in amber. */
  heading: ["General Studies", "decides most of", "your UPSC score."],
  intro:
    "Our GS Prelims & Mains Programme covers the full syllabus with daily classes, printed study material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online.",
  primary: { label: "Enrol in the GS programme", href: "https://vajiramandravi.com/all-courses/" },
  marks: { prelims: "200/200", mains: "1,000/1,750", caption: "Marks that come from General Studies" },
};

/**
 * "Featured UPSC CSE programmes" (design 3591:2114). Each card's `colour` picks its colourway (see
 * ProgrammeCard). `image` is its illustration: none draws the foundation course's built-in artwork, and
 * `masked: false` shows the picture zoomed in without the stepped top. The cards' "#" links have no page yet.
 */
export type ProgrammeColour = "brown" | "jade" | "blue" | "pink" | "orange" | "purple" | "red" | "sand";

export type Programme = {
  name: string;
  /** How many courses the programme has. */
  courses: number;
  text: string;
  colour: ProgrammeColour;
  image: string | null;
  masked?: boolean;
  href: string;
};

export const programmes = {
  heading: "Featured UPSC CSE programmes",
  intro: "From your first GS class to the interview — pick the stage you’re at, then the programme.",
  viewAll: { label: "View all", href: "https://vajiramandravi.com/all-courses/" },
  list: [
    {
      name: "UPSC GS Foundation Course - PCM",
      courses: 4,
      text: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
      colour: "brown",
      image: null,
      href: "#",
    },
    {
      name: "Optional Subject Programme",
      courses: 26,
      text: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
      colour: "jade",
      image: "/images/programmes/optional.png",
      masked: false,
      href: "#",
    },
    {
      name: "CSAT Course",
      courses: 2,
      text: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
      colour: "blue",
      image: "/images/programmes/csat.jpg",
      href: "#",
    },
    {
      name: "Interview Guidance Programme",
      courses: 2,
      text: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
      colour: "pink",
      image: "/images/programmes/interview.jpg",
      href: "#",
    },
    {
      name: "Mentorship Programme",
      courses: 6,
      text: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
      colour: "orange",
      image: "/images/programmes/mentorship.jpg",
      href: "#",
    },
    {
      name: "Mains Test Series",
      courses: 11,
      text: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
      colour: "purple",
      image: "/images/programmes/mains-tests.jpg",
      href: "#",
    },
    {
      name: "Prelims Test Series",
      courses: 7,
      text: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
      colour: "red",
      image: "/images/programmes/prelims-tests.jpg",
      href: "#",
    },
    {
      name: "Optional Test Series",
      courses: 16,
      text: "Year-long and Mains test series to practise answer writing in your optional subject.",
      colour: "sand",
      image: "/images/programmes/optional-tests.jpg",
      href: "#",
    },
  ] as Programme[],
};

/**
 * "Hear it from our students" (design 3614:4886). The names, quotes and ranks are the design's placeholder
 * copy: replace them with real students' words, with their consent, before going live.
 * `colour` picks the card's stamp, edge line and pattern fade (see StoryCard).
 */
export type StoryColour = "orange" | "green" | "yellow" | "peach";

export const stories = {
  eyebrow: "Success stories",
  heading: "Hear it from our students",
  intro: "Honest words from students who prepared with us, in the classroom and LIVE-Online.",
  list: [
    {
      name: "Rohit Verma",
      meta: "AIR 89 · CSE 2024 · PowerUp Prelims Test Series",
      quote: "After two failed attempts, the test series finally showed me where my marks were going.",
      photo: "/images/stories/rohit-verma.jpg",
      colour: "peach",
    },
    {
      name: "Sneha Iyer",
      meta: "AIR 52 · CSE 2024 · LIVE-Online GS Programme",
      quote: "I worked full time and studied at night. LIVE-Online meant I never had to choose between the two.",
      photo: "/images/stories/sneha-iyer.jpg",
      colour: "yellow",
    },
    {
      name: "Karan Mehta",
      meta: "AIR 37 · CSE 2025 · Interview Guidance Programme",
      quote: "The mock interviews were tougher than the real board. That is exactly why I walked in calm.",
      photo: "/images/stories/karan-mehta.jpg",
      colour: "green",
    },
    {
      name: "Aditi Rao",
      meta: "AIR 14 · CSE 2025 · GS Foundation, Classroom",
      quote: "Daily answer writing felt like a chore in the first month. By month six, it was the habit that got me through Mains.",
      photo: "/images/stories/aditi-rao.jpg",
      colour: "orange",
    },
  ] as { name: string; meta: string; quote: string; photo: string; colour: StoryColour }[],
};

/** The free answer-writing banner (design 3722:42634). The link is a placeholder until the practice page's URL is known. */
export const practice = {
  heading: "Practise Mains answers, free, every day.",
  text: "Daily answer writing and an MCQ quiz, in English and Hindi.",
  cta: { label: "Start practising", href: "#" },
};
