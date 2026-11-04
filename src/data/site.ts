import type { ComponentType } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  LaptopOutlineIcon,
  OpenBookIcon,
  QuoraIcon,
  TelegramIcon,
  TrophyIcon,
  WhatsAppIcon,
  YouTubeIcon,
  type IconProps,
} from "@/components/icons";

/**
 * Links pointing at "#" lead to pages that are not part of this prototype yet; clicking one shows a toast.
 * Homepage sections are linked as "/#section" so they also work from the other pages.
 */
export type LinkItem = { label: string; href: string };

export const contact = {
  phone: "080-6220-6330",
  phoneHref: "tel:+918062206330",
  hours: "Mon – Sat, 9 AM – 7 PM",
  email: "admissions@vajiramandravi.com",
};

export const mainNav: LinkItem[] = [
  { label: "All Courses", href: "/#courses" },
  { label: "Toppers", href: "/#toppers" },
  { label: "Study Materials", href: "/#resources" },
  { label: "Current Affairs", href: "/magazine" },
  { label: "UPSC Exam", href: "#" },
  { label: "Upcoming Batches", href: "/#batches" },
  { label: "FAQs", href: "/#faq" },
];

export type Announcement = {
  text: string;
  href: string;
  icon?: ComponentType<IconProps>;
  /** Renders in the larger 18px style. */
  large?: boolean;
};

export const announcements: Announcement[] = [
  { text: "59 questions in UPSC Prelims 2025 reflected from V&R Prelims Test Series", href: "#" },
  { text: "Ranker’s Programme · Admission open", href: "#courses", icon: TrophyIcon },
  { text: "Classroom GS PCM 2027 · Admission open", href: "#courses", icon: OpenBookIcon },
  { text: "Online GS PCM 2027 · Admission open", href: "#courses", icon: LaptopOutlineIcon },
  { text: "StepUp Mentorship 2027 · Admission open", href: "#courses", large: true },
];

export const footerColumns: { heading: string; links: LinkItem[] }[] = [
  {
    heading: "Vajiram & Ravi",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact Us", href: "/#contact" },
      { label: "FAQs", href: "/#faq" },
    ],
  },
  {
    heading: "Courses",
    links: [
      { label: "UPSC GS Course 2027", href: "#" },
      { label: "UPSC GS Online Course 2027", href: "#" },
      { label: "UPSC 2 Year Course", href: "#" },
      { label: "UPSC 2 Year Online Course", href: "#" },
      { label: "UPSC Online Coaching", href: "#" },
      { label: "UPSC CSAT Course", href: "#" },
      { label: "Current Affairs Course", href: "#" },
      { label: "UPSC Study Material", href: "#" },
    ],
  },
  {
    heading: "Test series & mentorship",
    links: [
      { label: "UPSC Prelims Test Series 2027", href: "#" },
      { label: "UPSC Mains Test Series 2027", href: "#" },
      { label: "UPSC Mains Test Series Hindi Medium", href: "#" },
      { label: "UPSC Optional Test Series", href: "#" },
      { label: "UPSC Mentorship Program 2027", href: "#" },
      { label: "UPSC Mentorship Program Hindi Medium", href: "#" },
      { label: "UPSC Interview Guidance Program IGP", href: "#" },
    ],
  },
  {
    heading: "UPSC exam",
    links: [
      { label: "UPSC 2027", href: "#" },
      { label: "UPSC Exam Pattern", href: "#" },
      { label: "UPSC Syllabus", href: "#" },
      { label: "UPSC CSAT Syllabus", href: "#" },
      { label: "UPSC Optional Subjects List", href: "#" },
      { label: "UPSC Selection Process", href: "#" },
      { label: "UPSC Interview", href: "#" },
      { label: "UPSC Age Limit", href: "#" },
      { label: "IAS Salary", href: "#" },
    ],
  },
  {
    heading: "Exam updates",
    links: [
      { label: "UPSC Calendar 2027", href: "#" },
      { label: "UPSC Admit Card", href: "#" },
      { label: "UPSC Prelims Answer Key", href: "#" },
      { label: "UPSC Cut Off", href: "#" },
      { label: "UPSC Final Result 2025", href: "#" },
    ],
  },
  {
    heading: "Free resources",
    links: [
      { label: "UPSC Current Affairs", href: "/#resources" },
      { label: "The Recitals monthly magazine", href: "/magazine" },
      { label: "UPSC Previous Year Papers", href: "#" },
      { label: "UPSC Books", href: "#" },
      { label: "Model Answers for UPSC Mains 2026", href: "#" },
    ],
  },
];

export const socialLinks: { label: string; href: string; icon: ComponentType<IconProps> }[] = [
  { label: "YouTube", href: "#", icon: YouTubeIcon },
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Telegram", href: "#", icon: TelegramIcon },
  { label: "Quora", href: "#", icon: QuoraIcon },
  { label: "WhatsApp channel", href: "#", icon: WhatsAppIcon },
];

export const legalLinks: LinkItem[] = [
  { label: "Terms and Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Grievance Redressal", href: "#" },
];
