export type PostMortem = {
  auditId: string;
  title: string;
  ticker: string;
  datePublished: string;
  dateExited: string;
  entryPrice: number;
  exitPrice: number;
  benchmarkReturn: number;
  totalLossVsBenchmark: string;
  originalThesis: {
    summary: string;
    details: string[];
  };
  divergence: {
    summary: string;
    details: string[];
  };
  lesson: {
    label: string;
    summary: string;
    details: string[];
  };
};

export const postMortems: PostMortem[] = [
  {
    auditId: "PM-2025-001",
    title: "Industrial Copper Demand Overshoot",
    ticker: "COPPER",
    datePublished: "2024-11-30",
    dateExited: "2025-08-14",
    entryPrice: 31.7,
    exitPrice: 26.8,
    benchmarkReturn: 18.2,
    totalLossVsBenchmark: "-33.7%",
    originalThesis: {
      summary:
        "Anticipated a supply-side deficit driven by rapid EV grid transition outstripping mine capacity.",
      details: [
        "Our model projected global refined copper demand to exceed supply by approximately 400,000 tonnes in 2025, driven primarily by accelerating EV production rates and grid modernisation capital expenditure across North America and Europe.",
        "We identified a structural bottleneck: permitting timelines for new copper mines had extended to 12\u201318 years on average, creating what we termed an \u201Cirreversible supply gap\u201D that would take a decade to close.",
        "The thesis was anchored in electrification intensity metrics \u2014 each EV requires roughly 83kg of copper versus 23kg for an ICE vehicle. At projected EV adoption curves, this implied a step-change in demand that existing mine capacity could not meet.",
      ],
    },
    divergence: {
      summary:
        "Underestimated the impact of China\u2019s property sector deleveraging on base metal demand and the speed of secondary scrap recovery integration.",
      details: [
        "China\u2019s property sector, which accounts for approximately 25\u201330% of global copper consumption, entered a deeper-than-anticipated deleveraging cycle. New housing starts fell 35% year-on-year through mid-2025, crushing construction-related copper demand at a pace our models did not capture.",
        "Secondary scrap recovery technology advanced faster than consensus expected. New hydrometallurgical processing plants in China and Southeast Asia increased recycled copper supply by an estimated 8\u201312% in 2025, partially closing the supply gap we had identified as structural.",
        "The strong US dollar, driven by a hawkish Fed pivot in Q1 2025, applied additional downward pressure on dollar-denominated commodity prices, compressing margins for non-US producers and triggering inventory liquidation.",
      ],
    },
    lesson: {
      label: "Systemic Adjustment",
      summary:
        "Modified our \u2018Demand Intensity\u2019 model to include a 20% haircut for geopolitical deleveraging cycles and increased the weighting of secondary supply metrics.",
      details: [
        "We have introduced a \u201Csovereign demand stress test\u201D to all commodity theses: any position where a single country accounts for more than 20% of global demand now receives an automatic 20% haircut to base-case demand projections.",
        "Secondary supply metrics (scrap recovery rates, recycling technology adoption curves) have been elevated from a footnote variable to a primary input in our supply-demand models.",
        "Position sizing for single-commodity directional trades has been capped at 3% of portfolio NAV, down from the 5% allocation used in this thesis. Concentration risk in cyclical assets must be explicitly bounded.",
      ],
    },
  },
];
