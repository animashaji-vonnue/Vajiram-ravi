import { links, type Href } from "@/data/links";

/** "Meet our educators" (IA 7; Figma "06 · Meet Our Educators", 2377:4795). Copy: the client's homepage content, §07. */
export const facultyIntro = {
  /** The H2; the emphasis is its italic second beat. */
  heading: { lead: "Learn from those who understand", emphasis: "the demands of the examination." },
  /** Under the heading. */
  lead: "Build your understanding with experienced educators and subject specialists who bring academic knowledge and examination-focused teaching into the classroom.",
  /** On the note card at the right of the heading. */
  /** Shown on the note card once the faculty page exists (links.faculty is null today). */
  cta: { label: "Meet Our Faculty", href: links.faculty },
};

export type Educator = {
  name: string;
  /** The subject or area of expertise, under the name. */
  focus: string;
  /** A colour portrait, 400 × 600 (the card is 200 × 300); the ring shows it in black and white off centre. */
  photo: string;
  /** The educator's profile page; null while it does not exist (the card then is not a link). */
  profile: Href;
  /** Academic qualifications, as the institute words them. Shown under the ring for the centred educator (with the two below), only when given. */
  qualifications?: string;
  /** Relevant teaching experience, as the institute words it. Shown only when given. */
  experience?: string;
  /** A short introduction, a sentence or two. Shown only when given. */
  introduction?: string;
};

// TODO: profile pages (`profile`), and the rest of the ~30 GS educators.
// TODO: placeholder — every `qualifications`, `experience` and `introduction` below is dummy copy written to
// show the layout (the client allowed placeholders, 10 Nov 2026). They are not facts about these
// educators: replace each with the institute's own wording before launch.
export const educators: Educator[] = [
  {
    name: "SK Manocha",
    focus: "General Studies · Polity & Governance",
    photo: "/images/faculty/sk-manocha-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Political Science",
    experience: "20+ years teaching UPSC",
    introduction: "Builds Polity from the Constitution up, and ties every topic to the way the examination asks about it.",
  },
  {
    name: "Brijender Singh",
    focus: "Essay",
    photo: "/images/faculty/brijender-singh-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, English Literature",
    experience: "15+ years teaching UPSC",
    introduction: "Helps you find a clear argument, shape it into a structure and write it out within the time.",
  },
  {
    name: "Md. Rizwan",
    focus: "Geography optional",
    photo: "/images/faculty/md-rizwan-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Geography",
    experience: "15+ years teaching UPSC",
    introduction: "Teaches Geography through maps, diagrams and examples you can carry straight into the answer.",
  },
  {
    name: "Md. Tarique",
    focus: "History optional",
    photo: "/images/faculty/md-tarique-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, History",
    experience: "15+ years teaching UPSC",
    introduction: "Turns long stretches of History into connected themes that are easier to revise and to write about.",
  },
  {
    name: "Mukul Pathak",
    focus: "Psychology optional",
    photo: "/images/faculty/mukul-pathak-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Psychology",
    experience: "10+ years teaching UPSC",
    introduction: "Links psychological theory to everyday examples, so the concepts stay with you in the examination hall.",
  },
  {
    name: "Shyam Sundar",
    focus: "Economics optional",
    photo: "/images/faculty/shyam-sundar-portrait.webp",
    profile: null,
    qualifications: "Postgraduate, Economics",
    experience: "15+ years teaching UPSC",
    introduction: "Explains Economics from first principles and then applies it to the questions India faces today.",
  },
];
