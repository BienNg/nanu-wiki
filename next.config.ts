import type { NextConfig } from "next";

/** Pages used to live in the database under /seite/<uuid>; old links (Slack, bookmarks) keep working. */
const LEGACY_PAGE_IDS: Record<string, string> = {
  "6e72e4b3-d8b8-45c8-b674-33b3ec75f6c0": "/bereich/fuer-alle/geschichte-und-werte",
  "27b2d7d6-1168-44f4-a6f4-d0adb8c747b6": "/bereich/fuer-alle/kurse-und-leistungen",
  "fdc92647-5982-4907-b8b3-0c8abedafa26": "/bereich/fuer-alle/preise-und-positionierung",
  "7dd4854b-78fc-40cd-977c-9e7243f6d3c2": "/bereich/fuer-alle/standorte-und-team",
  "c22ccec1-d645-4723-b358-3cacc375de07": "/bereich/fuer-alle/tools",
  "11eb5757-fa03-44f5-a1a4-6acf26aca01a": "/bereich/fuer-alle/allgemeine-regeln",
  "00000000-0000-0000-0000-0000000b0002": "/bereich/sales/probestunde-buchen",
  "00000000-0000-0000-0000-0000000b0001": "/bereich/sales/erstkontakt-messenger",
  "00000000-0000-0000-0000-0000000b0004": "/bereich/sales/kampagne-probestunde",
  "00000000-0000-0000-0000-0000000b0005": "/bereich/sales/interview",
  "00000000-0000-0000-0000-0000000e0001": "/bereich/student-support/onboarding-und-kundenbindung",
  "00000000-0000-0000-0000-0000000b0006": "/bereich/sales/verkaufstrichter",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      ...Object.entries(LEGACY_PAGE_IDS).map(([id, destination]) => ({ source: `/seite/${id}`, destination, permanent: true })),
      { source: "/seite/:id", destination: "/suche", permanent: false },
    ];
  },
};

export default nextConfig;
