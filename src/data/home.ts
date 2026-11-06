/** Version 4 homepage copy. Links go to pages on the main site; "#" marks a page that doesn't exist yet. */

export const hero = {
  heading: "Best IAS Coaching",
  highlight: "in Delhi, India",
  intro:
    "For five decades, aspirants have trusted us to take them from their first class to the interview with experienced faculty, a structured method and honest guidance.",
  primary: { label: "Find your course", href: "https://vajiramandravi.com/all-courses/" },
  secondary: {
    label: "Talk to a counsellor",
    href: "https://vajiramandravi.com/online-counselling-for-admissions-at-vajiram-and-ravi/",
  },
  /** The Red Fort, in sepia line art on a clear background, behind the video. */
  backdrop: "/images/hero/red-fort.webp",
  /** The clips in the video card, played one after another in a loop, muted. */
  video: {
    clips: ["/videos/hero-3.mp4"],
    label: "A short film of life at Vajiram & Ravi",
  },
};

/** The stats band under the hero: each stat a figure, a label under it and a line of context. */
export const stats = {
  heading: "Vajiram & Ravi in numbers",
  list: [
    { value: "50+", label: "Years", text: "of experience, since 1976" },
    { value: "10/10", label: "Top rankers", text: "from V&R courses" },
    { value: "59", label: "Questions", text: "reflected in Prelims" },
    { value: "36/50", label: "Rankers", text: "in CSE 2025 from V&R" },
  ],
};

/** "Why choose Vajiram & Ravi": a title block and six reasons, each a framed photo beside a short story. */
export const whyChoose = {
  title: "Why Vajiram & Ravi",
  /** The name in Devanagari, under the title. */
  titleHindi: "वाजीराम एंड रवि",
  caption: "Since 1976",
  /** The six reasons, from the design (3840:42643): a heading, a line about the photo, and the photo. */
  /** The six reasons, from the design (3840:42643): a heading, a short paragraph, and the photo with its description. */
  rows: [
    {
      heading: "Expert faculty",
      body: "Our classes are led by experienced teachers who have guided aspirants for years. They teach the whole syllabus the way the exam asks for it, explain the why behind every topic, and keep their lessons in step with how the UPSC paper changes.",
      photo: "/images/why/why-expert-faculty.png",
      alt: "Senior professor teaching at a blackboard map of India.",
    },
    {
      heading: "Personal guidance",
      body: "Every aspirant prepares differently. Mentors sit with you over your answers, show you where marks slip away, and help you plan what to study next, so your preparation stays on course from the first class to the interview.",
      photo: "/images/why/why-personal-guidance.png",
      alt: "Mentor going through an answer sheet with an aspirant.",
    },
    {
      heading: "Complete study material",
      body: "Printed notes, subject booklets and current affairs compilations cover the syllabus end to end. Written and updated by our faculty, they mean you spend your time revising, not hunting for what to read.",
      photo: "/images/why/why-complete-study-material.png",
      alt: "Bound notes and booklets on archive shelves.",
    },
    {
      heading: "Proven track record",
      body: "Year after year, the results list is full of names from our classrooms. In CSE 2025, all ten of the top ten rankers and 36 of the top 50 had prepared with Vajiram & Ravi courses.",
      photo: "/images/why/why-proven-track-record.png",
      alt: "Students reading the results board.",
    },
    {
      heading: "Prime location",
      body: "Our Delhi centre sits in Old Rajinder Nagar, the heart of UPSC preparation, among libraries, bookshops and reading rooms, with thousands of fellow aspirants a short walk away.",
      photo: "/images/why/why-prime-location.png",
      alt: "Old Rajinder Nagar lane with bookshops.",
    },
    {
      heading: "Classroom or online",
      body: "Study in our classrooms or join the same classes LIVE-Online from wherever you are. You get the same faculty, the same study material and the same mentorship either way.",
      photo: "/images/why/why-classroom-or-online.png",
      alt: "Aspirant on a LIVE-Online class at home.",
    },
  ],
};

export type Topper = {
  /** All India Rank. */
  rank: number;
  name: string;
  /** The exam and year, e.g. "CSE 2025". */
  exam: string;
  /** A cut-out portrait on a transparent background. */
  photo?: string;
};

/** The toppers, in "The Vajiram Toppers", the newspaper after "Why choose". */
export const toppers = {
  eyebrow: "Toppers",
  heading: "Toppers who prepared with Vajiram & Ravi",
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
};

