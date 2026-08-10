export type StageStatus = "done" | "current" | "upcoming";

export type BuildStage = {
  id: string;
  label: string;
  date: string;
  status: StageStatus;
  description: string;
  images: string[];
  hasVideo?: boolean;
};

export type ResidenceStatus =
  | "AVAILABLE"
  | "PRIVATE LIST OPEN"
  | "COMING SOON";

export type Residence = {
  id: string;
  code: string;
  name: string;
  location: string;
  image: string;
  video: string;
  teaser: string;
  beds: number;
  baths: number;
  sqft: number;
  garage: number;
  progress: number;
  expected: string;
  /** ISO date — target completion for live countdown */
  completionDate: string;
  status: ResidenceStatus;
  followers: number;
  waitlistCount: number;
  waitlistLimited: boolean;
  /** Launch / pre-sale starting price in USD */
  priceFrom: number;
  /** Estimated finished market value in USD */
  marketValue: number;
  /** Curiosity line under the price */
  priceHook: string;
  tagline: string;
  stages: BuildStage[];
  latestUpdate?: {
    title: string;
    body: string;
    date: string;
    /** Optional thumbnail for the latest-update card */
    image?: string;
  };
};

export const residences: Residence[] = [
  {
    id: "001",
    code: "RESIDENCE 001",
    name: "THE MONROE",
    location: "Logansport, Indiana",
    image: "/images/monroe-hero.png",
    video: "/videos/monroe.mp4",
    teaser: "De terreno vacío a hogar. Mira cómo despierta.",
    beds: 3,
    baths: 2.5,
    sqft: 1920,
    garage: 2,
    progress: 62,
    expected: "November 2026",
    completionDate: "2026-11-15T18:00:00",
    status: "AVAILABLE",
    followers: 42,
    waitlistCount: 128,
    waitlistLimited: true,
    priceFrom: 312000,
    marketValue: 389000,
    priceHook: "Precio de preventa · sube con cada etapa",
    tagline: "Modern living, reimagined for Indiana.",
    latestUpdate: {
      title: "Interior framing completed",
      body: "Structural framing for the main level is complete.",
      date: "AUG 08",
      image: "/images/framing.jpg",
    },
    stages: [
      {
        id: "land",
        label: "Land",
        date: "JAN 18",
        status: "done",
        description: "Site secured and surveyed for Residence 001.",
        images: ["/images/land.jpg"],
      },
      {
        id: "foundation",
        label: "Foundation",
        date: "FEB 03",
        status: "done",
        description: "Concrete foundation poured and cured.",
        images: ["/images/foundation.jpg"],
        hasVideo: true,
      },
      {
        id: "framing",
        label: "Framing",
        date: "MAR 21",
        status: "done",
        description: "Structural framing completed — the silhouette takes shape.",
        images: ["/images/framing.jpg"],
      },
      {
        id: "roofing",
        label: "Roofing",
        date: "APR 16",
        status: "done",
        description: "Roof sealed. Weather protection in place.",
        images: ["/images/roof.jpg"],
      },
      {
        id: "interior",
        label: "Interior",
        date: "TODAY",
        status: "current",
        description: "Interior finishing underway — drywall, trim, and systems.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        date: "SEP",
        status: "upcoming",
        description: "Cabinetry, counters, and appliance installation.",
        images: ["/images/kitchen.jpg"],
      },
      {
        id: "final",
        label: "Final Details",
        date: "OCT",
        status: "upcoming",
        description: "Paint, fixtures, landscaping, and punch list.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "completed",
        label: "Completed",
        date: "NOV",
        status: "upcoming",
        description: "Ready for its first chapter as a home.",
        images: ["/images/monroe.jpg"],
      },
    ],
  },
  {
    id: "002",
    code: "RESIDENCE 002",
    name: "THE HARRISON",
    location: "Lafayette, Indiana",
    image: "/images/harrison.jpg",
    video: "/videos/harrison.mp4",
    teaser: "La estructura ya se siente. El resto es historia en vivo.",
    beds: 4,
    baths: 3,
    sqft: 2480,
    garage: 2,
    progress: 31,
    expected: "February 2027",
    completionDate: "2027-02-28T18:00:00",
    status: "PRIVATE LIST OPEN",
    followers: 67,
    waitlistCount: 94,
    waitlistLimited: true,
    priceFrom: 428000,
    marketValue: 515000,
    priceHook: "Entrada temprana · antes del alza de obra",
    tagline: "Spacious modern family living in Lafayette.",
    latestUpdate: {
      title: "Second-floor framing rising",
      body: "Framing reached the second floor this week.",
      date: "AUG 06",
      image: "/images/framing.jpg",
    },
    stages: [
      {
        id: "land",
        label: "Land",
        date: "MAR 02",
        status: "done",
        description: "Lot acquired and prepared.",
        images: ["/images/land.jpg"],
      },
      {
        id: "foundation",
        label: "Foundation",
        date: "APR 12",
        status: "done",
        description: "Foundation complete.",
        images: ["/images/foundation.jpg"],
      },
      {
        id: "framing",
        label: "Framing",
        date: "TODAY",
        status: "current",
        description: "Wood framing in progress across both levels.",
        images: ["/images/framing.jpg"],
        hasVideo: true,
      },
      {
        id: "roofing",
        label: "Roofing",
        date: "SEP",
        status: "upcoming",
        description: "Roof structure and weatherproofing.",
        images: ["/images/roof.jpg"],
      },
      {
        id: "interior",
        label: "Interior",
        date: "NOV",
        status: "upcoming",
        description: "Interior systems and finishing.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        date: "DEC",
        status: "upcoming",
        description: "Kitchen build-out.",
        images: ["/images/kitchen.jpg"],
      },
      {
        id: "final",
        label: "Final Details",
        date: "JAN",
        status: "upcoming",
        description: "Final finishes and landscaping.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "completed",
        label: "Completed",
        date: "FEB",
        status: "upcoming",
        description: "Move-in ready.",
        images: ["/images/harrison.jpg"],
      },
    ],
  },
  {
    id: "003",
    code: "RESIDENCE 003",
    name: "THE ELLINGTON",
    location: "Kokomo, Indiana",
    image: "/images/ellington.jpg",
    video: "/videos/ellington.mp4",
    teaser: "Aún no empezó… y ya hay gente siguiéndola.",
    beds: 3,
    baths: 2,
    sqft: 1750,
    garage: 2,
    progress: 8,
    expected: "May 2027",
    completionDate: "2027-05-15T18:00:00",
    status: "COMING SOON",
    followers: 18,
    waitlistCount: 31,
    waitlistLimited: false,
    priceFrom: 274000,
    marketValue: 340000,
    priceHook: "El precio más bajo del tour · solo ahora",
    tagline: "Construction begins soon — follow early.",
    latestUpdate: {
      title: "Site survey completed",
      body: "Land marked and prepared for foundation work.",
      date: "AUG 04",
      image: "/images/land.jpg",
    },
    stages: [
      {
        id: "land",
        label: "Land",
        date: "JUN 01",
        status: "done",
        description: "Land secured for Residence 003.",
        images: ["/images/land.jpg"],
      },
      {
        id: "foundation",
        label: "Foundation",
        date: "SOON",
        status: "current",
        description: "Construction begins soon.",
        images: ["/images/foundation.jpg"],
      },
      {
        id: "framing",
        label: "Framing",
        date: "—",
        status: "upcoming",
        description: "Structural framing.",
        images: ["/images/framing.jpg"],
      },
      {
        id: "roofing",
        label: "Roofing",
        date: "—",
        status: "upcoming",
        description: "Roof installation.",
        images: ["/images/roof.jpg"],
      },
      {
        id: "interior",
        label: "Interior",
        date: "—",
        status: "upcoming",
        description: "Interior finishing.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        date: "—",
        status: "upcoming",
        description: "Kitchen installation.",
        images: ["/images/kitchen.jpg"],
      },
      {
        id: "final",
        label: "Final Details",
        date: "—",
        status: "upcoming",
        description: "Final details.",
        images: ["/images/interior.jpg"],
      },
      {
        id: "completed",
        label: "Completed",
        date: "MAY",
        status: "upcoming",
        description: "Home complete.",
        images: ["/images/ellington.jpg"],
      },
    ],
  },
];

export function getResidence(id: string) {
  return residences.find((r) => r.id === id);
}

/** Residences currently in transformation (real catalog count). */
export function getActiveResidences() {
  return residences.filter((r) => r.progress > 0 && r.progress < 100);
}

export function getActiveResidenceCount() {
  return getActiveResidences().length;
}

/** Scroll to collection and play a residence transformation video. */
export function playResidenceAvance(residenceId?: string) {
  if (typeof window === "undefined") return;
  const target = document.getElementById("casas");
  // Instant scroll — smooth + layout work felt laggy on mobile
  target?.scrollIntoView({ behavior: "auto", block: "start" });
  window.dispatchEvent(
    new CustomEvent("omar:play-avance", {
      detail: { id: residenceId ?? residences[0]?.id },
    }),
  );
}
