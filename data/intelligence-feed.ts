export type IntelligenceItem = {
  id: string;
  time: string;
  source: string;
  title: string;
  category: "central-banks" | "global-trade" | "geopolitics" | "markets";
  publishedAt: string;
};

export const intelligenceFeed: IntelligenceItem[] = [
  {
    id: "1",
    time: "16:42",
    source: "Federal Reserve",
    title: "FOMC minutes signal patience on rate path amid persistent services inflation",
    category: "central-banks",
    publishedAt: "2026-02-17",
  },
  {
    id: "2",
    time: "15:18",
    source: "Reuters",
    title: "EU finalises critical minerals partnership with Australia, targets rare earth supply diversification",
    category: "global-trade",
    publishedAt: "2026-02-17",
  },
  {
    id: "3",
    time: "14:05",
    source: "Bloomberg",
    title: "PBoC holds MLF rate steady at 2.50%, injects CNY 500bn in medium-term liquidity",
    category: "central-banks",
    publishedAt: "2026-02-17",
  },
  {
    id: "4",
    time: "12:33",
    source: "FT",
    title: "Taiwan Strait transit tensions escalate as Philippines requests expanded US naval patrols",
    category: "geopolitics",
    publishedAt: "2026-02-17",
  },
  {
    id: "5",
    time: "11:17",
    source: "ECB",
    title: "Lagarde flags structural wage growth as key variable in next policy assessment",
    category: "central-banks",
    publishedAt: "2026-02-17",
  },
  {
    id: "6",
    time: "09:44",
    source: "WSJ",
    title: "US-China semiconductor export controls tightened; new restrictions on EUV lithography tooling",
    category: "global-trade",
    publishedAt: "2026-02-17",
  },
  {
    id: "7",
    time: "08:22",
    source: "Bank of Japan",
    title: "BoJ Ueda signals further normalisation path contingent on spring wage negotiations",
    category: "central-banks",
    publishedAt: "2026-02-17",
  },
  {
    id: "8",
    time: "07:15",
    source: "Reuters",
    title: "OPEC+ compliance review shows Saudi voluntary cuts extended through Q2 2026",
    category: "markets",
    publishedAt: "2026-02-17",
  },
];