/** The closing call to action, after "Why choose" (design 3831:253). */
export const ctaBanner = {
  eyebrow: "Admissions open",
  heading: "Ready to start your UPSC preparation?",
  intro:
    "Find the programme that fits your stage, or talk to a counsellor who will help you choose. No pressure to enrol.",
  primary: { label: "Find your course", href: "https://vajiramandravi.com/all-courses/" },
  secondary: {
    label: "Talk to a counsellor",
    href: "https://vajiramandravi.com/online-counselling-for-admissions-at-vajiram-and-ravi/",
  },
  phone: { label: "080-6220-6330", href: "tel:+918062206330" },
  hours: "Mon – Sat, 9 AM – 7 PM",
  /** Mughal arches framing a tomb at sunrise. */
  photo: "/images/cta/arches.png",
};

export const gsProgramme = {
  eyebrow: "Our flagship programme",
  heading: "General Studies decides most of your UPSC score",
  lead: "Our GS Prelims & Mains Programme covers the full syllabus with daily classes, printed study material, Prelims and Mains tests and mentoring, in Classroom or LIVE-Online.",
  body: "Graduates take the 1-year programme; college students start with the 2-year Fledgling.",
  marks: {
    list: [
      { value: "200/200", label: "Prelims" },
      { value: "1,000/1,750", label: "Mains" },
    ],
    caption: "Marks that come from General Studies",
  },
  photo: { src: "/images/gs/students.webp", alt: "Two students with their notebooks in a college corridor" },
  /** A full classroom from the back, printed faintly across the section. */
  backdrop: "/images/gs/classroom-wide.webp",
  /** Parliament House in brown line art, under the text. */
  illustration: "/images/gs/parliament.webp",
};

export const faculty = {
  heading: "Learn from top educators",
  intro: "Subject specialists for every GS paper, the essay, the optionals and the interview.",
  /** A Mughal library in brown line art, behind the top of the section. */
  backdrop: "/images/faculty/library.webp",
  list: [
    { name: "SK Manocha", subject: "General Studies · Polity & Governance", photo: "/images/faculty/sk-manocha.jpg" },
    { name: "Brijender Singh", subject: "Essay", photo: "/images/faculty/brijender-singh.jpg" },
    { name: "Md. Rizwan", subject: "Geography optional", photo: "/images/faculty/md-rizwan.jpg" },
    { name: "Md. Tarique", subject: "History optional", photo: "/images/faculty/md-tarique.jpg" },
    { name: "Mukul Pathak", subject: "Psychology optional", photo: "/images/faculty/mukul-pathak.jpg" },
    { name: "Shyam Sundar", subject: "Economics optional", photo: "/images/faculty/shyam-sundar.jpg" },
  ].map((member) => ({ ...member, linkedin: "#" })),
};

/** The papers a topic is set for, each with its colour in the resources table. */
export type Paper = "GS I" | "GS II" | "GS III";

/** Prelims topics from the design. Mains and Quest have no topics in it yet, so they show these until theirs come. */
const prelimsTopics: { topic: string; subject: string; paper: Paper; href: string }[] = [
  {
    topic: "United Kingdom Maritime Trade Operations (UKMTO)",
    subject: "International relations",
    paper: "GS II",
    href: "#",
  },
  { topic: "Mauritius", subject: "Geography", paper: "GS I", href: "#" },
  { topic: "Narwhals", subject: "Environment", paper: "GS III", href: "#" },
  { topic: "Thiksey Monastery", subject: "Art & culture", paper: "GS I", href: "#" },
  { topic: "Long Tailed Marmot", subject: "Environment", paper: "GS III", href: "#" },
  { topic: "Squint Eye", subject: "Science & tech", paper: "GS III", href: "#" },
];

export const resources = {
  eyebrow: "Free resources",
  heading: "Study materials for every stage of UPSC",
  tabs: [
    { label: "Prelims", href: "#", topics: prelimsTopics },
    { label: "Mains", href: "#", topics: prelimsTopics },
    { label: "Quest", href: "#", topics: prelimsTopics },
  ],
  others: {
    label: "Other free resources :",
    links: [
      { label: "Monthly magazine", href: "#" },
      { label: "Yojana & Kurukshetra", href: "#" },
      { label: "Previous year papers", href: "#" },
      { label: "Toppers’ answer sheets", href: "#" },
      { label: "Essay practice", href: "#" },
    ],
  },
  /** A quatrefoil trellis with fleurs-de-lis, faint across the card. */
  motif: "/images/resources/motif.svg",
};

