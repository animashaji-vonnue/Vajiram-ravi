export type ResourceColumn = {
  title: string;
  items: string[];
  /** Greyer arrows and a slightly taller heading, as in the design's Mains and Quest columns. */
  muted?: boolean;
};

export const resourceColumns: ResourceColumn[] = [
  {
    title: "Prelims",
    items: [
      "United Kingdom Maritime Trade Operations (UKMTO)",
      "Mauritius",
      "Narwhals",
      "Thiksey Monastery",
      "Long Tailed Marmot",
      "Squint Eye",
    ],
  },
  {
    title: "Mains",
    muted: true,
    items: [
      "Mobile Phone Manufacturing Scheme (MPMS) – From Assembly Hub to Indian-Owned Brands",
      "US–India Trade Tensions: The Great Transhipment Scam and Tariff Allegations",
      "U.S.–India Electoral Systems: Trump’s Voting ID Rules and the SAVE America Act",
      "NITI Aayog Report Flags Large Gap Between Education and Employment for Indian Youth",
      "India’s Sugar Price Hike: Causes, Government Response and the Ethanol Debate",
      "Census 2027 Questionnaire – New Questions, NPR Link and Concerns Over Data Collection",
    ],
  },
  {
    title: "Quest",
    muted: true,
    items: [
      "UN Reforms, Need, Security Council, General Assembly, Challenges",
      "World Meteorological Organization (WMO), Headquarters, Members",
      "Article 21, Rights, Doctrines, Challenges, Case Laws, Way Forward",
      "Reserve Bank of India (RBI), Governor, Structure, Functions",
      "Federalism in Indian Polity, Significance, Features",
      "Muslim League, Background, Formation, Objectives, Impacts",
    ],
  },
];

export const otherResources: { label: string; href: string }[] = [
  { label: "Monthly magazine", href: "/magazine" },
  { label: "Yojana & Kurukshetra", href: "#" },
  { label: "Previous year papers", href: "#" },
  { label: "Toppers’ answer sheets", href: "#" },
  { label: "Essay practice", href: "#" },
];
