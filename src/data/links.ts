/**
 * Every link that leaves this page, in one place. Addresses on vajiramandravi.com come from the live
 * site's own navigation and footer, and each was checked to answer (31 Oct 2026). A page that does not
 * exist yet is `null` with a TODO: its link renders as plain text (LinkOrText, or an ArrowPill /
 * PlainPill with `href={null}`), never as a "#" link.
 */

const SITE = "https://vajiramandravi.com";

/** A link target: an address, an in-page anchor, or null while the page does not exist yet. */
export type Href = string | null;

export const links = {
  // Main navigation and listings.
  allCourses: `${SITE}/all-courses/`,
  currentAffairs: `${SITE}/current-affairs/`,
  upscExam: `${SITE}/upsc-exam/`,
  upcomingBatches: `${SITE}/new-upcoming-batches/`,
  toppers: `${SITE}/ias-selections-from-vajiram/`,
  topperStory: null, // TODO: a page per topper's story; the gallery links to the selections page until then

  // Programmes.
  gsCourse: `${SITE}/courses/upsc-general-studies/`,
  gsClassroom: `${SITE}/courses/upsc-gs-course/`,
  gsOnline: `${SITE}/courses/upsc-gs-online-course/`,
  twoYearCourse: `${SITE}/courses/2-year-upsc-course/`,
  twoYearOnline: `${SITE}/courses/2-year-upsc-online-course/`,
  onlineCoaching: `${SITE}/upsc-online-coaching/`,
  optionalSubject: `${SITE}/courses/upsc-optional-subject-courses/`,
  csat: `${SITE}/courses/upsc-csat-course/`,
  currentAffairsCourse: `${SITE}/courses/upsc-module-courses/current-affairs-course/`,
  prelimsTestSeries: `${SITE}/courses/prelims-test-series/`,
  mainsTestSeries: `${SITE}/courses/upsc-mains-test-series/`,
  mainsTestSeriesHindi: `${SITE}/courses/upsc-mains-test-series-hindi-medium/`,
  optionalTestSeries: `${SITE}/courses/upsc-mains-optional-subject-test-series/`,
  mentorship: `${SITE}/courses/upsc-mentorship-program/`,
  mentorshipHindi: `${SITE}/courses/upsc-mentorship-program-hindi-medium/`,
  interviewGuidance: `${SITE}/courses/interview-guidance-program/`,
  // The programme families of the all-courses page (checked 13 Nov 2026), for the homepage's programme grid.
  mentorshipPrograms: `${SITE}/courses/mentorship-programs/`,
  moduleCourses: `${SITE}/courses/upsc-module-courses/`,
  csatCourses: `${SITE}/courses/upsc-csat/`,
  mainsTestSeriesAll: `${SITE}/courses/mains-test-series/`,
  crashCourses: `${SITE}/courses/upsc-crash-courses/`,
  ifos: `${SITE}/courses/upsc-indian-forest-service-ifos-coaching/`,

  // Free resources.
  currentAffairsPrelims: `${SITE}/current-affairs/upsc-prelims-current-affairs/`,
  currentAffairsMains: `${SITE}/current-affairs/upsc-mains-current-affairs/`,
  studyMaterial: `${SITE}/upsc-exam/free-upsc-study-material-notes/`,
  questArticles: null, // TODO: Quest articles listing (the study material page may be it; confirm)
  article: null, // TODO: article pages, once the CMS gives each current-affairs article its address
  monthlyMagazine: `${SITE}/upsc-study-materials/monthly-current-affairs-magazine/`,
  // TODO: the live site has Yojana and Kurukshetra on separate pages; this tile opens Yojana.
  yojanaKurukshetra: `${SITE}/upsc-study-materials/yojana-magazine-pdf/`,
  previousYearPapers: `${SITE}/upsc-previous-year-papers/`,
  toppersAnswerSheets: `${SITE}/upsc-ias-toppers-copy-and-answer-sheets/`,
  essayPractice: `${SITE}/upsc-study-materials/weekly-essay/`,
  upscBooks: `${SITE}/upsc-exam/upsc-book-list/`,
  modelAnswers: `${SITE}/upsc-exam/model-answers-for-upsc-mains/`,
  // The free resources of the homepage content (10 Nov 2026). The Recitals is the monthly magazine page.
  theRecitals: `${SITE}/upsc-study-materials/monthly-current-affairs-magazine/`,
  dailyCurrentAffairs: `${SITE}/current-affairs/`,
  // TODO: the live site has no Prelims Pointers page; this opens the Prelims current affairs, the nearest.
  prelimsPointers: `${SITE}/current-affairs/upsc-prelims-current-affairs/`,
  mainsArticles: `${SITE}/current-affairs/upsc-mains-current-affairs/`,

  // UPSC exam guides and updates.
  upsc2027: `${SITE}/upsc-exam/upsc-2027/`,
  examPattern: `${SITE}/upsc-exam/upsc-exam-pattern/`,
  syllabus: `${SITE}/upsc-syllabus/`,
  csatSyllabus: `${SITE}/upsc-exam/csat-syllabus/`,
  optionalSubjectsList: `${SITE}/upsc-exam/optional-subjects-for-upsc/`,
  selectionProcess: `${SITE}/upsc-exam/upsc-selection-process/`,
  interview: `${SITE}/upsc-exam/upsc-interview/`,
  ageLimit: `${SITE}/upsc-exam/upsc-age-limit/`,
  iasSalary: `${SITE}/upsc-exam/ias-salary/`,
  calendar: `${SITE}/upsc-exam/upsc-calendar/`,
  admitCard: `${SITE}/upsc-exam/upsc-admit-card/`,
  prelimsAnswerKey: `${SITE}/upsc-exam/upsc-prelims-answer-key-2026/`,
  cutOff: `${SITE}/upsc-exam/upsc-cut-off/`,
  finalResult: `${SITE}/upsc-exam/upsc-result-2025/`,

  // The institute.
  aboutUs: `${SITE}/about-us/`,
  faculty: null, // TODO: the live site has no faculty page yet ("Meet Our Faculty")
  studentStories: null, // TODO: student stories and video testimonials ("Watch Student Stories"); no page or channel yet
  // TODO: the live site has no test series hub; "Explore Test Series" opens the Prelims test series.
  testSeries: `${SITE}/courses/prelims-test-series/`,
  careers: `${SITE}/careers/`, // The live site sends this on to vajiramias.com/careers/.
  termsAndConditions: `${SITE}/terms-and-conditions/`,
  privacyPolicy: `${SITE}/privacy-policy/`,
  grievanceRedressal: null, // TODO: the live site has no grievance redressal page yet
  whatsapp: "https://wa.me/918062206330", // TODO: confirm with the client that the admissions line takes WhatsApp
} satisfies Record<string, Href>;