export const faq = {
  heading: "Frequently asked questions",
  /** A study desk by a jaali window, behind the questions. */
  backdrop: "/images/faq/desk.webp",
  list: [
    {
      question: "Which coaching is best for UPSC?",
      answer:
        "Vajiram & Ravi is renowned for its comprehensive and structured approach, making it one of the top choices for UPSC coaching in India.",
    },
    { question: "Which UPSC coaching is best in Delhi?", answer: "Answer to be added." },
    { question: "Which coaching is best for IAS in Delhi?", answer: "Answer to be added." },
    { question: "Which coaching institute has the most UPSC toppers?", answer: "Answer to be added." },
  ],
};

/**
 * "Hear it from our students". Every name, quote and rank here is placeholder copy (the first four are the design's,
 * the last two are made up to fill the carousel): replace them with real students' words, with their consent,
 * before going live. A student without a photo shows their initials on the card.
 */
export const testimonials = {
  heading: "Hear it from our students",
  intro: "Honest words from students who prepared with us, in the classroom and LIVE-Online.",
  list: [
    {
      name: "Karan Mehta",
      meta: "AIR 37 · CSE 2025 · Interview Guidance Programme",
      quote: "The mock interviews were tougher than the real board. That is exactly why I walked in calm.",
      photo: "/images/testimonials/karan-mehta.jpg",
    },
    {
      name: "Aditi Rao",
      meta: "AIR 14 · CSE 2025 · GS Foundation, Classroom",
      quote:
        "Daily answer writing felt like a chore in the first month. By month six, it was the habit that got me through Mains.",
      photo: "/images/testimonials/aditi-rao.jpg",
    },
    {
      name: "Rohit Verma",
      meta: "AIR 89 · CSE 2024 · PowerUp Prelims Test Series",
      quote: "After two failed attempts, the test series finally showed me where my marks were going.",
      photo: "/images/testimonials/rohit-verma.jpg",
    },
    {
      name: "Sneha Iyer",
      meta: "AIR 52 · CSE 2024 · LIVE-Online GS Programme",
      quote: "I worked full time and studied at night. LIVE-Online meant I never had to choose between the two.",
      photo: "/images/testimonials/sneha-iyer.jpg",
    },
    {
      name: "Farhan Qureshi",
      meta: "AIR 61 · CSE 2025 · Mains Test Series",
      quote: "Every copy came back with notes in the margin. I learned more from those red pens than from any book.",
    },
    {
      name: "Meera Pillai",
      meta: "AIR 23 · CSE 2025 · Sociology Optional",
      quote: "I picked an optional I had never studied. The classes made it the paper I was most sure of.",
    },
  ] as { name: string; meta: string; quote: string; photo?: string }[],
  /** Two films played one after the other behind the section. */
  backdrop: ["/videos/testimonials-1.mp4", "/videos/testimonials-2.mp4"],
  /** The card's perforated stamp edge, from the design. */
  stamp: "/images/testimonials/stamp.svg",
};

/**
 * The course wall, with the courses, counts, lines and colours of the design's course cards (3860:405). Each sleeve
 * is still drawn as a plain cover in `colour` with the course's name on it until there is artwork, and the links
 * point nowhere yet.
 */
export const courses = {
  heading: "Our courses",
  intro: "Every programme we run, on one wall. Pick a course to take a closer look.",
  /** The ruins of Nalanda in line art, along the foot of the section. */
  backdrop: "/images/courses/nalanda.webp",
  list: [
    {
      name: "UPSC GS Foundation Course - PCM",
      count: 4,
      line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
      colour: "#805c4e",
    },
    {
      name: "Optional Subject Programme",
      count: 26,
      line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
      colour: "#09735c",
    },
    {
      name: "CSAT Course",
      count: 2,
      line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
      colour: "#274fa6",
    },
    {
      name: "Interview Guidance Programme",
      count: 2,
      line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
      colour: "#b83a68",
    },
    {
      name: "Mentorship Programme",
      count: 6,
      line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
      colour: "#d1570e",
    },
    {
      name: "Mains Test Series",
      count: 11,
      line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
      colour: "#5b2a86",
    },
    {
      name: "Prelims Test Series",
      count: 7,
      line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
      colour: "#a32a2a",
    },
    {
      name: "Optional Test Series",
      count: 16,
      line: "Year-long and Mains test series to practise answer writing in your optional subject.",
      colour: "#2b2322",
    },
  ].map((course) => ({ ...course, nextBatch: "14 Oct 2026", href: "#" })),
};
