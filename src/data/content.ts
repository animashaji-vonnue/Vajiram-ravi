/**
 * The homepage's content, in the order of the information architecture: 1 outcome-led hero, 2 the UPSC preparation
 * journey and the institute's support, 3 about the institute, 4 programmes, 5 batches and admissions, 6 counselling,
 * 7 educators, 8 student stories, 9 free resources, 10 FAQs, 11 a final invitation, 12 the footer.
 *
 * Where the earlier content brief gave exact copy, it is used as written. Copy written since for the new sections is
 * kept to plain facts about the examination and the institute's offer; anything not yet verified (batch dates,
 * programme durations, faculty credentials, milestones, student stories, some answers, addresses) is a placeholder,
 * marked `placeholder: true` or written in [square brackets], to be replaced before publishing.
 */

export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  email: "admissions@vajiramandravi.com",
  hours: "Mon – Sat, 9 AM – 7 PM",
};

export const nav = [
  { label: "Results", href: "#results" },
  { label: "Programmes", href: "#programmes" },
  { label: "Batches", href: "#batches" },
  { label: "Educators", href: "#educators" },
  { label: "Resources", href: "#resources" },
  { label: "About", href: "#about" },
];

/** The centre, for the about section, the FAQs and the footer. */
export const location = {
  area: "Old Rajinder Nagar, New Delhi",
  address: "[Full address to be verified]",
  others: "[Other centres to be verified]",
  directions: "#",
};

/* ------------------------------------------------------------------ 01 · Hero */

export type Achiever = { rank: number; name: string; year: number; photo: string; programme: string };

export const hero = {
  eyebrow: "UPSC Civil Services Examination results",
  headline: { lead: "Their dream became a reality.", accent: "Yours can too." },
  description:
    "For decades, we've helped UPSC aspirants turn their ambitions into achievements. Your journey could be the next success story.",
  statement: "Results that speak. Guidance that leads.",
  primary: { label: "Find courses", href: "#programmes" },
  secondary: { label: "Talk to a counsellor", href: "#counselling" },
  /**
   * The institution's achievements, under the buttons. "50+ years" and the CSE 2025 figures are to be verified
   * against the institute's records before publishing.
   */
  achievements: [
    { value: "50+", label: "Years of legacy", text: "Established in 1976" },
    { value: "10 of 10", label: "Top ten ranks", text: "CSE 2025" },
    { value: "36", label: "Of the top 50", text: "Ranks in CSE 2025" },
  ],
  /**
   * The achievers, by examination year. Only CSE 2025 is filled in so far; the selector shows a year once it has
   * achievers here.
   */
  years: {
    2025: [
      { rank: 1, name: "Anuj Agnihotri", photo: "/images/toppers/anuj-agnihotri.png" },
      { rank: 2, name: "Rajeshwari Suve M", photo: "/images/toppers/rajeshwari-suve-m.png" },
      { rank: 3, name: "Akansh Dhull", photo: "/images/toppers/akansh-dhull.png" },
      { rank: 4, name: "Raghav Jhunjhunwala", photo: "/images/toppers/raghav-jhunjhunwala.png" },
      { rank: 5, name: "Ishan Bhatnagar", photo: "/images/toppers/ishan-bhatnagar.png" },
      { rank: 6, name: "Zinnia Aurora", photo: "/images/toppers/zinnia-aurora.png" },
      { rank: 7, name: "A R Rajah Mohaideen", photo: "/images/toppers/a-r-rajah-mohaideen.png" },
      { rank: 8, name: "Pakshal Secretry", photo: "/images/toppers/pakshal-secretry.png" },
      { rank: 9, name: "Astha Jain", photo: "/images/toppers/astha-jain.png" },
      { rank: 10, name: "Ujjwal Priyank", photo: "/images/toppers/ujjwal-priyank.png" },
      // Each achiever's programme with the institute is to be verified; it shows as a placeholder until then.
    ].map((a) => ({ ...a, year: 2025, programme: "[Programme to be verified]" })) as Achiever[],
  } as Record<number, Achiever[]>,
  /**
   * The hero's slides: the top three of CSE 2025 in their portraits. Their quotes are to come from the toppers
   * themselves, with their approval; until then each is a marked placeholder of about a quote's length, since words
   * are never written for real people.
   */
  slides: [
    { rank: 1, name: "Anuj Agnihotri", photo: "/images/hero/topper-anuj-agnihotri.jpg", accent: "#f26419" },
    { rank: 2, name: "Rajeshwari Suve M", photo: "/images/hero/topper-rajeshwari-suve-m.jpg", accent: "#ffd3a1" },
    { rank: 3, name: "Akansh Dhull", photo: "/images/hero/topper-akansh-dhull.jpg", accent: "#fa712a" },
  ].map((t) => ({
    ...t,
    year: 2025,
    quote: `[${t.name}'s own words on how Vajiram & Ravi shaped their preparation, to be added with their approval.]`,
  })),
};

