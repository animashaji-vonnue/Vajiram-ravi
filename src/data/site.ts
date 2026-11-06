/** Links pointing at "#" lead to pages that are not part of this homepage yet; clicking one shows a toast. */
export type LinkItem = { label: string; href: string };

export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  hours: "Mon – Sat, 9 AM – 7 PM",
  email: "admissions@vajiramandravi.com",
};

const SITE = "https://vajiramandravi.com";

/** A header item that opens a menu: its links, and a card for one thing worth pointing out. */
export type NavMenu = {
  label: string;
  /** Small heading over the links. */
  heading: string;
  links: LinkItem[];
  feature: { title: string; text: string; href: string; image: string };
};

/**
 * The header's items: plain links to pages on the main site, or menus. The links and their order
 * follow the current vajiramandravi.com header. The feature cards point at announcements running on
 * that site; their pictures are stand-ins from this page.
 */
export const mainNav: (LinkItem | NavMenu)[] = [
  { label: "All Courses", href: `${SITE}/all-courses/` },
  {
    label: "Toppers",
    heading: "Results",
    links: [
      { label: "CSE Toppers from Vajiram", href: `${SITE}/ias-selections-from-vajiram/` },
      { label: "IFoS Toppers from Vajiram", href: `${SITE}/ifos-selections-from-vajiram-and-ravi/` },
      { label: "UPSC Toppers’ Answer Sheet", href: `${SITE}/upsc-ias-toppers-copy-and-answer-sheets/` },
    ],
    feature: {
      title: "10 out of 10 top rankers",
      text: "The top 10 in UPSC CSE 2025 all prepared in a Vajiram & Ravi course.",
      href: `${SITE}/ias-selections-from-vajiram/`,
      image: "/images/hero/campus.webp",
    },
  },
  {
    label: "Study Materials",
    heading: "UPSC Study Materials",
    links: [
      {
        label: "The Recitals - Monthly Magazine",
        href: `${SITE}/upsc-study-materials/monthly-current-affairs-magazine/`,
      },
      { label: "QUEST UPSC Notes", href: `${SITE}/upsc-exam/free-upsc-study-material-notes/` },
      { label: "Pensive - Weekly Essay", href: `${SITE}/upsc-study-materials/weekly-essay/` },
      { label: "Infographic", href: `${SITE}/upsc-study-materials/infographics/` },
      { label: "Kurukshetra Summary", href: `${SITE}/upsc-study-materials/kurukshetra-magazine-pdf/` },
      { label: "Yojana Summary", href: `${SITE}/upsc-study-materials/yojana-magazine-pdf/` },
      { label: "Prelims Quick revision", href: `${SITE}/upsc-study-materials/prelims-quick-revision/` },
      { label: "GS Mains Probable", href: `${SITE}/upsc-study-materials/gs-mains-probable/` },
      { label: "Economic Survey 2025-26", href: `${SITE}/current-affairs/economic-survey-2026/` },
      { label: "Vajiram UPSC Books", href: `${SITE}/upsc-gs-postal-books/` },
    ],
    feature: {
      title: "General Studies postal books",
      text: "Printed GS books for UPSC preparation, sent to your door.",
      href: `${SITE}/upsc-gs-postal-books/`,
      image: "/images/gs-programme/library.webp",
    },
  },
  {
    label: "Current Affairs",
    heading: "Daily current affairs",
    links: [
      { label: "Daily Prelims Pointers", href: `${SITE}/current-affairs/upsc-prelims-current-affairs/` },
      { label: "Mains Article", href: `${SITE}/current-affairs/upsc-mains-current-affairs/` },
      { label: "Editorial Analysis", href: `${SITE}/current-affairs/daily-editorial-analysis/` },
    ],
    feature: {
      title: "SMART Current Affairs Programme 2027",
      text: "Admission open. Current affairs taught for both Prelims and Mains.",
      href: `${SITE}/courses/upsc-module-courses/current-affairs-course/`,
      image: "/images/courses/mains-test-series.jpg",
    },
  },
  {
    label: "UPSC Exam",
    heading: "About the exam",
    links: [
      { label: "UPSC 2027", href: `${SITE}/upsc-exam/upsc-2027/` },
      { label: "UPSC Calendar", href: `${SITE}/upsc-exam/upsc-calendar/` },
      { label: "UPSC Syllabus", href: `${SITE}/upsc-syllabus/` },
      { label: "Model Answers for UPSC Mains 2026", href: `${SITE}/upsc-exam/model-answers-for-upsc-mains/` },
      { label: "UPSC Age Limit", href: `${SITE}/upsc-exam/upsc-age-limit/` },
      { label: "IAS Salary", href: `${SITE}/upsc-exam/ias-salary/` },
      { label: "UPSC Mains Result 2025", href: `${SITE}/upsc-exam/upsc-mains-result/` },
      { label: "UPSC Prelims Result 2026", href: `${SITE}/upsc-exam/upsc-prelims-result-2026/` },
      { label: "UPSC Final Result", href: `${SITE}/upsc-exam/upsc-result/` },
      { label: "UPSC Optional Subjects List", href: `${SITE}/upsc-exam/optional-subjects-for-upsc/` },
      { label: "UPSC Mains Model Answers", href: `${SITE}/upsc-exam/model-answers-for-upsc-mains/` },
      { label: "UPSC PYQs", href: `${SITE}/upsc-previous-year-papers/` },
      { label: "UPSC Books", href: `${SITE}/upsc-exam/upsc-book-list/` },
      { label: "UPSC Cut Off", href: `${SITE}/upsc-exam/upsc-cut-off/` },
      { label: "UPSC Questions", href: `${SITE}/questions/` },
      { label: "Online Consultation", href: `${SITE}/online-counselling-for-admissions-at-vajiram-and-ravi/` },
    ],
    feature: {
      title: "Not sure where to start?",
      text: "Book an online consultation and talk through the exam and our programmes.",
      href: `${SITE}/online-counselling-for-admissions-at-vajiram-and-ravi/`,
      image: "/images/gs-programme/mentoring.webp",
    },
  },
  { label: "Upcoming Batches", href: `${SITE}/new-upcoming-batches/` },
  { label: "FAQs", href: `${SITE}/faq/` },
  { label: "Contact us", href: `${SITE}/contact-vajiram-and-ravi/` },
];

