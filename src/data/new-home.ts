/**
 * The new homepage (/new-home): every line of copy, in page order.
 * Taken word for word from "Vajiram & Ravi – Homepage Content Copy". Edit copy here, not in the components.
 *
 * Links pointing at "#" lead to pages that do not exist yet; clicking one shows a short toast.
 */

export type Link = { label: string; href: string };

/* ---------- Ticker ---------- */

export type TickerItem = { tag: string; text: string; link?: Link };

export const ticker: TickerItem[] = [
  {
    tag: "UPSC Results",
    text: "36 candidates associated with Vajiram & Ravi programmes featured in the UPSC CSE 2025 Top 50.",
    link: { label: "View the results", href: "#" },
  },
  {
    tag: "Upcoming Programme",
    text: "UPSC GS Programme 2028 – New Classroom and LIVE-Online batches commencing 27 November 2026.",
    link: { label: "See batches", href: "#batches" },
  },
  {
    tag: "Current Affairs",
    text: "Stay updated with the latest UPSC-focused current affairs, daily pointers and editorial analysis.",
    link: { label: "Read now", href: "#resources" },
  },
];

/* ---------- Header ---------- */

export const nav: Link[] = [
  { label: "Programmes", href: "#programmes" },
  { label: "The Exam", href: "#journey" },
  { label: "Batches", href: "#batches" },
  { label: "Educators", href: "#educators" },
  { label: "Study Materials", href: "#resources" },
  { label: "FAQs", href: "#faq" },
];

/* ---------- 01 Hero ---------- */

export const hero = {
  eyebrow: "Preparation with purpose",
  /** The heading, split so the accent phrase can be coloured. */
  heading: ["Your ambition to ", "serve India", " deserves serious preparation."] as const,
  description:
    "Prepare for the Civil Services Examination with structured academic programmes, experienced subject educators and focused guidance across Prelims, Mains and the Personality Test.",
  primary: { label: "Explore Programmes", href: "#programmes" },
  secondary: { label: "Get Expert Guidance", href: "#guidance" },
  link: { label: "View All UPSC Toppers", href: "#" },
  exam: "UPSC CSE 2025",
  achievement: {
    count: 36,
    of: 50,
    text: "Candidates associated with various Vajiram & Ravi programmes featured in the UPSC CSE 2025 Top 50.",
  },
};

export type Ranker = { rank: number; name: string; programme: string; image: string };

export const heroRankers: Ranker[] = [
  { rank: 1, name: "Anuj Agnihotri", programme: "Interview Guidance Programme", image: "/images/toppers/anuj-agnihotri.webp" },
  {
    rank: 2,
    name: "Rajeshwari Suve M",
    programme: "PowerUp Prelims Test Series, Interview Guidance Programme and Mains Test Series",
    image: "/images/toppers/rajeshwari-suve-m.webp",
  },
  {
    rank: 3,
    name: "Akansh Dhull",
    programme: "General Studies Prelims Cum Mains Classroom Programme",
    image: "/images/toppers/akansh-dhull.webp",
  },
];

/* ---------- 02 Preparation journey ---------- */

export const journey = {
  eyebrow: "The preparation journey",
  heading: "One examination. Three stages. A preparation that evolves at every step.",
  description:
    "Clearing the Civil Services Examination requires more than covering the syllabus. Each stage demands a different set of skills, from building strong subject knowledge to developing analytical thinking and expressing your perspectives with clarity. Understand what each stage requires and how Vajiram & Ravi supports your preparation.",
  closing: "Every stage demands something different. Build your preparation around what the examination expects.",
};

export type Stage = {
  number: string;
  name: string;
  heading: string;
  description: string;
  support: string[];
  programmes: string[];
  cta: Link;
};