/* ------------------------------------------------------------------ 02 · The preparation journey */

export type SupportKind = "Programme" | "Assessment" | "Resource";

export const journey = {
  eyebrow: "The UPSC preparation journey",
  headline: "Every big achievement begins with the right preparation.",
  description:
    "UPSC is a demanding journey. We bring together experienced guidance, structured learning and regular assessment to help you prepare with confidence.",
  statement: "A system that guides you at every step.",
  /**
   * The examination's three stages: what each requires (the examination's published pattern), and how the institute
   * supports aspirants through it. "Mock interview practice" is to be confirmed against the interview programme.
   */
  stages: [
    {
      name: "Prelims",
      full: "Preliminary examination",
      requires:
        "Two objective papers. General Studies Paper I decides who qualifies; CSAT, Paper II, is qualifying, at 33%. Prelims screens candidates for the Mains, and its marks don't count towards the final rank.",
      support: [
        { label: "General Studies Prelims & Mains Programme", kind: "Programme" },
        { label: "CSAT", kind: "Programme" },
        { label: "Prelims test series", kind: "Assessment" },
        { label: "Current affairs and The Recitals", kind: "Resource" },
      ],
      photo: "/images/programmes/prelims-tests.jpg",
    },
    {
      name: "Mains",
      full: "Main examination",
      requires:
        "Nine descriptive papers. The Essay, four General Studies papers and two optional subject papers, 1,750 marks in all, count towards the rank; two language papers are qualifying.",
      support: [
        { label: "General Studies Prelims & Mains Programme", kind: "Programme" },
        { label: "Optional subject programmes", kind: "Programme" },
        { label: "Mains test series with evaluation", kind: "Assessment" },
        { label: "Model answers and previous year papers", kind: "Resource" },
      ],
      photo: "/images/programmes/mains-tests.jpg",
    },
    {
      name: "Personality Test",
      full: "The interview",
      requires:
        "An interview with a UPSC board that assesses a candidate's suitability for a career in public service. Its 275 marks are added to the Mains total for the final rank.",
      support: [
        { label: "Interview guidance", kind: "Programme" },
        { label: "Mock interview practice", kind: "Assessment" },
        { label: "Current affairs and The Recitals", kind: "Resource" },
      ],
      photo: "/images/programmes/interview.jpg",
    },
  ] as {
    name: string;
    full: string;
    requires: string;
    support: { label: string; kind: SupportKind }[];
    photo: string;
  }[],
};

/* ------------------------------------------------------------------ 04 · Programmes */