export const isNavMenu = (item: LinkItem | NavMenu): item is NavMenu => "links" in item;

/**
 * The site footer's links, from the design (3347:42630). Every link points to "#" until the pages it names exist;
 * the social links likewise wait for the institute's account addresses.
 */
const footerGroup = (title: string, labels: string[]) => ({
  title,
  links: labels.map((label) => ({ label, href: "#" })),
});

export const footer = {
  /**
   * The contact block at the top of the footer, from the design's "CTA updated" (3267:42644). Booking and WhatsApp
   * point to "#" until their addresses are known; email and phone use the institute's contact details.
   */
  contact: {
    eyebrow: "Contact us",
    heading: "What are you looking for?",
    intro: "We’re here to help you anytime, any way",
    cards: [
      {
        icon: "user",
        title: "Course counselling",
        text: "Not sure which programme fits? A counsellor can help you.",
        action: { label: "Book a free session", href: "#" },
      },
      {
        icon: "whatsapp",
        title: "Chat on WhatsApp",
        text: "Quick answers on courses, batches and fees from our admissions team.",
        action: { label: "Chat on WhatsApp", href: "#" },
      },
      {
        icon: "mail",
        title: "Email us",
        text: "Write to us on:",
        detail: contact.email,
        action: { label: "Send an email", href: `mailto:${contact.email}` },
      },
      {
        icon: "phone",
        title: "Talk to us",
        text: "Contact us on:",
        detail: contact.phone,
        action: { label: "Call now", href: contact.phoneHref },
      },
    ] as const,
    /** The Qutub Minar and the Charminar in line art, standing either side of the contact block. */
    monuments: { left: "/images/footer/qutub-minar.webp", right: "/images/footer/charminar.webp" },
  },
  /** The link groups, column by column; a column can hold more than one group. */
  columns: [
    [
      footerGroup("Courses", [
        "UPSC GS Course 2027",
        "UPSC GS Online Course 2027",
        "UPSC 2 Year Course",
        "UPSC 2 Year Online Course",
        "UPSC Online Coaching",
        "UPSC CSAT Course",
        "Current Affairs Course",
        "UPSC Study Material",
      ]),
    ],
    [
      footerGroup("Test series & mentorship", [
        "UPSC Prelims Test Series 2027",
        "UPSC Mains Test Series 2027",
        "UPSC Mains Test Series Hindi Medium",
        "UPSC Optional Test Series",
        "UPSC Mentorship Program 2027",
        "UPSC Mentorship Program Hindi Medium",
        "UPSC Interview Guidance Program IGP",
      ]),
      footerGroup("Vajiram & Ravi", ["About Us", "Careers", "Contact Us", "FAQs"]),
    ],
    [
      footerGroup("UPSC exam", [
        "UPSC 2027",
        "UPSC Exam Pattern",
        "UPSC Syllabus",
        "UPSC CSAT Syllabus",
        "UPSC Optional Subjects List",
        "UPSC Selection Process",
        "UPSC Interview",
        "UPSC Age Limit",
        "IAS Salary",
      ]),
    ],
    [
      footerGroup("Exam updates", [
        "UPSC Calendar 2027",
        "UPSC Admit Card",
        "UPSC Prelims Answer Key",
        "UPSC Cut Off",
        "UPSC Final Result 2025",
      ]),
      footerGroup("Free resources", [
        "UPSC Current Affairs",
        "UPSC Previous Year Papers",
        "UPSC Books",
        "Model Answers for UPSC Mains 2026",
      ]),
    ],
  ],
  copyright: "© 2026 Vajiram & Ravi. All rights reserved",
  social: [
    { name: "YouTube", href: "#" },
    { name: "Facebook", href: "#" },
    { name: "Instagram", href: "#" },
    { name: "Telegram", href: "#" },
    { name: "Quora", href: "#" },
    { name: "WhatsApp channel", href: "#" },
  ],
  policies: [
    { label: "Terms and Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Grievance Redressal", href: "#" },
  ],
};