export const stages: Stage[] = [
  {
    number: "01",
    name: "Preliminary Examination",
    heading: "Build a strong foundation. Prepare with precision.",
    description:
      "Prelims tests your understanding of a wide range of subjects and your ability to apply knowledge accurately. Preparation requires conceptual clarity, familiarity with current affairs, consistent practice and effective time management.",
    support: [
      "Comprehensive General Studies teaching.",
      "Prelims-focused test series.",
      "CSAT preparation.",
      "Current affairs resources.",
      "Regular practice and assessment.",
    ],
    programmes: ["General Studies Programme", "Prelims Test Series", "CSAT Course"],
    cta: { label: "Explore Prelims Preparation", href: "#" },
  },
  {
    number: "02",
    name: "Main Examination",
    heading: "Go beyond knowledge. Develop analytical depth.",
    description:
      "Mains requires you to understand issues in depth, connect different perspectives and communicate your understanding through structured answers. Consistent answer-writing practice and subject knowledge play an important role in this stage.",
    support: [
      "General Studies teaching.",
      "Mains answer-writing practice.",
      "Optional Subject Programmes.",
      "Mains Test Series.",
      "Essay and Ethics preparation.",
      "Evaluation and academic feedback through relevant programmes.",
    ],
    programmes: ["General Studies Programme", "Mains Test Series", "Optional Subject Programmes", "Essay and Ethics Modules"],
    cta: { label: "Explore Mains Preparation", href: "#" },
  },
  {
    number: "03",
    name: "Personality Test",
    heading: "Bring your knowledge, perspective and personality together.",
    description:
      "The Personality Test goes beyond what you know. It assesses your ability to understand issues, express your views, demonstrate balanced judgement and respond with clarity and confidence.",
    support: [
      "Interview Guidance Programme.",
      "Academic guidance for the Personality Test.",
      "Preparation support relevant to the interview stage.",
    ],
    programmes: ["Interview Guidance Programme"],
    cta: { label: "Explore Interview Guidance", href: "#" },
  },
];

/* ---------- 03 About ---------- */

export const about = {
  eyebrow: "Our legacy",
  heading: "Guiding civil services aspirants since 1976.",
  description:
    "Founded in 1976 by Professor P. Velayutham, Vajiram & Ravi has spent nearly five decades guiding aspirants through the demands of the Civil Services Examination. Built on academic experience and subject-focused teaching, the institute continues to support aspirants pursuing a career in public service.",
  founded: "1976",
  founder: "Founded by Professor P. Velayutham",
  points: [
    {
      title: "Nearly Five Decades of Experience",
      text: "Since 1976, Vajiram & Ravi has been associated with Civil Services Examination preparation and the academic development of aspirants.",
    },
    {
      title: "Experienced Subject Educators",
      text: "Learn from subject specialists with academic experience and expertise across different areas of the UPSC syllabus.",
    },
    {
      title: "Learning Your Way",
      text: "Choose between Classroom and LIVE-Online programmes, depending on the available course and your preparation requirements.",
    },
  ],
  presence: {
    eyebrow: "Institutional presence",
    heading: "A place to learn, prepare and grow.",
    description:
      "Experience classroom learning at Vajiram & Ravi's institute in Old Rajinder Nagar, New Delhi, or explore the flexibility of its LIVE-Online programmes.",
    location: "Old Rajinder Nagar, New Delhi",
    primary: {
      label: "View Institute Location",
      href: "https://www.google.com/maps/search/?api=1&query=Vajiram+and+Ravi+1-B%2F7+Pusa+Road+Old+Rajinder+Nagar+New+Delhi+110060",
    },
    secondary: { label: "Explore Learning Options", href: "#programmes" },
  },
};

/* ---------- 04 Programmes ---------- */

export const programmesIntro = {
  eyebrow: "Find your preparation path",
  heading: "Find the programme that fits your preparation.",
  description:
    "Every aspirant begins at a different stage. Whether you're building your foundation, strengthening a particular subject or preparing for a specific stage of the examination, explore the programmes designed to support your requirements.",
};