export const programmes = {
  eyebrow: "Explore UPSC programmes",
  headline: "One goal. Different paths to get there.",
  description:
    "Whether you're building your foundation, strengthening your preparation or getting ready for the next stage, find a programme that fits your needs.",
  /**
   * The featured programme. Its benefits describe what the programme covers and are to be confirmed by the academic
   * team; the duration is a placeholder.
   */
  featured: {
    tag: "Featured programme",
    name: "General Studies Prelims & Mains Programme",
    line: "Prepare for the core subjects of the examination.",
    benefits: [
      "The General Studies syllabus for both Prelims and Mains, in one programme",
      "Classes with experienced faculty, in the classroom or LIVE-Online",
      "Study material and current affairs to learn and revise from",
      "Regular tests and answer writing, with feedback",
    ],
    for: "Aspirants preparing General Studies for Prelims and Mains",
    mode: "Classroom, Delhi · LIVE-Online",
    duration: "[Duration to be confirmed]",
    cta: "Explore the programme",
    href: "#",
    photos: [
      "/images/gs-programme/classroom.jpg",
      "/images/gs-programme/library.webp",
      "/images/gs-programme/mentoring.webp",
    ],
  },
  /**
   * Every programme group, for the record-shelf wall (the v4 design, after Figma 3860:405): its name, how many
   * courses it holds, a line and a cover colour. Counts and lines are from the design and to be confirmed; the next
   * batch dates are to be filled in by admissions. `courses` are only the courses each line names (one page each in
   * the open book); the rest are reached through "View all", and each course's details are to be added.
   */
  wall: {
    title: "More UPSC programmes",
    intro: "Every programme we run, on one wall. Pick a course to take a closer look.",
    backdrop: "/images/courses/nalanda.webp",
    list: [
      {
        name: "UPSC GS Foundation Course - PCM",
        count: 4,
        courses: ["1-year GS Foundation Course", "2-year GS Foundation Course"],
        line: "1-year and 2-year General Studies programmes that take you from the basics to Prelims and Mains.",
        colour: "#805c4e",
      },
      {
        name: "Optional Subject Programme",
        count: 26,
        courses: ["Anthropology", "Sociology"],
        line: "Coaching in 13 optional subjects, from Anthropology to Sociology, in Classroom and LIVE-Online.",
        colour: "#09735c",
      },
      {
        name: "CSAT Course",
        count: 2,
        courses: ["CSAT Course"],
        line: "Prepare for Prelims Paper II and clear the 33% qualifying mark with confidence.",
        colour: "#274fa6",
      },
      {
        name: "Interview Guidance Programme",
        count: 2,
        courses: ["UPSC CSE Interview Guidance", "IFoS Interview Guidance"],
        line: "Guidance for the UPSC CSE and IFoS interviews once you have cleared Mains.",
        colour: "#b83a68",
      },
      {
        name: "Mentorship Programme",
        count: 6,
        courses: ["StepUp Mentorship"],
        line: "StepUp mentorship pairs regular tests with a personal mentor, from Prelims to Mains.",
        colour: "#d1570e",
      },
      {
        name: "Mains Test Series",
        count: 11,
        courses: ["Sure Shot Test Series", "Mains CAMP", "Essay Tests"],
        line: "Sure Shot test series, Mains CAMP and Essay tests to sharpen your answer writing.",
        colour: "#5b2a86",
      },
      {
        name: "Prelims Test Series",
        count: 7,
        courses: ["PowerUp Test Series", "Prelims CAMP", "Current Affairs Tests"],
        line: "PowerUp test series, Prelims CAMP and current affairs tests to get Prelims-ready.",
        colour: "#a32a2a",
      },
      {
        name: "Optional Test Series",
        count: 16,
        courses: ["Year-long Optional Test Series", "Optional Mains Test Series"],
        line: "Year-long and Mains test series to practise answer writing in your optional subject.",
        colour: "#2b2322",
      },
    ].map((course) => ({ ...course, nextBatch: "[Date to be confirmed]", href: "#" })),
  },
};

/* ------------------------------------------------------------------ 05 · Batches */

export type Batch = {
  day: string;
  month: string;
  title: string;
  target: string;
  mode?: string;
  /** The colour of the ticket's head, and whether its text is light (on a dark head) or dark. */
  head: string;
  tone: "light" | "dark";
  limited?: boolean;
  /** The lotus mark drawn into the head of the first ticket. */
  mark?: boolean;
  href: string;
};

