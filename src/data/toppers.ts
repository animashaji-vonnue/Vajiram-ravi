export type Topper = {
  rank: number;
  name: string;
  /** Vajiram & Ravi programmes the topper took. */
  programme: string;
  image: string;
};

/** The latest result year. */
export const toppersYear = 2025;

/**
 * UPSC CSE 2025, ranks 1 to 14. Ranks 11 to 14 and their photos come from Vajiram & Ravi's selections page
 * (vajiramandravi.com/ias-selections-from-vajiram), cut out to match the other portraits. The programmes of
 * AIR 4, 7, 9 and 10 follow the design brief; TODO: the selections page lists only the IGP for them, so
 * confirm with the client which is right.
 */
export const toppers: Topper[] = [
  { rank: 1, name: "Anuj Agnihotri", programme: "Interview guidance programme (IGP)", image: "/images/toppers/anuj-agnihotri.webp" },
  { rank: 2, name: "Rajeshwari Suve M", programme: "PowerUp Prelims test series, IGP, Mains test series", image: "/images/toppers/rajeshwari-suve-m.webp" },
  { rank: 3, name: "Akansh Dhull", programme: "GS Prelims cum Mains classroom programme", image: "/images/toppers/akansh-dhull.webp" },
  { rank: 4, name: "Raghav Jhunjhunwala", programme: "PowerUp Prelims test series, IGP, Mains test series", image: "/images/toppers/raghav-jhunjhunwala.webp" },
  { rank: 5, name: "Ishan Bhatnagar", programme: "Sociology optional, Prelims CAMP, IGP", image: "/images/toppers/ishan-bhatnagar.webp" },
  { rank: 6, name: "Zinnia Aurora", programme: "GS Ethics module, IGP, PowerUp 23", image: "/images/toppers/zinnia-aurora.webp" },
  { rank: 7, name: "A R Rajah Mohaideen", programme: "PowerUp Prelims test series, IGP, Mains test series", image: "/images/toppers/a-r-rajah-mohaideen.webp" },
  { rank: 8, name: "Pakshal Secretry", programme: "Mains CAMP, IGP", image: "/images/toppers/pakshal-secretry.webp" },
  { rank: 9, name: "Astha Jain", programme: "PowerUp Prelims test series, IGP, Mains test series", image: "/images/toppers/astha-jain.webp" },
  { rank: 10, name: "Ujjwal Priyank", programme: "PowerUp Prelims test series, IGP, Mains test series", image: "/images/toppers/ujjwal-priyank.webp" },
  { rank: 11, name: "Yashaswi Raj Vardhan", programme: "Interview guidance programme (IGP)", image: "/images/toppers/yashaswi-raj-vardhan.webp" },
  { rank: 12, name: "Akshit Bhardwaj", programme: "Prelims CAMP, General Studies, IGP", image: "/images/toppers/akshit-bhardwaj.webp" },
  { rank: 13, name: "Ananya Sharma", programme: "Interview guidance programme (IGP)", image: "/images/toppers/ananya-sharma.webp" },
  { rank: 14, name: "Surabhi Yadav", programme: "Ethics answer writing programme, IGP", image: "/images/toppers/surabhi-yadav.webp" },
];
