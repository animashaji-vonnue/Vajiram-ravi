/** Site footer (Figma 2258:10170): link columns, the line-art skyline, the giant wordmark and the legal bar. */

import { links, type Href } from "./links";

/** A footer link. Its address comes from data/links; one whose page does not exist yet renders as text. */
export type FooterLink = { label: string; href: Href };

export const footerColumns: { heading: string; links: FooterLink[] }[] = [
  {
    heading: "Vajiram & Ravi",
    links: [
      { label: "About Us", href: links.aboutUs },
      { label: "Careers", href: links.careers },
      { label: "Contact Us", href: "#contact" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  {
    heading: "Courses",
    links: [
      { label: "UPSC GS Course 2027", href: links.gsClassroom },
      { label: "UPSC GS Online Course 2027", href: links.gsOnline },
      { label: "UPSC 2 Year Course", href: links.twoYearCourse },
      { label: "UPSC 2 Year Online Course", href: links.twoYearOnline },
      { label: "UPSC Online Coaching", href: links.onlineCoaching },
      { label: "UPSC CSAT Course", href: links.csat },
      { label: "Current Affairs Course", href: links.currentAffairsCourse },
      { label: "UPSC Study Material", href: links.studyMaterial },
    ],
  },
  {
    heading: "Test series & mentorship",
    links: [
      { label: "UPSC Prelims Test Series 2027", href: links.prelimsTestSeries },
      { label: "UPSC Mains Test Series 2027", href: links.mainsTestSeries },
      { label: "UPSC Mains Test Series Hindi Medium", href: links.mainsTestSeriesHindi },
      { label: "UPSC Optional Test Series", href: links.optionalTestSeries },
      { label: "UPSC Mentorship Program 2027", href: links.mentorship },
      { label: "UPSC Mentorship Program Hindi Medium", href: links.mentorshipHindi },
      { label: "UPSC Interview Guidance Program IGP", href: links.interviewGuidance },
    ],
  },
  {
    heading: "UPSC exam",
    links: [
      { label: "UPSC 2027", href: links.upsc2027 },
      { label: "UPSC Exam Pattern", href: links.examPattern },
      { label: "UPSC Syllabus", href: links.syllabus },
      { label: "UPSC CSAT Syllabus", href: links.csatSyllabus },
      { label: "UPSC Optional Subjects List", href: links.optionalSubjectsList },
      { label: "UPSC Selection Process", href: links.selectionProcess },
      { label: "UPSC Interview", href: links.interview },
      { label: "UPSC Age Limit", href: links.ageLimit },
      { label: "IAS Salary", href: links.iasSalary },
    ],
  },
  {
    heading: "Exam updates",
    links: [
      { label: "UPSC Calendar 2027", href: links.calendar },
      { label: "UPSC Admit Card", href: links.admitCard },
      { label: "UPSC Prelims Answer Key", href: links.prelimsAnswerKey },
      { label: "UPSC Cut Off", href: links.cutOff },
      { label: "UPSC Final Result 2025", href: links.finalResult },
    ],
  },
  {
    heading: "Free resources",
    links: [
      { label: "UPSC Current Affairs", href: "#resources" },
      { label: "UPSC Previous Year Papers", href: links.previousYearPapers },
      { label: "UPSC Books", href: links.upscBooks },
      { label: "Model Answers for UPSC Mains 2026", href: links.modelAnswers },
    ],
  },
];

export const footerWordmark = "Vajiram & Ravi";

export const footerCopyright = "© 2026 Vajiram & Ravi. All rights reserved";

export const footerLegal: FooterLink[] = [
  { label: "Terms and Conditions", href: links.termsAndConditions },
  { label: "Privacy Policy", href: links.privacyPolicy },
  { label: "Grievance Redressal", href: links.grievanceRedressal },
];