export const batches = {
  eyebrow: "Admissions",
  headline: "Next batches starting soon.",
  description: `Register online, or call ${contact.phone} for registration or seat allotment.`,
  /**
   * The batches as given in the design file (Figma 2257:9039). Dates, targets and "limited seats" are to be
   * confirmed by the admissions team before publishing.
   */
  list: [
    {
      day: "27",
      month: "Nov",
      title: "General Studies Prelims cum Mains Programme 2027",
      target: "UPSC CSE 2027",
      mode: "Classroom & LIVE-Online",
      head: "#ec5800",
      tone: "light",
      mark: true,
    },
    {
      day: "3",
      month: "Jan",
      title: "Prelims CAMP Batch 3",
      target: "UPSC CSE 2027",
      mode: "Classroom & LIVE-Online",
      head: "#ff9f02",
      tone: "dark",
      limited: true,
    },
    {
      day: "17",
      month: "Jan",
      title: "SMART Current Affairs Program 2026",
      target: "UPSC CSE 2026",
      head: "#e2725b",
      tone: "dark",
      limited: true,
    },
    {
      day: "29",
      month: "Jan",
      title: "11 Months Prelims cum Mains General Studies Comprehensive Programme",
      target: "UPSC CSE 2027",
      mode: "Classroom & LIVE-Online",
      head: "#2b1206",
      tone: "light",
    },
  ].map((b) => ({ ...b, href: "#" })) as Batch[],
  all: { label: "View all batches", href: "#" },
};

/* ------------------------------------------------------------------ 06 · Counselling */

export const counselling = {
  eyebrow: "Talk to us",
  headline: "Need assistance? Talk to our expert counsellor.",
  description:
    "Schedule a free call with a Vajiram & Ravi counsellor to answer your questions, with no pressure to enrol.",
  card: { tag: "Post card", title: "Book your free session today!", cta: "Book my free call" },
  /** The programmes a visitor can ask about: the featured programme, then the others. */
  programmes: [programmes.featured.name, ...programmes.wall.list.map((c) => c.name), "Not sure yet"],
  times: ["Morning, 9 AM – 12 PM", "Afternoon, 12 – 4 PM", "Evening, 4 – 7 PM"],
};

/* ------------------------------------------------------------------ 07 · Mentors */

export const mentors = {
  eyebrow: "Meet our educators",
  headline: "Good teachers don't just teach. They show you the way.",
  description: "Meet the educators who bring knowledge, experience and direction to your UPSC preparation.",
  statement: "Learn from experience. Prepare with confidence.",
  /**
   * The portraits and names are the design file's placeholders; qualifications, experience and introductions are to
   * be added from verified faculty information.
   */
  list: [
    { name: "SK Manocha", subject: "General Studies · Polity & Governance", photo: "/images/faculty/sk-manocha.jpg" },
    { name: "Brijender Singh", subject: "Essay", photo: "/images/faculty/brijender-singh.jpg" },
    { name: "Md. Rizwan", subject: "Geography optional", photo: "/images/faculty/md-rizwan.jpg" },
    { name: "Md. Tarique", subject: "History optional", photo: "/images/faculty/md-tarique.jpg" },
    { name: "Mukul Pathak", subject: "Psychology optional", photo: "/images/faculty/mukul-pathak.jpg" },
    { name: "Shyam Sundar", subject: "Economics optional", photo: "/images/faculty/shyam-sundar.jpg" },
  ].map((m) => ({
    ...m,
    credentials: "[Qualifications to be added]",
    experience: "[Teaching experience to be added]",
    intro: "[A short introduction, from verified faculty information.]",
    href: "#",
  })),
};

/* ------------------------------------------------------------------ 08 · Stories */

export const stories = {
  eyebrow: "Student stories",
  headline: "Behind every achievement is a story worth hearing.",
  description:
    "Every aspirant faces challenges, learns new things and grows through the journey. Hear directly from students who have been through it.",
  statement: "Their experiences. Their words. Their journeys.",
  /** Two films of students, played one after the other behind the stories. */
  films: ["/videos/testimonials-1.mp4", "/videos/testimonials-2.mp4"],
  /**
   * The stories: the CSE 2025 toppers, their names, ranks and photos from our records. No words are written for
   * them (the brief rules out fabricated testimonials): each quote is a marked placeholder until the student's own,
   * approved words are in, and their programme is to be verified.
   */
  list: hero.years[2025].slice(0, 6).map((a) => ({
    name: a.name,
    meta: `AIR ${a.rank} · CSE ${a.year} · ${a.programme}`,
    quote: `[${a.name}'s own words on preparing with Vajiram & Ravi, to be added with their approval.]`,
    photo: a.photo,
  })) as { name: string; meta: string; quote: string; photo?: string }[],
};

