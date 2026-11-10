export type Topper = {
  rank: number;
  name: string;
  /** Vajiram & Ravi programmes the topper took. */
  programme: string;
  image: string;
};

/** The latest result year: the one the results band opens on. */
export const toppersYear = 2025;

/**
 * The results band's copy (Figma "08 · Our Results & Student Stories", 2392:5005). The eyebrow, the grid's
 * name, its announcement and the button follow the year chosen on the ruler.
 */
export const toppersSection = {
  /** "UPSC CSE 2025 · RANKS 1–10" when all ten are ours, else e.g. "UPSC CSE 2023 · 8 IN THE TOP 10". */
  eyebrow: (year: number, count: number) => `UPSC CSE ${year} · ${count >= 10 ? "RANKS 1–10" : `${count} IN THE TOP 10`}`,
  /** The heading; its emphasis is set in orange italic. */
  heading: { lead: "Toppers who prepared", emphasis: "with Vajiram & Ravi" },
  /** The year ruler's accessible name. */
  rulerLabel: "Result year",
  /** The grid's accessible name. */
  gridLabel: (year: number) => `UPSC CSE ${year} toppers`,
  /** Read out (politely) when the grid changes year. */
  announcement: (year: number, count: number) => `UPSC CSE ${year}: ${count} toppers`,
  cta: (year: number) => `See all CSE ${year} selections`,
};

/**
 * UPSC CSE 2025, ranks 1 to 14. Ranks 11 to 14 and their photos come from Vajiram & Ravi's selections page
 * (vajiramandravi.com/ias-selections-from-vajiram), cut out to match the other portraits. The programmes of
 * AIR 4, 7, 9 and 10 follow the design brief; TODO: the selections page lists only the IGP for them, so
 * confirm with the client which is right.
 */