export const featured = {
  badge: "Featured Programme",
  eyebrow: "General Studies Prelims cum Mains Programme 2028",
  heading: "Build a strong foundation for every stage of General Studies.",
  description:
    "Prepare for UPSC Prelims and Mains through a structured General Studies programme that brings together subject teaching, focused study materials, regular assessments, revision and academic guidance.",
  highlights: [
    { figure: "900+", title: "Hours of Teaching", text: "Structured classroom teaching delivered by experienced subject specialists." },
    { figure: "18", title: "Yellow Books", text: "Focused study materials covering the General Studies syllabus." },
    { figure: "30", title: "Prelims Tests", text: "Regular objective-question practice covering General Studies and Current Affairs." },
    { title: "Mentorship Support", text: "Access to mentoring sessions for doubt clarification and preparation guidance." },
    { title: "Extended Mains Support", text: "Additional six-month Mains Support Programme as specified for the 2028 programme." },
    { title: "Integrated Current Affairs", text: "Access to The Recitals monthly current affairs magazine." },
  ] as { figure?: string; title: string; text: string }[],
  options: [
    { title: "Classroom Programme", text: "A structured classroom learning experience at the New Delhi institute." },
    { title: "LIVE-Online Programme", text: "Attend live classes online and access relevant learning resources." },
  ],
  primary: { label: "Explore GS Programme", href: "#" },
  secondary: { label: "View Upcoming Batches", href: "#batches" },
  note: "Available for UPSC CSE 2028.",
};

export const otherProgrammesIntro = {
  heading: "Explore more ways to strengthen your preparation.",
  description:
    "From focused subject preparation to examination-specific practice, discover additional programmes that address different requirements of the Civil Services Examination.",
  link: { label: "View All Programmes", href: "#" },
};

export type Programme = { title: string; description: string; cta: Link };

export const programmes: Programme[] = [
  {
    title: "General Studies Two-Year Foundation",
    description:
      "Build your understanding of General Studies progressively, moving from foundational concepts to advanced UPSC preparation through a structured two-year learning programme.",
    cta: { label: "Explore Programme", href: "#" },
  },
  {
    title: "Optional Subject Programmes",
    description: "Develop subject-specific knowledge and prepare for the Optional Subject papers through focused academic programmes.",
    cta: { label: "Explore Optional Subjects", href: "#" },
  },
  {
    title: "Prelims Test Series",
    description:
      "Strengthen your Prelims preparation through examination-oriented practice and assessments covering General Studies and relevant current affairs.",
    cta: { label: "Explore Prelims Test Series", href: "#" },
  },
  {
    title: "Mains Test Series",
    description:
      "Practise answer writing, assess your understanding and improve your ability to structure analytical responses through focused Mains assessments.",
    cta: { label: "Explore Mains Test Series", href: "#" },
  },
  {
    title: "Mentorship Programme",
    description: "Get academic guidance and preparation support through a structured mentorship programme designed for Civil Services aspirants.",
    cta: { label: "Explore Mentorship", href: "#" },
  },
  {
    title: "Module Courses",
    description: "Strengthen specific areas of your preparation through focused modules covering subjects and topics relevant to the UPSC examination.",
    cta: { label: "Explore Module Courses", href: "#" },
  },
  {
    title: "CSAT Course",
    description:
      "Develop the aptitude, comprehension and problem-solving skills required for the Civil Services Preliminary Examination's CSAT paper.",
    cta: { label: "Explore CSAT Course", href: "#" },
  },
  {
    title: "Interview Guidance Programme",
    description: "Prepare for the Personality Test with focused academic guidance and support for the final stage of the Civil Services Examination.",
    cta: { label: "Explore Interview Guidance", href: "#" },
  },
];

/* ---------- 05 Batches ---------- */

export const batchesIntro = {
  eyebrow: "Plan your next step",
  heading: "Your next batch could be the beginning of something meaningful.",
  description: "Explore upcoming programmes, check their starting dates and find a learning option that fits your preparation plan.",
  more: {
    heading: "Can't find the batch you're looking for?",
    text: "Explore all available schedules and admission opportunities.",
    cta: { label: "View All Upcoming Batches", href: "#" },
  },
};

export type Batch = {
  programme: string;
  /** Shown on the date stub. */
  day: string;
  month: string;
  year: string;
  details: { label: string; value: string }[];
  mode?: "Classroom" | "LIVE-Online";
  cta: Link;
};