/* ------------------------------------------------------------------ 09 · Life */

export const life = {
  eyebrow: "Life at Vajiram & Ravi",
  headline: "More than a classroom. A place where ambitions take shape.",
  description:
    "From learning together to preparing for your biggest milestones, discover the experiences that make life at Vajiram & Ravi special.",
  statement: "Step inside. See the journey.",
  words: ["Learn", "Discuss", "Prepare", "Grow"],
  /** A stand-in film of student life until the institute's own footage is available. */
  film: "/videos/hero-3.mp4",
  poster: "/images/gs/classroom-wide.webp",
};

/* ------------------------------------------------------------------ 03 · About Vajiram & Ravi */

export const about = {
  eyebrow: "About Vajiram & Ravi",
  headline: "Built on experience. Driven by every new generation of aspirants.",
  /** Who the institute is: the brief's copy. */
  intro:
    "Since 1976, Vajiram & Ravi has been part of the civil services preparation journey of generations of students. Our legacy is built on academic experience, dedicated educators and a continued commitment to helping aspirants move forward.",
  record: {
    title: "A proven track record",
    text: "Five decades of preparing aspirants for the civil services, and results that speak.",
    /** "50+ years" and the CSE 2025 figures are to be verified against the institute's records. */
    stats: [
      { value: "1976", label: "Established", text: "The year we began" },
      { value: "50+", label: "Years of legacy", text: "Generations of aspirants" },
      { value: "10 of 10", label: "Top ten ranks", text: "CSE 2025" },
      { value: "36", label: "Of the top 50", text: "Ranks in CSE 2025" },
    ],
  },
  classes: {
    title: "Learn online or offline",
    text: "Most programmes run both in the classroom and LIVE-Online, so you can choose the way of learning that suits you.",
    modes: [
      {
        tag: "Offline",
        name: "Classroom",
        text: `Learn in person at our centre in ${location.area}, alongside other aspirants and close to your teachers.`,
        photo: "/images/gs-programme/classroom.jpg",
      },
      {
        tag: "Online",
        name: "LIVE-Online",
        text: "Join live classes from home, wherever you are preparing. [Recordings and online support to be confirmed.]",
        photo: "/images/why/why-classroom-or-online.png",
      },
    ],
  },
  location: { title: "Visit our centre" },
};

/* ------------------------------------------------------------------ 09 · Free resources */

export const resources = {
  eyebrow: "Free study materials",
  headline: "Prepare with the right material, free of cost.",
  description:
    "Current affairs, The Recitals, previous year papers and more: free resources to support your preparation, whichever programme you choose.",
  /** The Recitals: the description is to be confirmed with the publications team; the covers are recent issues. */
  recitals: {
    tag: "Monthly current affairs magazine",
    name: "The Recitals",
    text: "Vajiram & Ravi's monthly magazine of current affairs for the Civil Services Examination. [Description to be confirmed.]",
    cta: "Read the latest issue",
    href: "#",
    covers: [
      "/images/gs/recitals-july.jpg",
      "/images/gs/recitals-june.jpg",
      "/images/gs/recitals-may.jpg",
      "/images/gs/recitals-april.jpg",
    ],
  },
  list: [
    { name: "UPSC current affairs", text: "The news that matters for Prelims and Mains, explained.", icon: "Journal" },
    { name: "Previous year papers", text: "Past Prelims and Mains question papers to practise with.", icon: "Archive" },
    { name: "UPSC syllabus", text: "The syllabus for every stage and paper of the examination.", icon: "List" },
    { name: "Model answers", text: "Answers to Mains questions, to compare with your own.", icon: "PageEdit" },
  ].map((r) => ({ ...r, href: "#" })) as {
    name: string;
    text: string;
    icon: "Journal" | "Archive" | "List" | "PageEdit";
    href: string;
  }[],
};