export const toppers: Topper[] = [
  { rank: 1, name: "Anuj Agnihotri", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/anuj-agnihotri.webp" },
  { rank: 2, name: "Rajeshwari Suve M", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/rajeshwari-suve-m.webp" },
  { rank: 3, name: "Akansh Dhull", programme: "GS Prelims cum Mains Classroom Programme", image: "/images/toppers/akansh-dhull.webp" },
  { rank: 4, name: "Raghav Jhunjhunwala", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/raghav-jhunjhunwala.webp" },
  { rank: 5, name: "Ishan Bhatnagar", programme: "Sociology Optional, Prelims CAMP, IGP", image: "/images/toppers/ishan-bhatnagar.webp" },
  { rank: 6, name: "Zinnia Aurora", programme: "GS Ethics Module, IGP, Power Up 23", image: "/images/toppers/zinnia-aurora.webp" },
  { rank: 7, name: "A R Rajah Mohaideen", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/a-r-rajah-mohaideen.webp" },
  { rank: 8, name: "Pakshal Secretry", programme: "Mains Camp, IGP", image: "/images/toppers/pakshal-secretry.webp" },
  { rank: 9, name: "Astha Jain", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/astha-jain.webp" },
  { rank: 10, name: "Ujjwal Priyank", programme: "PowerUp Prelims Test Series, IGP, Mains Test Series", image: "/images/toppers/ujjwal-priyank.webp" },
  { rank: 11, name: "Yashaswi Raj Vardhan", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/yashaswi-raj-vardhan.webp" },
  { rank: 12, name: "Akshit Bhardwaj", programme: "Prelims CAMP, General Studies, IGP", image: "/images/toppers/akshit-bhardwaj.webp" },
  { rank: 13, name: "Ananya Sharma", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers/ananya-sharma.webp" },
  { rank: 14, name: "Surabhi Yadav", programme: "Ethics Answer Writing Programme, IGP", image: "/images/toppers/surabhi-yadav.webp" },
];

/**
 * Ranks 1 to 10 for the results grid, with the design's cut-out portraits (saved at 480px square), which
 * stand on the cards' dark ground.
 */
const latestToppers = toppers.slice(0, 10).map((topper) => ({
  ...topper,
  image: `/images/toppers/stamps/air-${topper.rank}.webp`,
}));

/**
 * Toppers of earlier years, from Vajiram & Ravi's selections page (vajiramandravi.com/ias-selections-from-vajiram).
 * Only the ranks listed there appear, and programmes are listed only from 2023.
 */
const earlierYears: Record<number, Topper[]> = {
  2024: [
    { rank: 1, name: "Shakti Dubey", programme: "GS PCM 10 Months, Sure Shot Mains Test Series, Power Up Prelims Test Series, Smart Current Affairs", image: "/images/toppers-years/2024-air-1.webp" },
    { rank: 2, name: "Harshita Goyal", programme: "Powerup Prelims Test Series, Interview Guidance Program", image: "/images/toppers-years/2024-air-2.webp" },
    { rank: 3, name: "Dongre Archit Parag", programme: "Interview Guidance Program", image: "/images/toppers-years/2024-air-3.webp" },
    { rank: 4, name: "Shah Margi Chirag", programme: "Interview Guidance Program", image: "/images/toppers-years/2024-air-4.webp" },
    { rank: 5, name: "Aakash Garg", programme: "Interview Guidance Program", image: "/images/toppers-years/2024-air-5.webp" },
    { rank: 6, name: "Komal Punia", programme: "GS PCM 10 Months, Sure Shot Mains Test Series, SMART Current Affairs, Essay Module", image: "/images/toppers-years/2024-air-6.webp" },
    { rank: 7, name: "Aayushi Bansal", programme: "GS PCM 10 Months, Optional Sociology, Ethics Module, Sociology Mains Test Series", image: "/images/toppers-years/2024-air-7.webp" },
    { rank: 10, name: "Mayank Tripathi", programme: "GS PCM 10 Months", image: "/images/toppers-years/2024-air-10.webp" },
  ],
  2023: [
    { rank: 1, name: "Aditya Srivastava", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-1.webp" },
    { rank: 2, name: "Animesh Pradhan", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-2.webp" },
    { rank: 3, name: "Donuru Ananya Reddy", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-3.webp" },
    { rank: 5, name: "Ruhani", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-5.webp" },
    { rank: 6, name: "Srishti Dabas", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-6.webp" },
    { rank: 8, name: "Ashish Kumar", programme: "Sociology & IGP", image: "/images/toppers-years/2023-air-8.webp" },
    { rank: 9, name: "Nausheen", programme: "Test Series & IGP", image: "/images/toppers-years/2023-air-9.webp" },
    { rank: 10, name: "Aishwaryam Prajapati", programme: "Interview Guidance Programme (IGP)", image: "/images/toppers-years/2023-air-10.webp" },
  ],
  2022: [
    { rank: 1, name: "Ishita Kishore", programme: "", image: "/images/toppers-years/2022-air-1.webp" },
    { rank: 2, name: "Garima Lohia", programme: "", image: "/images/toppers-years/2022-air-2.webp" },
    { rank: 3, name: "Uma Harathi N", programme: "", image: "/images/toppers-years/2022-air-3.webp" },
    { rank: 4, name: "Smriti Mishra", programme: "", image: "/images/toppers-years/2022-air-4.webp" },
    { rank: 5, name: "Mayur Hazarika", programme: "", image: "/images/toppers-years/2022-air-5.webp" },
    { rank: 9, name: "Kanika Goyal", programme: "", image: "/images/toppers-years/2022-air-9.webp" },
    { rank: 10, name: "Rahul Srivastava", programme: "", image: "/images/toppers-years/2022-air-10.webp" },
  ],
  2021: [
    { rank: 1, name: "Shruti Sharma", programme: "", image: "/images/toppers-years/2021-air-1.webp" },
    { rank: 2, name: "Ankita Agarwal", programme: "", image: "/images/toppers-years/2021-air-2.webp" },
    { rank: 3, name: "Gamini Singla", programme: "", image: "/images/toppers-years/2021-air-3.webp" },
    { rank: 4, name: "Aishwarya Verma", programme: "", image: "/images/toppers-years/2021-air-4.webp" },
    { rank: 6, name: "Yaksh Chaudhary", programme: "", image: "/images/toppers-years/2021-air-6.webp" },
    { rank: 7, name: "Samyak S Jain", programme: "", image: "/images/toppers-years/2021-air-7.webp" },
    { rank: 9, name: "Preetam Kumar", programme: "", image: "/images/toppers-years/2021-air-9.webp" },
    { rank: 10, name: "Harkeerat Singh Randhawa", programme: "", image: "/images/toppers-years/2021-air-10.webp" },
  ],
  2020: [
    { rank: 1, name: "Shubham Kumar", programme: "", image: "/images/toppers-years/2020-air-1.webp" },
    { rank: 2, name: "Jagrati Awasthi", programme: "", image: "/images/toppers-years/2020-air-2.webp" },
    { rank: 3, name: "Ankita Jain", programme: "", image: "/images/toppers-years/2020-air-3.webp" },
    { rank: 5, name: "Mamta Yadav", programme: "", image: "/images/toppers-years/2020-air-5.webp" },
    { rank: 9, name: "Apala Mishra", programme: "", image: "/images/toppers-years/2020-air-9.webp" },
    { rank: 10, name: "Satyam Gandhi", programme: "", image: "/images/toppers-years/2020-air-10.webp" },
  ],
  2019: [
    { rank: 1, name: "Pradeep Singh", programme: "", image: "/images/toppers-years/2019-air-1.webp" },
    { rank: 4, name: "Himanshu Jain", programme: "", image: "/images/toppers-years/2019-air-4.webp" },
    { rank: 6, name: "Vishakha Yadav", programme: "", image: "/images/toppers-years/2019-air-6.webp" },
    { rank: 8, name: "Abhishek Saraf", programme: "", image: "/images/toppers-years/2019-air-8.webp" },
    { rank: 9, name: "Ravi Jain", programme: "", image: "/images/toppers-years/2019-air-9.webp" },
  ],
  2018: [
    { rank: 1, name: "Kanishak Kataria", programme: "", image: "/images/toppers-years/2018-air-1.webp" },
    { rank: 2, name: "Akshat Jain", programme: "", image: "/images/toppers-years/2018-air-2.webp" },
    { rank: 3, name: "Junaid Ahmad", programme: "", image: "/images/toppers-years/2018-air-3.webp" },
    { rank: 4, name: "Shreyans Kumat", programme: "", image: "/images/toppers-years/2018-air-4.webp" },
    { rank: 7, name: "Karnati Varun Reddy", programme: "", image: "/images/toppers-years/2018-air-7.webp" },
    { rank: 8, name: "Vaishali Singh", programme: "", image: "/images/toppers-years/2018-air-8.webp" },
    { rank: 9, name: "Gunjan Dwivedi", programme: "", image: "/images/toppers-years/2018-air-9.webp" },
    { rank: 10, name: "Tanmay Vashistha Sharma", programme: "", image: "/images/toppers-years/2018-air-10.webp" },
  ],
  2017: [
    { rank: 1, name: "Durishetty Anudeep", programme: "", image: "/images/toppers-years/2017-air-1.webp" },
    { rank: 2, name: "Anu Kumari", programme: "", image: "/images/toppers-years/2017-air-2.webp" },
    { rank: 3, name: "Sachin Gupta", programme: "", image: "/images/toppers-years/2017-air-3.webp" },
    { rank: 4, name: "Atul Prakash", programme: "", image: "/images/toppers-years/2017-air-4.webp" },
    { rank: 5, name: "Pratham Kaushik", programme: "", image: "/images/toppers-years/2017-air-5.webp" },
    { rank: 6, name: "Koya Sree Harsha", programme: "", image: "/images/toppers-years/2017-air-6.webp" },
    { rank: 7, name: "Ayush Sinha", programme: "", image: "/images/toppers-years/2017-air-7.webp" },
    { rank: 10, name: "Abhishek Surana", programme: "", image: "/images/toppers-years/2017-air-10.webp" },
  ],
  2016: [
    { rank: 1, name: "Nandini KR", programme: "", image: "/images/toppers-years/2016-air-1.webp" },
    { rank: 2, name: "Anmol Sher Singh", programme: "", image: "/images/toppers-years/2016-air-2.webp" },
    { rank: 6, name: "Kothamasu Dinesh Kumar", programme: "", image: "/images/toppers-years/2016-air-6.webp" },
    { rank: 7, name: "Anand Vardhan", programme: "", image: "/images/toppers-years/2016-air-7.webp" },
    { rank: 8, name: "Shweta Chauhan", programme: "", image: "/images/toppers-years/2016-air-8.webp" },
    { rank: 9, name: "Sumansourav Mohanty", programme: "", image: "/images/toppers-years/2016-air-9.webp" },
    { rank: 10, name: "Bilal Mohi Ud Din Bhat", programme: "", image: "/images/toppers-years/2016-air-10.webp" },
  ],
};

/** Every year's toppers, in rank order: the results band's year ruler offers each year. */
export const toppersByYear: Record<number, Topper[]> = { [toppersYear]: latestToppers, ...earlierYears };

/** The years on the ruler, latest first. */
export const toppersYears = Object.keys(toppersByYear)
  .map(Number)
  .sort((a, b) => b - a);