export const batches: Batch[] = [
  {
    programme: "General Studies Prelims Cum Mains Programme 2028",
    day: "27",
    month: "Nov",
    year: "2026",
    mode: "Classroom",
    details: [
      { label: "Learning Mode", value: "Classroom" },
      { label: "Duration", value: "11 Months" },
      { label: "Course Time", value: "2:30 PM – 5:00 PM" },
    ],
    cta: { label: "View Batch Details", href: "#" },
  },
  {
    programme: "General Studies Prelims Cum Mains Programme 2028",
    day: "27",
    month: "Nov",
    year: "2026",
    mode: "LIVE-Online",
    details: [
      { label: "Learning Mode", value: "LIVE-Online" },
      { label: "Duration", value: "11 Months" },
    ],
    cta: { label: "View Batch Details", href: "#" },
  },
  {
    programme: "Prelims Camp 2027 – Batch 1",
    day: "23",
    month: "Nov",
    year: "2026",
    details: [{ label: "Target Examination", value: "UPSC CSE 2027" }],
    cta: { label: "View Batch Details", href: "#" },
  },
];

/* ---------- 06 Guidance ---------- */

export const guidance = {
  eyebrow: "Need help choosing?",
  heading: "A little guidance can make your next step clearer.",
  description:
    "Choosing a preparation programme is an important decision. Whether you're beginning your UPSC journey, considering a different preparation approach or unsure which course suits your needs, speak with our academic team to understand your options.",
  points: [
    "Understand the available preparation programmes.",
    "Find a suitable learning option.",
    "Clarify your questions about courses and admissions.",
    "Get guidance on your next step.",
  ],
  form: {
    heading: "Get Expert Guidance",
    description: "Share your details and our team will get in touch with you.",
    submit: "Request a Call Back",
    privacy: "Your information will only be used to respond to your enquiry.",
    confirmation: "Thank you for reaching out. Your enquiry has been received. Our team will get in touch with you.",
  },
  /** Options for "Programme of Interest". */
  programmeOptions: [
    "General Studies Prelims Cum Mains Programme 2028",
    "General Studies Two-Year Foundation",
    "Optional Subject Programmes",
    "Prelims Test Series",
    "Mains Test Series",
    "Mentorship Programme",
    "Module Courses",
    "CSAT Course",
    "Interview Guidance Programme",
    "Not sure yet",
  ],
  /** Options for "Preferred Time to Contact". Office hours are Mon – Sat, 9 AM – 7 PM. */
  timeOptions: ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 3 PM)", "Evening (3 PM – 7 PM)"],
};

/* ---------- 07 Educators ---------- */

export const educatorsIntro = {
  eyebrow: "Our faculty",
  heading: "Learn from the people who guide your preparation.",
  description:
    "Strong preparation begins with clear concepts and the right academic guidance. Get to know the educators who bring subject expertise, academic experience and examination-focused understanding to the classroom.",
  profileCta: "View Profile",
  cta: { label: "Explore Our Faculty", href: "#" },
  /** Shown on the page until approved profiles replace the prototype ones. */
  draftNote:
    "Profiles are carried over from the earlier prototype. Replace them with approved names, photographs, credentials and biographies before publishing.",
};

/* ---------- 08 Student stories ---------- */

export const storiesIntro = {
  eyebrow: "The student experience",
  heading: "Every preparation journey has a story.",
  description:
    "Behind every result is a journey of learning, practice and persistence. Hear from aspirants who have experienced preparation with Vajiram & Ravi and discover what they found valuable along the way.",
  cta: { label: "Discover More Student Experiences", href: "#" },
  draftNote:
    "Statements are still to be collected. Each story shows the interview prompt it will answer, not a written testimonial.",
};

export type StudentStory = {
  name: string;
  rank: string;
  exam: string;
  programme: string;
  image: string;
  /** Interview prompts from the content brief, shown until the student's own words are approved. */
  experiencePrompt: string;
  valuablePrompt: string;
};

export const studentStories: StudentStory[] = [
  {
    name: "Raghav Jhunjhunwala",
    rank: "AIR 4",
    exam: "UPSC CSE 2025",
    programme: "Interview Guidance Programme",
    image: "/images/toppers/raghav-jhunjhunwala.webp",
    experiencePrompt: "What did you find useful about faculty guidance?",
    valuablePrompt: "How did mentorship support your preparation?",
  },
  {
    name: "Ishan Bhatnagar",
    rank: "AIR 5",
    exam: "UPSC CSE 2025",
    programme: "Sociology Optional, Prelims CAMP, Interview Guidance Programme",
    image: "/images/toppers/ishan-bhatnagar.webp",
    experiencePrompt: "How did regular current affairs assessments help you identify areas that needed more attention?",
    valuablePrompt: "What did you find useful about faculty guidance?",
  },
  {
    name: "Zinnia Aurora",
    rank: "AIR 6",
    exam: "UPSC CSE 2025",
    programme: "GS Ethics Module, Interview Guidance Programme, Power Up 23",
    image: "/images/toppers/zinnia-aurora.webp",
    experiencePrompt: "How did answer-writing practice influence your approach to Mains?",
    valuablePrompt: "How did mentorship support your preparation?",
  },
];

