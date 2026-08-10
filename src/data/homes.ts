export type StageStatus = "done" | "current" | "upcoming";

export type HomeStage = {
  id: string;
  label: string;
  date: string;
  status: StageStatus;
  description: string;
  image?: string;
};

export type HomeCategory =
  | "renovation"
  | "new_construction"
  | "coming_soon";

export type PreMarketStatus =
  | "JUST ACQUIRED"
  | "RENOVATION STARTING"
  | "UNDER RENOVATION"
  | "NEW CONSTRUCTION"
  | "COMING SOON";

export type PreMarketHome = {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  neighborhood: string;
  category: HomeCategory;
  status: PreMarketStatus;
  image: string;
  video: string;
  beds: number;
  baths: number;
  sqft: number;
  progress: number;
  expectedCompletion: string;
  priceMin: number;
  priceMax: number;
  interested: number;
  publisher: string;
  about: string;
  yearBuilt?: number;
  stages: HomeStage[];
};

export const FILTERS = [
  { id: "all", label: "All Homes" },
  { id: "renovation", label: "Renovation" },
  { id: "new_construction", label: "New Construction" },
  { id: "coming_soon", label: "Coming Soon" },
] as const;

export const homes: PreMarketHome[] = [
  {
    id: "001",
    address: "1024 North St.",
    city: "Logansport",
    state: "IN",
    zip: "46947",
    neighborhood: "Downtown Logansport",
    category: "renovation",
    status: "UNDER RENOVATION",
    image: "/images/monroe-hero.png",
    video: "/videos/monroe.mp4",
    beds: 3,
    baths: 2.5,
    sqft: 1920,
    progress: 68,
    expectedCompletion: "November 2026",
    priceMin: 289000,
    priceMax: 319000,
    interested: 34,
    publisher: "Omar Corp",
    about:
      "Full renovation of a two-story residence. Framing complete; interiors and kitchen underway. Follow the transformation and join early access before it hits the open market.",
    yearBuilt: 1960,
    stages: [
      {
        id: "acquired",
        label: "Property acquired",
        date: "Jan 18, 2026",
        status: "done",
        description: "Site secured and surveyed.",
        image: "/images/land.jpg",
      },
      {
        id: "demo",
        label: "Demolition completed",
        date: "Feb 3, 2026",
        status: "done",
        description: "Interior gut complete; ready for rebuild.",
        image: "/images/foundation.jpg",
      },
      {
        id: "framing",
        label: "Framing completed",
        date: "Mar 21, 2026",
        status: "done",
        description: "Structural framing finished.",
        image: "/images/framing.jpg",
      },
      {
        id: "windows",
        label: "New windows installed",
        date: "Apr 16, 2026",
        status: "done",
        description: "Envelope sealed and weather-ready.",
        image: "/images/roof.jpg",
      },
      {
        id: "kitchen",
        label: "Kitchen installation",
        date: "Today",
        status: "current",
        description: "Cabinetry, counters, and appliances in progress.",
        image: "/images/kitchen.jpg",
      },
      {
        id: "final",
        label: "Final finishes",
        date: "Oct 2026",
        status: "upcoming",
        description: "Paint, fixtures, landscaping, punch list.",
        image: "/images/interior.jpg",
      },
    ],
  },
  {
    id: "002",
    address: "418 Harrison Ave.",
    city: "Lafayette",
    state: "IN",
    zip: "47901",
    neighborhood: "Riverside",
    category: "new_construction",
    status: "NEW CONSTRUCTION",
    image: "/images/harrison.jpg",
    video: "/videos/harrison.mp4",
    beds: 4,
    baths: 3,
    sqft: 2480,
    progress: 15,
    expectedCompletion: "February 2027",
    priceMin: 398000,
    priceMax: 445000,
    interested: 21,
    publisher: "Omar Corp",
    about:
      "New construction family home. Foundation complete; framing rising on both levels. Early followers get priority when the private list opens.",
    stages: [
      {
        id: "acquired",
        label: "Lot acquired",
        date: "Mar 2, 2026",
        status: "done",
        description: "Lot prepared for foundation.",
        image: "/images/land.jpg",
      },
      {
        id: "foundation",
        label: "Foundation complete",
        date: "Apr 12, 2026",
        status: "done",
        description: "Concrete foundation poured and cured.",
        image: "/images/foundation.jpg",
      },
      {
        id: "framing",
        label: "Framing in progress",
        date: "Today",
        status: "current",
        description: "Wood framing across both levels.",
        image: "/images/framing.jpg",
      },
      {
        id: "roof",
        label: "Roofing",
        date: "Sep 2026",
        status: "upcoming",
        description: "Roof structure and weatherproofing.",
        image: "/images/roof.jpg",
      },
      {
        id: "interior",
        label: "Interior systems",
        date: "Nov 2026",
        status: "upcoming",
        description: "MEP and interior finishing.",
        image: "/images/interior.jpg",
      },
    ],
  },
  {
    id: "003",
    address: "890 Ellington Rd.",
    city: "Kokomo",
    state: "IN",
    zip: "46901",
    neighborhood: "North Kokomo",
    category: "coming_soon",
    status: "COMING SOON",
    image: "/images/ellington.jpg",
    video: "/videos/ellington.mp4",
    beds: 3,
    baths: 2,
    sqft: 1750,
    progress: 8,
    expectedCompletion: "May 2027",
    priceMin: 249000,
    priceMax: 279000,
    interested: 12,
    publisher: "Omar Corp",
    about:
      "Just acquired. Site survey complete. Construction begins soon — follow now to lock early access before renovation starts.",
    yearBuilt: 1972,
    stages: [
      {
        id: "acquired",
        label: "Property acquired",
        date: "Jun 1, 2026",
        status: "done",
        description: "Land secured for renovation.",
        image: "/images/land.jpg",
      },
      {
        id: "survey",
        label: "Site survey completed",
        date: "Aug 4, 2026",
        status: "done",
        description: "Marked and prepared for foundation work.",
        image: "/images/land.jpg",
      },
      {
        id: "start",
        label: "Renovation starting",
        date: "Soon",
        status: "current",
        description: "Demolition and rebuild kickoff.",
        image: "/images/foundation.jpg",
      },
      {
        id: "framing",
        label: "Framing",
        date: "TBD",
        status: "upcoming",
        description: "Structural rebuild.",
        image: "/images/framing.jpg",
      },
    ],
  },
  {
    id: "004",
    address: "215 Summit Ave.",
    city: "Logansport",
    state: "IN",
    zip: "46947",
    neighborhood: "Downtown Logansport",
    category: "coming_soon",
    status: "COMING SOON",
    image: "/images/monroe.jpg",
    video: "/videos/monroe.mp4",
    beds: 3,
    baths: 2,
    sqft: 1580,
    progress: 5,
    expectedCompletion: "June 2027",
    priceMin: 235000,
    priceMax: 265000,
    interested: 9,
    publisher: "Omar Corp",
    about:
      "Exterior-only preview. Full renovation plan locked; interior work starts after permits clear.",
    yearBuilt: 1958,
    stages: [
      {
        id: "acquired",
        label: "Property acquired",
        date: "Jul 12, 2026",
        status: "done",
        description: "Exterior survey complete.",
        image: "/images/land.jpg",
      },
      {
        id: "permits",
        label: "Permits in review",
        date: "Today",
        status: "current",
        description: "Waiting on renovation permits.",
        image: "/images/foundation.jpg",
      },
      {
        id: "demo",
        label: "Interior renovation",
        date: "TBD",
        status: "upcoming",
        description: "Full interior rebuild.",
        image: "/images/framing.jpg",
      },
    ],
  },
];

export const neighborhoods = [
  {
    id: "downtown-logansport",
    name: "Downtown Logansport",
    homesInProgress: 4,
    image: "/images/monroe-hero.png",
  },
  {
    id: "riverside",
    name: "Riverside",
    homesInProgress: 2,
    image: "/images/harrison.jpg",
  },
  {
    id: "north-kokomo",
    name: "North Kokomo",
    homesInProgress: 1,
    image: "/images/ellington.jpg",
  },
];

export function getHome(id: string) {
  return homes.find((h) => h.id === id);
}

export function formatPriceRange(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n.toLocaleString()}`;
  return `${fmt(min)} – ${fmt(max)}`;
}
