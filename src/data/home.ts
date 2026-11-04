/** Version 3 homepage copy. Links go to pages on the main site; "#" marks a page that doesn't exist yet. */

export type HeroSlide = {
  /** The service, shown in the corner while its photo is up. */
  service: string;
  short: string;
  photo: string;
  /** Describes the photo for screen readers. */
  alt: string;
  /** The torn paper that sweeps in ahead of the photo: a colour taken from the photo. */
  paper: string;
};

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
  slides: [
    {
      service: "Indian Police Service",
      short: "IPS",
      photo: "/images/hero/services/ips.webp",
      alt: "An IPS officer in uniform, cap under his arm, in a sunlit colonnade.",
      paper: "var(--color-saffron)",
    },
    {
      service: "Indian Administrative Service",
      short: "IAS",
      photo: "/images/hero/services/ias.webp",
      alt: "An IAS officer in a cream and maroon saree, holding a file in her office.",
      paper: "var(--color-red-800)",
    },
    {
      service: "Indian Forest Service",
      short: "IFS",
      photo: "/images/hero/services/ifs.webp",
      alt: "An IFS officer in olive uniform with binoculars, in a forest at sunrise.",
      paper: "var(--color-jade-700)",
    },
  ] as HeroSlide[],
};

/** The stats row under the hero (design 3544:42630). */
export const stats = [
  { value: "50+", unit: "years", text: "of experience, since 1976." },
  { value: "10/10", unit: "top rankers", text: "from V&R courses." },
  { value: "59", unit: "questions", text: "reflected in Prelims." },
  { value: "36/50", unit: "rankers", text: "in CSE 2025 from V&R." },
];

export type Topper = {
  /** All India Rank. */
  rank: number;
  name: string;
  /** The exam and year, e.g. "CSE 2025". */
  exam: string;
  /** A cut-out portrait on a transparent background. */
  photo?: string;
};

/** The toppers, shown on notepad pages under the stats. */
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

/** "Why choose Vajiram & Ravi", on a clipboard after the toppers (design 3774:402). */
export const whyChoose = {
  eyebrow: "Why choose Vajiram & Ravi",
  heading: "Your UPSC CSE success story",
  /** The heading's last words, set in grey and followed by an amber full stop. */
  ending: "starts here",
  intro:
    "From expert-led classes to personalised mentorship, get the guidance, resources, and structured preparation you need to move closer to your dream of becoming a civil servant.",
  recap: ["Expert faculty. Complete study material.", "Personal guidance. Classroom or online."],
  video: { label: "Click to watch the video", href: "#", photo: "/images/why/video-card.jpg" },
};

/** The practice banner, after "Why choose" (design 3722:42634). */
export const practice = {
  heading: "Practise Mains answers, free, every day.",
  intro: "Daily answer writing and an MCQ quiz, in English and Hindi.",
  cta: { label: "Start practising", href: "#" },
};