/* ---------- 09 Resources ---------- */

export const resourcesIntro = {
  eyebrow: "Learn. Explore. Stay updated.",
  heading: "Stay informed. Keep your preparation moving.",
  description:
    "UPSC preparation requires more than classroom learning. Explore current affairs updates, study materials and academic resources from Vajiram & Ravi to stay informed about the issues shaping India and the world.",
  cta: { label: "Explore All Study Materials", href: "#" },
};

export type Resource = {
  title: string;
  category?: string;
  description: string;
  cta: Link;
  /**
   * Access label. The brief asks for free and enrolment-only materials to be told apart.
   * Every item is marked "Free to read" for now: confirm each one before publishing.
   */
  access: "Free to read" | "For enrolled students";
};

export const resources: Resource[] = [
  {
    title: "The Recitals",
    category: "Monthly Current Affairs Magazine",
    description:
      "Stay connected with important national and international developments through a structured monthly compilation. The Recitals brings current affairs into an exam-focused format, with Prelims MCQs, Mains questions and answers, feature articles and case studies.",
    cta: { label: "Explore The Recitals", href: "/recitals" },
    access: "Free to read",
  },
  {
    title: "Daily Current Affairs",
    description: "Follow important national and international developments through daily UPSC-focused current affairs updates.",
    cta: { label: "Read Latest Updates", href: "#" },
    access: "Free to read",
  },
  {
    title: "Prelims Pointers",
    description:
      "Review important developments in a concise format, with relevant context and connections to the Civil Services Preliminary Examination.",
    cta: { label: "Explore Prelims Pointers", href: "#" },
    access: "Free to read",
  },
  {
    title: "Mains Articles",
    description: "Explore current issues through analytical articles that help connect developments with important General Studies themes.",
    cta: { label: "Read Mains Articles", href: "#" },
    access: "Free to read",
  },
  {
    title: "Editorial Analysis",
    description: "Understand important opinions, debates and developments through editorial analysis relevant to Civil Services preparation.",
    cta: { label: "Explore Editorial Analysis", href: "#" },
    access: "Free to read",
  },
  {
    title: "Pensive: Weekly Essay",
    description: "Explore ideas, themes and perspectives that can help develop broader thinking for UPSC essay preparation.",
    cta: { label: "Read Pensive", href: "#" },
    access: "Free to read",
  },
  {
    title: "Infographics",
    description: "Review important topics and concepts through concise visual summaries that make information easier to understand.",
    cta: { label: "Explore Infographics", href: "#" },
    access: "Free to read",
  },
  {
    title: "Yojana & Kurukshetra Summaries",
    description:
      "Explore curated summaries of important themes and developments covered in Yojana and Kurukshetra, relevant to your UPSC preparation.",
    cta: { label: "Explore Summaries", href: "#" },
    access: "Free to read",
  },
];

/* ---------- 10 FAQ ---------- */

export const faqIntro = {
  eyebrow: "Need more clarity?",
  heading: "Questions, answered.",
  description:
    "Find answers to common questions about UPSC preparation, our programmes and the learning experience at Vajiram & Ravi.",
  more: {
    heading: "Still have questions?",
    text: "Get in touch with our academic team.",
    cta: { label: "Get Expert Guidance", href: "#guidance" },
  },
};