/* ------------------------------------------------------------------ 10 · FAQ */

export const faq = {
  eyebrow: "FAQ",
  headline: "A few questions before you begin?",
  description: "We've answered some of the most common questions to help you make an informed decision.",
  /** By topic. Questions and answers written since the brief, and the ones still in [brackets], need confirming. */
  tabs: [
    {
      name: "The institute",
      list: [
        { q: "Why should I choose Vajiram & Ravi?", a: "[Answer to be added.]" },
        { q: "How experienced are the faculty members?", a: "[Answer to be added from verified faculty information.]" },
        {
          q: "Where is Vajiram & Ravi located?",
          a: `Our centre is in ${location.area}. ${location.address} ${location.others}`,
        },
      ],
    },
    {
      name: "Programmes",
      list: [
        {
          q: "Which course should I choose?",
          a: "It depends on where you are: a foundation programme if you're starting out, General Studies or an optional if you're already preparing, and a test series or interview guidance for the later stages. A counsellor can help you decide.",
        },
        {
          q: "Are classroom and online programmes available?",
          a: "Yes. Programmes run in the classroom in Delhi and LIVE-Online. [Confirm per programme.]",
        },
        { q: "How can I evaluate my preparation?", a: "[Answer to be added: tests, answer evaluation and feedback.]" },
      ],
    },
    {
      name: "Preparation",
      list: [
        {
          q: "How do I start preparing for UPSC?",
          a: "Start by reading the examination notification and the syllabus for Prelims and Mains, then build your basics subject by subject before moving on to practice and tests. If you're unsure where to begin, an academic counsellor can help you plan your first months.",
        },
        { q: "Can I join if I have already started preparing?", a: "[Answer to be added.]" },
        { q: "How will I know about my child's progress?", a: "[Answer to be added.]" },
      ],
    },
    {
      name: "Batches & admissions",
      list: [
        {
          q: "When do new batches start?",
          a: "Batches start through the year. See the upcoming batches above, or ask a counsellor for the latest schedule.",
        },
        { q: "How do I enrol?", a: "[Enrolment steps to be added.]" },
        {
          q: "How can I speak to someone before enrolling?",
          a: `Call our counsellors on ${contact.phone} (${contact.hours}), write to ${contact.email}, or leave your details in the enquiry above and we'll get in touch.`,
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ 11 · Final invitation */

export const closing = {
  headline: "Every journey begins with a first step. Make yours count.",
  description:
    "Whether you're a student ready to begin or a parent looking for the right guidance, we're here to help.",
  primary: { label: "Explore programmes", href: "#programmes" },
  secondary: { label: "Speak to our counsellors", href: "#counselling" },
};

/* ------------------------------------------------------------------ 12 · Footer */

export const footer = {
  columns: [
    { title: "Explore", links: nav.map((item) => ({ label: item.label, href: item.href })) },
    {
      title: "Programmes",
      links: [
        "GS Prelims & Mains",
        "Foundation programmes",
        "Optional subjects",
        "CSAT",
        "Test series",
        "Interview guidance",
      ].map((label) => ({ label, href: "#programmes" })),
    },
    {
      title: "Resources",
      links: ["UPSC Current Affairs", "The Recitals", "Previous year papers", "UPSC syllabus", "Model answers"].map(
        (label) => ({ label, href: "#resources" }),
      ),
    },
    {
      title: "Institute",
      links: [
        { label: "Our history", href: "#about" },
        { label: "Life at Vajiram & Ravi", href: "#life" },
        { label: "Locations", href: "#location" },
        { label: "Careers", href: "#" },
        { label: "Contact us", href: "#counselling" },
      ],
    },
  ],
  policies: ["Terms and conditions", "Privacy policy", "Grievance redressal"].map((label) => ({ label, href: "#" })),
  social: ["YouTube", "Instagram", "Facebook", "Telegram", "WhatsApp"].map((name) => ({ name, href: "#" })),
};