export const faqs: { question: string; answer: string }[] = [
  {
    question: "What are the different stages of the UPSC Civil Services Examination?",
    answer:
      "The UPSC Civil Services Examination consists of three stages: the Preliminary Examination, the Main Examination and the Personality Test. Each stage evaluates different knowledge, abilities and skills, and requires a focused preparation approach.",
  },
  {
    question: "Which programme should I choose for UPSC preparation?",
    answer:
      "The right programme depends on your preparation stage, requirements and examination target. Explore our General Studies, Optional Subject, Test Series, Mentorship and other programmes. You can also speak with our academic counselling team for guidance.",
  },
  {
    question: "Does Vajiram & Ravi offer both Classroom and LIVE-Online programmes?",
    answer:
      "Yes. Vajiram & Ravi offers Classroom and LIVE-Online learning options for relevant programmes. The available modes may vary depending on the course and batch. Please check the respective programme details.",
  },
  {
    question: "Does the General Studies Programme cover both Prelims and Mains?",
    answer:
      "Yes. The General Studies Prelims Cum Mains Programme is designed to support preparation for both examination stages through subject teaching, study materials, assessments, revision and relevant academic support.",
  },
  {
    question: "How can I find upcoming batches?",
    answer:
      "You can explore the Upcoming Batches section to check available programmes, starting dates, learning modes and admission information.",
  },
  {
    question: "How can I get help choosing a programme?",
    answer:
      "You can submit an enquiry through our website to connect with the academic counselling team and understand the programmes relevant to your preparation requirements.",
  },
  {
    question: "Where is Vajiram & Ravi located?",
    answer:
      "Vajiram & Ravi provides Civil Services Examination guidance at its institute in Old Rajinder Nagar, New Delhi. You can explore the location information on our website to plan a visit.",
  },
  {
    question: "What free study materials are available?",
    answer:
      "Vajiram & Ravi offers a range of current affairs updates and study resources, including The Recitals, daily current affairs, Prelims Pointers, Mains Articles and other academic materials. Please check the relevant resource pages for availability and access details.",
  },
  {
    question: "What is The Recitals?",
    answer:
      "The Recitals is Vajiram & Ravi's monthly current affairs magazine. It presents important developments through a structured, exam-oriented format, with Prelims MCQs, Mains Q&A, feature articles and case studies.",
  },
];

/* ---------- 11 Closing ---------- */

export const closing = {
  eyebrow: "Your next step starts here",
  heading: "Your civil services ambition deserves a strong start.",
  description:
    "Whether you're beginning your preparation or looking to strengthen your existing approach, explore the programmes, find the right academic support and take your next step with Vajiram & Ravi.",
  primary: { label: "Explore Programmes", href: "#programmes" },
  secondary: { label: "Get Expert Guidance", href: "#guidance" },
};

/* ---------- 12 Footer ---------- */

export const footer = {
  description:
    "Vajiram & Ravi has been guiding Civil Services aspirants since 1976 through experienced educators, structured academic programmes and focused preparation resources.",
  columns: [
    {
      heading: "About Us",
      links: [
        { label: "About Vajiram & Ravi", href: "#about" },
        { label: "Our Educators", href: "#educators" },
        { label: "Our Location", href: "#about" },
        { label: "Student Achievements", href: "#" },
      ],
    },
    {
      heading: "Programmes",
      links: [
        { label: "General Studies", href: "#programmes" },
        { label: "Optional Subjects", href: "#" },
        { label: "Mentorship", href: "#" },
        { label: "Prelims Test Series", href: "#" },
        { label: "Mains Test Series", href: "#" },
        { label: "Module Courses", href: "#" },
        { label: "CSAT", href: "#" },
        { label: "Interview Guidance", href: "#" },
      ],
    },
    {
      heading: "Preparation Resources",
      links: [
        { label: "Current Affairs", href: "#resources" },
        { label: "The Recitals", href: "/recitals" },
        { label: "Prelims Pointers", href: "#" },
        { label: "Mains Articles", href: "#" },
        { label: "Study Materials", href: "#resources" },
        { label: "FAQs", href: "#faq" },
      ],
    },
    {
      heading: "Admissions & Support",
      links: [
        { label: "Upcoming Batches", href: "#batches" },
        { label: "Enquiry", href: "#guidance" },
        { label: "Contact Us", href: "#guidance" },
      ],
    },
  ] as { heading: string; links: Link[] }[],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
  ],
  copyright: "© 2026 Vajiram & Ravi. All rights reserved.",
};
