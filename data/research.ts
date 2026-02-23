export type ResearchArticle = {
  slug: string;
  title: string;
  category: "Macro" | "Equities" | "Credit" | "Commodities";
  researchType: string;
  publishedAt: string;
  readingTime: string;
  summary: string;
  pdfUrl?: string;
  dashboardUrl?: string;
  thumbnail?: string;
  takeaways: string[];
  content: {
    heading: string;
    body: Array<string | { figure: { src: string; caption: string } }>;
  }[];
};

export const researchArticles: ResearchArticle[] = [
  {
    slug: "symbotic-automation-at-scale",
    title: "Symbotic \u2014 The Automation Backbone of Commerce",
    category: "Equities",
    researchType: "EQUITY DEEP DIVE",
    publishedAt: "2026-02-17",
    pdfUrl: "/research/Symbotic/SOLO STRATEGISTfinal.pdf",
    dashboardUrl: "/research/symbotic/dashboard",
    thumbnail: "/research/Symbotic/thumbnail.png",
    readingTime: "15 min read",
    summary:
      "Symbotic Inc. (NASDAQ: SYM) is the AI-enabled robotics leader transforming warehouse logistics for the world\u2019s largest retailers. With Q1 FY2026 revenue of $630 million (+29% YoY), a $22.3 billion backlog anchored by a 12-year Walmart partnership, and first-time GAAP profitability, the business is exceptional \u2014 but at ~$55 per share and ~14x forward revenue, our normalised DCF suggests a base-case intrinsic value of approximately $20. This dual-horizon report also examines the Symbiotic Protocol ticker collision risk that creates both unwarranted volatility and potential mean-reversion entry opportunities.",
    takeaways: [
      "At ~$55, Symbotic trades at a significant premium to our base-case DCF intrinsic value of ~$20 per share \u2014 the market is pricing near-perfect execution on the $22.3B backlog.",
      "The 12-year Walmart Master Automation Agreement covering up to 400 committed MFCs provides exceptional revenue visibility, but customer concentration remains a key risk.",
      "The SYM ticker collision with the Symbiotic Protocol (symbiotic.fi) creates algorithmic confusion and volatility \u2014 disciplined allocators should treat crypto-driven spikes as potential entry catalysts."
    ],
    content: [
      {
        heading: "The Investment Thesis: The \u201CSYM\u201D Duality",
        body: [
          "This report applies our Framework for Value-Centric Strategic Allocation to Symbotic Inc. (NASDAQ: SYM), the AI-enabled robotics leader transforming warehouse logistics for the world\u2019s largest retailers. Simultaneously, it examines the Symbiotic Protocol (symbiotic.fi), a Paradigm-backed universal staking layer on Ethereum, and the unusual \u201CTicker Collision\u201D risk that binds the two otherwise unrelated entities.",
          "Symbotic delivered Q1 FY2026 revenue of $630 million, up 29% year-on-year, swinging to net income of $13 million from a net loss of $17 million in the prior-year quarter. Adjusted EBITDA surged to $67 million from $18 million, achieving double-digit EBITDA margin for the first time. The company sits atop a $22.3 billion backlog, approximately ten times its annual revenue, anchored by a 12-year strategic partnership with Walmart encompassing up to 400 committed micro-fulfilment centres.",
          "The Symbiotic Protocol is an Ethereum-native universal staking protocol backed by Paradigm and cyber\u00B7Fund. It reached over $1 billion in TVL faster than any other protocol from initial launch, peaking near $1.5 billion. Despite the one-letter naming difference, algorithmic systems frequently conflate the two \u2014 creating both risk and opportunity for the disciplined allocator."
        ]
      },
      {
        heading: "Symbotic Inc. \u2014 Equity Analysis",
        body: [
          "Symbotic\u2019s relationship with Walmart is the single most important variable in any valuation. The partnership was materially expanded in January 2025 when Symbotic acquired Walmart\u2019s Advanced Systems and Robotics business for $200 million in cash, with up to $350 million in contingent consideration. Concurrently, Walmart invested $520 million and signed a Master Automation Agreement covering up to 400 committed and 200 optional micro-fulfilment centres.",
          "Target, Albertsons, C&S Wholesale, and Medline are among the names signed to multi-year agreements. The GreenBox joint venture with SoftBank has committed to expend at least $7.5 billion over six years. The Fox Robotics acquisition brought 25 new potential customers and dock automation capabilities.",
          "Q1 FY2026 highlights: Total revenue $630M (+29% YoY), gross margin 21.2% (+460bps YoY), adjusted gross margin 23.4% (+570bps), net income $13.4M (vs. -$16.9M prior year), adjusted EBITDA $67M (+274% YoY), and cash of $1.8B (+101% YoY)."
        ]
      },
      {
        heading: "Discounted Cash Flow Analysis",
        body: [
          "Our DCF uses normalised FCFF (~$175M) as the FY2025A baseline, stripping out ~$640M in one-time working capital inflows that inflated reported FCF to ~$788M. Using a 10.5% WACC and 3.0% terminal growth rate, we derive a base-case intrinsic value of approximately $20 per share.",
          "Even at the most bullish parameters (9.5% WACC / 4.0% TGR), intrinsic value reaches only $35 \u2014 a 37% discount to market. The base case ($20) implies ~64% overvaluation relative to normalised DCF. The market is pricing option value on MFC rollout, international scaling, and GreenBox traction.",
          "Symbotic\u2019s 1.4x EV/Backlog is the most compelling metric: the market pays $1.40 for every dollar of contracted future work. If 50% of the backlog converts at 20%+ gross margins, significant value creation is locked in. Bull case: $30\u2013$35/share (400 MFCs by FY2030). Bear case: $12\u2013$16/share (150 MFCs with delays)."
        ]
      },
      {
        heading: "Symbiotic Protocol \u2014 Ticker Collision & Market Reflexivity",
        body: [
          "Symbiotic (symbiotic.fi) raised $5.8M in seed funding (Paradigm, cyber\u00B7Fund, June 2024) and $29M in a Series A (Pantera Capital, Coinbase Ventures, April 2025). Key metrics: ~50 integrated networks, 78 operators, 55 vaults, TVL peak ~$1.5B. The protocol\u2019s asset-agnostic collateral support (any ERC-20, not just ETH) is its key differentiator vs. EigenLayer.",
          "When Symbiotic protocol news generates crypto media buzz, attention flows into the NASDAQ equity through NLP scrapers that cannot distinguish protocol from equity news, retail investors searching \u201CSymbiotic stock\u201D being directed to SYM, and momentum traders piling into volume spikes regardless of cause.",
          "Key 2026 collision catalysts: Symbiotic Token Generation Event (Q2, CRITICAL), Symbiotic Airdrop Distribution (Q3, CRITICAL), alongside equity catalysts including Q2 FY2026 earnings and Walmart MFC prototype installation."
        ]
      },
      {
        heading: "Risk Assessment",
        body: [
          "Revenue is growing at 29% on an accelerating trajectory. Gross margins are expanding. The company has achieved GAAP profitability for the first time. However, at ~14x forward revenue and a base-case DCF of ~$20, the market requires sustained near-perfect execution.",
          "Walmart represents the overwhelming majority of revenue. The 12-year MAA provides contractual protection, but any strategic shift by Walmart could materially impair the thesis. Material weaknesses remain under remediation, and the FY2024 restatement ($30\u201340M revenue reduction) is a concrete reminder of residual risk.",
          "Verdict: Exceptional business, priced beyond current fundamentals. Watchlist, not pitch. The optimal strategy is patient accumulation on weakness \u2014 accumulate on meaningful pullbacks towards $25\u2013$35. Treat any Ticker Collision-driven volatility as a potential entry catalyst rather than a fundamental signal."
        ]
      }
    ]
  },
  {
    slug: "amazon-infrastructure-harvesting-cycle",
    title: "Amazon - The Infrastructure Harvesting Cycle",
    category: "Equities",
    researchType: "EQUITY DEEP DIVE",
    publishedAt: "2026-02-16",
    pdfUrl: "/research/amazon/Amazon16:02:2026.pdf",
    thumbnail: "/research/amazon/figure-1-valuation.png",
    readingTime: "14 min read",
    summary:
      "Amazon presents a compelling case of Time Arbitrage as of February 2026 - short-term capital expenditure masking long-term terminal value. At current trading levels our DCF models imply a margin of safety exceeding 35%, while the company constructs irreplaceable infrastructure across cloud compute, custom silicon, power generation, and satellite networks.",
    takeaways: [
      "At ~$198–$210, Amazon trades at a 35%+ margin of safety to our intrinsic value estimate of $345–$377 per share.",
      "AWS's $244 billion order backlog and 3.8 GW of secured power capacity establish structural moats that pure-software competitors cannot replicate.",
      "The FCF inflection point is expected in late 2026 as CapEx peaks - historically the trigger for a significant multiple re-rating."
    ],
    content: [
      {
        heading: "Quantitative Analysis: Mean Reversion & Valuation",
        body: [
          { figure: { src: "/research/amazon/figure-1-valuation.png", caption: "Figure 1: AMZN Market Price vs. Intrinsic Value Estimate, 2023–2026E" } },
          "Recent market volatility in early 2026, driven by concerns over a $200 billion projected CapEx budget, has decoupled Amazon's price from its intrinsic value. This disconnect creates a rare opportunity for disciplined allocators.",
          "While the market has reacted punitively to depressed near-term free cash flow, our DCF models suggest an intrinsic value of approximately $345–$377 per share. At current trading levels of $198–$210, the equity offers a margin of safety exceeding 35% - a threshold that signals exceptional entry points for value-oriented investors.",
          { figure: { src: "/research/amazon/figure-2-ai-stack.png", caption: "Figure 2: Earnings Compression - Trailing P/E vs. 5-Year Average" } },
          "The trailing P/E has compressed to approximately 27.7x, significantly below its five-year average of 55x. This multiple compression represents a classic value opportunity where the market is fundamentally mispricing the durability of Amazon's high-margin segments. The market's myopic focus on short-term cash flows ignores the structural advantages being built today."
        ]
      },
      {
        heading: "Secular Thematics: The Physical Layer of AI",
        body: [
          "Amazon sits at the centre of the AI Infrastructure Supercycle. While competitors focus on software and models, Amazon is building the foundational physical infrastructure that all AI depends upon.",
          { figure: { src: "/research/amazon/figure-3-capex-cycle.png", caption: "Figure 3: AWS Revenue & Order Backlog Growth, 2022–2026E" } },
          "AWS is transitioning from a cloud provider to a compute landlord - the digital equivalent of owning Manhattan real estate. With a backlog exceeding $244 billion, up 40% year-on-year, the demand for AI training and inference is structural, not cyclical. This backlog represents committed future revenue that provides unprecedented visibility into cash flows.",
          "In a strategic masterstroke, Amazon has secured over 3.8 GW of power capacity. In 2026, the primary bottleneck for AI is not chips, but electrons. Amazon's physical moat in power procurement creates a barrier to entry that pure-software competitors cannot replicate.",
          "The explosive growth in Amazon Advertising - now a $20 billion quarterly business - provides the high-margin cash flow necessary to fund the capital-intensive build-out of the AI layer without diluting shareholders. This creates a virtuous cycle: advertising funds infrastructure, infrastructure enables more services, services drive more advertising."
        ]
      },
      {
        heading: "The Strategic Thesis: Harvesting vs. Planting",
        body: [
          "The market is currently in a scepticism phase regarding Amazon's return on AI investments. This is precisely where our principle of time arbitrage provides the strategic edge: we are buying today what the market will chase tomorrow.",
          "Heavy investments in Trainium custom silicon and satellite constellations represent front-loaded costs that depress today's multiples but establish tomorrow's competitive moats. Amazon is reinvesting nearly 90% of its operating cash flow into AI infrastructure, far exceeding the 40–60% reinvestment rates of peers such as Microsoft. This ensures that by the time the harvesting phase begins, Amazon will be the lowest-cost provider in the market.",
          "Historically, Amazon's stock re-rates significantly once CapEx as a percentage of revenue peaks and free cash flow begins to inflect. We have observed this pattern before: in AWS's early years, in fulfilment network expansion, in Prime Video content. Each time, sceptics questioned the spending; each time, Amazon emerged with an unassailable position. We anticipate this inflection point in late 2026.",
          { figure: { src: "/research/amazon/figure-4-smr.png", caption: "Figure 4: Amazon's Position in the AI Infrastructure Stack" } }
        ]
      },
      {
        heading: "Niche Alpha: The Triple Moat",
        body: [
          "Amazon is constructing three interconnected competitive moats that create a nearly impregnable position in AI infrastructure.",
          "First, the energy pivot. Amazon is effectively becoming a nuclear utility partner to circumvent grid limitations. The company is funding 12 Small Modular Reactors with Energy Northwest - Xe-100 reactors developed by X-energy that will provide a scalable 960 MW facility. In a grid-constrained world, data centre value is capped by power availability.",
          { figure: { src: "/research/amazon/figure-5-kuiper.png", caption: "Figure 5: Amazon's SMR Strategy - 12 Xe-100 Modular Reactors, 960 MW" } },
          "The strategic insight: when energy becomes the binding constraint on AI compute, Amazon will have already solved the problem. Amazon is building proprietary power plants to remove this ceiling entirely.",
          "Second, custom silicon. The Trainium3 UltraServer, launched at re:Invent 2025, delivers four times the performance and 40% better energy efficiency than its predecessor. By utilising a three-nanometre process, Amazon reduces its total cost of ownership and can offer AI inference at 50% lower cost than comparable GPU clusters. This pricing power creates a formidable competitive advantage that compounds as scale increases.",
          "Third, Project Kuiper. The Amazon Leo satellite network brings AWS compute to every corner of the planet, including locations competitors cannot reach.",
          { figure: { src: "/research/amazon/figure-6.png", caption: "Figure 6: Project Kuiper LEO Constellation - Global Edge Compute" } },
          "Amazon is currently racing to meet FCC deadlines to launch its constellation. The integration with AWS allows enterprises to run cloud workloads in remote locations without touching the public internet. Maritime operations, remote mining, agriculture, emergency response - entire industries currently underserved by cloud infrastructure become accessible. Amazon is not merely expanding its market; it is creating new ones."
        ]
      },
      {
        heading: "Risk Assessment: Value Trap or Justified Conviction?",
        body: [
          "Every investment thesis must be stress-tested against two critical failure modes: the value trap and the hype-driven bubble.",
          "On the value trap question: the fundamentals remain robust. Revenue continues to grow at double digits - 14% year-on-year - far exceeding mature company norms. Operating margins are expanding as the revenue mix shifts towards AWS and Advertising, both high-margin segments. Market share in cloud computing continues to grow, not contract. This is not a declining business masquerading as value; it is a growth business temporarily priced as mature.",
          "On the hype question: Amazon's play is fundamentally different from pure-play AI software companies. Amazon is focused on physical infrastructure and power consumption - tangible assets with measurable utility and pricing power. These are not speculative bets on future applications; they are essential services that every AI company must purchase. The litmus test: if AI hype deflates tomorrow, does Amazon's infrastructure retain value? Unequivocally, yes. Cloud computing, e-commerce, advertising, and logistics remain trillion-dollar secular growth markets regardless of AI outcomes."
        ]
      },
      {
        heading: "Verdict: High-Conviction Structural Value",
        body: [
          "Amazon represents a high-conviction structural value play. The market's fixation on the 2026 $200 billion cash outlay has created a rare window to acquire a dominant global utility at a material discount to intrinsic value.",
          "Our 12-month price target is $285.00, with an intrinsic value estimate of $345–$377 per share. Any entry point under $200.00 is considered an exceptional opportunity for the disciplined, long-term allocator. The market's temporary pessimism has created a permanent opportunity.",
          { figure: { src: "/research/amazon/figure-7.png", caption: "Figure 7: Amazon Price Targets & Valuation Summary" } }
        ]
      }
    ]
  },
  {
    slug: "alphabet-compounding-intelligence-engine",
    title: "Alphabet \u2014 The Compounding Intelligence Engine",
    category: "Equities",
    researchType: "EQUITY DEEP DIVE",
    publishedAt: "2026-02-16",
    pdfUrl: "/research/alphabet/Alphabet16:02:2026.pdf",
    thumbnail: "/research/alphabet/thumbnail.png",
    readingTime: "16 min read",
    summary:
      "Alphabet presents a compelling case for long-term allocators as of February 2026 \u2014 near-term CapEx concerns masking a dominant position across search, cloud, AI, and autonomous mobility. At ~$306 per share, our DCF models imply an intrinsic value of $390 with a 22% margin of safety.",
    takeaways: [
      "At ~$306, Alphabet trades at a 22% margin of safety to our intrinsic value estimate of $390 per share.",
      "Google Cloud\u2019s $240 billion backlog and 48% revenue growth position it as the fastest-growing hyperscaler, with AI-engaged customers consuming 1.8x as many products.",
      "Waymo\u2019s $126 billion standalone valuation represents material hidden value within the loss-making Other Bets segment."
    ],
    content: [
      {
        heading: "The Investment Thesis: Temporary Noise, Permanent Value",
        body: [
          "Alphabet\u2019s Q4 2025 earnings triggered a paradoxical sell-off \u2014 the company delivered record revenue, record operating income, and record free cash flow, yet the stock declined over 7% in after-hours trading. The catalyst was a CapEx figure of $75 billion guided for 2026, exceeding consensus expectations by approximately $10 billion. This reaction is a textbook example of short-term noise obscuring long-term value creation.",
          "The market\u2019s concerns centre on two narratives: antitrust risk and AI cannibalisation of search. On antitrust, the DOJ\u2019s proposed remedies have narrowed considerably \u2014 Chrome and Android divestitures are no longer on the table, and the remaining remedies focus on default search agreements that represent less than 15% of Google\u2019s total search traffic. The structural dominance of Google Search remains fundamentally intact.",
          "On AI cannibalisation, the data tells the opposite story. AI Overviews, now serving over one billion users monthly, are actually increasing search engagement and ad monetisation. Users exposed to AI-enhanced results conduct 10% more follow-up searches, and commercial query click-through rates have improved by 8% year-on-year. Far from destroying the search business, AI is compounding it \u2014 the intelligence engine is feeding itself."
        ]
      },
      {
        heading: "Quantitative Analysis: Record-Breaking Fundamentals",
        body: [
          "The Q4 2025 results were exceptional by any measure. Consolidated revenue reached $113.8 billion, an 18% year-on-year increase that accelerated from 15% in Q3. Net income surged to $34.5 billion, a 30% increase, driven by operating leverage across every major segment. Google Services delivered a 41.9% operating margin, up 320 basis points year-on-year, demonstrating that the core advertising business continues to scale profitably even as AI investments accelerate.",
          "Perhaps the most underappreciated data point is the 78% reduction in Gemini serving costs over the past twelve months. This cost deflation curve mirrors the pattern we observed in AWS\u2019s early years \u2014 each generation of infrastructure delivers exponentially more capability per dollar. As Gemini becomes cheaper to serve, its integration into Search, YouTube, and Cloud becomes margin-accretive rather than dilutive.",
          "Free cash flow for the quarter was $24.8 billion, bringing the trailing twelve-month figure to $72.8 billion. The balance sheet carries $95.7 billion in cash and short-term investments against $28.5 billion in long-term debt \u2014 a net cash position of $67.2 billion. This financial fortress provides Alphabet with unmatched optionality to invest through cycles without diluting shareholders or compromising returns."
        ]
      },
      {
        heading: "Google Cloud: The AI Infrastructure Landlord",
        body: [
          "Google Cloud has emerged as the fastest-growing hyperscaler, with Q4 revenue of $17.7 billion representing 48% year-on-year growth \u2014 a material acceleration from 35% in Q3. The backlog has swelled to $240 billion, providing extraordinary revenue visibility for a business that was barely profitable two years ago.",
          "The quality of new business is equally striking. Deals exceeding $1 billion in total contract value surpassed the combined total of the previous three years. The NATO sovereign cloud contract, Google Cloud\u2019s largest government deal to date, signals that the platform has crossed the trust threshold for the most security-sensitive workloads on earth.",
          "A critical insight from management: AI-engaged Cloud customers consume 1.8x as many Google Cloud products as non-AI customers. This cross-sell dynamic creates a powerful flywheel \u2014 customers who adopt Vertex AI for model training inevitably expand into BigQuery for data analytics, Cloud Run for inference serving, and Gemini for code generation. Each additional product deepens switching costs and extends contract duration, transforming transactional revenue into annuity-like cash flows.",
          "Google Cloud is no longer a challenger \u2014 it is becoming the AI infrastructure landlord of choice for enterprises that demand cutting-edge capabilities without the operational complexity of self-hosting. The segment\u2019s operating margin expanded to 17.5%, up from 9.4% a year ago, confirming that scale economics are compounding rapidly."
        ]
      },
      {
        heading: "DCF Intrinsic Value Derivation",
        body: [
          "Our discounted cash flow model employs a weighted average cost of capital of 8.5%, reflecting Alphabet\u2019s low leverage, robust cash generation, and the structural durability of its revenue streams. We model a Phase 1 revenue CAGR of 14% over the next five years, supported by AI-driven search monetisation, Cloud backlog conversion, and YouTube\u2019s continued share gains in connected television.",
          "Under our base case assumptions, we derive an intrinsic value of $390 per share, implying a 22% margin of safety at the current trading price of approximately $306. Our 12-month price target is $370 in the base case and $430 in the bull case, the latter reflecting accelerated Cloud growth and earlier-than-expected Waymo monetisation.",
          "Waymo deserves particular attention as a source of hidden value. The autonomous mobility platform is now completing over 250,000 paid rides per week across six metropolitan areas. Using comparable transaction multiples from the robotaxi sector, we estimate Waymo\u2019s standalone valuation at approximately $126 billion \u2014 yet this value is buried within the loss-making Other Bets segment, which the market consistently values at zero or negative.",
          "The risk-reward profile is asymmetric and favourable. Downside scenarios anchored in antitrust remedies and AI commoditisation still support a floor valuation above $270, while upside scenarios incorporating Cloud market share gains and Waymo monetisation yield valuations approaching $450. For the disciplined, long-term allocator, Alphabet at $306 represents a compelling entry into a compounding intelligence engine trading at a discount to its constituent parts."
        ]
      }
    ]
  },
  {
    slug: "gold-6100-price-target",
    title: "Gold \u2014 The $6,100 Thesis",
    category: "Commodities",
    researchType: "COMMODITIES DEEP DIVE",
    publishedAt: "2026-02-19",
    pdfUrl: "/research/GOLD/Gold_6100_Solo_Strategist.pdf",
    thumbnail: "/research/GOLD/thumbnail.png",
    readingTime: "12 min read",
    summary:
      "Gold is in the early innings of a structural re-rating cycle driven by sovereign debt monetisation, accelerating central bank accumulation, and the breakdown of the traditional dollar-gold inverse correlation. At $4,704 per troy ounce, our macro-anchored model targets $6,100 \u2014 a 30% upside predicated on de-dollarisation momentum, a plateau in real yields, and the systemic fragility of leveraged Western financial architecture.",
    takeaways: [
      "Our base-case target of $6,100/oz is underpinned by central bank demand running at record annualised rates, with EM sovereigns structurally diversifying reserves away from USD-denominated assets.",
      "The dollar-gold inverse correlation has broken down \u2014 gold now trades as a sovereign credit instrument rather than a pure dollar hedge, expanding its addressable investor base materially.",
      "A plateau in real yields combined with fiscal dominance dynamics in the US and EU removes the primary headwind that capped gold below $3,000 in the prior cycle."
    ],
    content: [
      {
        heading: "Structural Re-Rating: Why This Cycle Is Different",
        body: [
          "Gold\u2019s ascent to $4,704 per troy ounce represents more than a cyclical commodity rally \u2014 it signals a structural repricing of the global monetary order. For the first time since Bretton Woods, sovereign institutions are actively rotating out of US Treasury reserves and into physical gold at a pace that exceeds the market\u2019s ability to discount the shift.",
          "Central bank net purchases have sustained above 1,000 tonnes per annum for three consecutive years, a threshold last breached in the 1960s. The composition of buyers has shifted materially: the People\u2019s Bank of China, the Reserve Bank of India, and a coalition of Gulf sovereign wealth funds now collectively represent the dominant marginal buyer, supplanting the ETF-driven retail demand that characterised the 2019\u20132022 cycle.",
          "The breakdown of the traditional dollar-gold inverse correlation is the most important structural development. Gold now trades as a sovereign credit instrument \u2014 a hedge against the collective solvency of the G10 fiscal apparatus rather than merely a USD alternative. This paradigm shift expands gold\u2019s addressable investor base to include fixed income allocators, sovereign wealth funds, and pension funds that were previously structurally barred from meaningful commodity exposure."
        ]
      },
      {
        heading: "Macro Regime: Fiscal Dominance and Real Yield Plateaus",
        body: [
          "The primary headwind that capped gold below $3,000 in the prior cycle was the regime of rising real yields, driven by an aggressive Federal Reserve tightening cycle. That headwind has structurally abated. With US federal debt exceeding 125% of GDP and annual interest expense consuming over 15% of federal revenues, the political economy of monetary policy has shifted decisively toward fiscal accommodation.",
          "Fiscal dominance \u2014 the condition where central banks are implicitly constrained from tightening sufficiently to stabilise inflation for fear of triggering a sovereign debt crisis \u2014 is no longer a theoretical risk but an observable phenomenon. The Fed\u2019s reluctance to raise rates above 4.5% despite core PCE running persistently above target is the empirical fingerprint of this constraint.",
          "In a fiscal dominance regime, real yields plateau or decline, the opportunity cost of holding gold falls, and the monetary debasement premium embedded in gold\u2019s price expands. Our model assigns a 70% probability to this regime persisting through 2027, consistent with our $6,100 base case."
        ]
      },
      {
        heading: "De-Dollarisation: The Reserve Architecture Is Shifting",
        body: [
          "The de-dollarisation trend is frequently overstated in its immediacy but systematically underestimated in its directionality. The dollar retains network effects that ensure its dominance in trade invoicing and FX reserves for the foreseeable future. However, the marginal allocation at the sovereign level has unambiguously shifted.",
          "BRICS+ economies have collectively reduced dollar-denominated reserve holdings from 71% of total reserves in 2016 to approximately 58% today. The reallocation has flowed primarily into gold and, to a lesser extent, bilateral currency swap arrangements. This is not a dollar collapse \u2014 it is a structural compression in the dollar\u2019s reserve share that acts as a persistent, non-cyclical bid for gold.",
          "The geopolitical catalyst that crystallised this trend was the 2022 freezing of Russian sovereign reserves. Every non-aligned sovereign treasury drew the lesson that dollar-denominated assets are subject to confiscation risk in the context of geopolitical adversity. Gold, as a physical bearer asset with no counterparty, is immune to this risk. The marginal sovereign allocator has internalised this lesson permanently."
        ]
      },
      {
        heading: "Valuation Framework: Path to $6,100",
        body: [
          "Our $6,100 price target is derived from a three-factor macro model incorporating real yield trajectory, central bank demand velocity, and monetary debasement premium expansion. Under our base case, we assume US 10-year TIPS yields stabilise at 1.0\u20131.2%, central bank net purchases sustain at 900\u20131,100 tonnes per annum, and the M2/gold ratio mean-reverts toward the 1990\u20132005 average.",
          "The bull case of $7,200 requires a more aggressive de-dollarisation scenario \u2014 specifically, a sustained dollar index decline below 90 combined with a formal announcement of gold-backed bilateral trade settlement between two G20 economies. This scenario is low probability (20%) but would trigger a step-change repricing that our linear model would underestimate.",
          "The bear case of $3,800 requires a return to a genuinely restrictive monetary policy regime \u2014 real yields above 2.5% sustained for 12+ months \u2014 which we assign a 15% probability given the fiscal dominance constraints outlined above. Entry at $4,704 provides a 19% downside to the bear case floor, asymmetrically positioned against a 30% base case and 53% bull case upside."
        ]
      },
      {
        heading: "Risk Assessment and Conviction Level",
        body: [
          "The primary risk to our thesis is a geopolitical de-escalation scenario that reduces safe-haven demand concurrently with a fiscal consolidation drive that meaningfully reduces deficit financing. This combination \u2014 lower geopolitical risk premium plus higher real yields \u2014 would compress gold\u2019s valuation toward $3,500\u20133,800. We view this as a 15\u201320% probability outcome over a 12-month horizon.",
          "Secondary risks include a forced liquidation event driven by a leveraged long unwind in the futures market, and a crypto narrative resurgence that diverts incremental safe-haven flows to Bitcoin and digital assets. Both risks are real but episodic \u2014 they would create entry opportunities rather than invalidate the structural thesis.",
          "Verdict: High-conviction long. Entry at $4,704/oz with a 12-month base case target of $6,100 and a 24-month structural target of $6,500+. Position sizing should reflect gold\u2019s role as a portfolio anchor \u2014 a strategic allocation rather than a tactical trade. We view any pullback toward $4,200\u20134,400 as an accumulation opportunity."
        ]
      }
    ]
  },
  {
    slug: "energy-infrastructure-second-order-repricing",
    title: "Energy Infrastructure and the Second-Order Repricing Cycle",
    category: "Macro",
    researchType: "MACRO OUTLOOK",
    publishedAt: "2026-01-20",
    readingTime: "12 min read",
    summary:
      "The market remains fixated on near-term headline inflation while underpricing medium-duration cash flow uplift in energy-linked infrastructure.",
    takeaways: [
      "Pipeline and storage assets are repricing faster than broad cyclicals.",
      "Policy tailwinds are extending project visibility beyond consensus windows.",
      "The risk is not demand collapse; it is overpaying for late-cycle quality."
    ],
    content: [
      {
        heading: "Context",
        body: [
          "Capital markets are still discounting a short inventory shock rather than a multi-year capex normalization regime.",
          "That mismatch creates a valuation corridor where disciplined entries remain available in high-quality operators."
        ]
      },
      {
        heading: "Valuation Discipline",
        body: [
          "We prefer assets that convert inflation pass-through into free cash flow resilience rather than headline revenue growth.",
          "Our framework is explicit: avoid terminal value optimism and underwrite through replacement cost logic."
        ]
      }
    ]
  },
  {
    slug: "digital-payments-margin-duration",
    title: "Digital Payments and the Duration of Margin Expansion",
    category: "Equities",
    researchType: "SECTOR ANALYSIS",
    publishedAt: "2025-12-10",
    readingTime: "9 min read",
    summary:
      "Payments leaders are transitioning from volume stories to operating leverage stories, but the dispersion is widening.",
    takeaways: [
      "Cross-border mix is the largest hidden duration driver.",
      "Regulatory concentration risk requires explicit haircuts.",
      "Quality compounds when cost discipline and pricing power coexist."
    ],
    content: [
      {
        heading: "What the Market Is Missing",
        body: [
          "Consensus models still assume symmetric competition pressure across providers.",
          "In practice, network depth and treasury integration produce nonlinear winner effects."
        ]
      },
      {
        heading: "Positioning",
        body: [
          "Entries should favour businesses with defensible free cash flow conversion and conservative balance sheet optionality.",
          "We size positions to survive policy uncertainty without requiring multiple expansion."
        ]
      }
    ]
  },
  {
    slug: "credit-spreads-and-latent-liquidity",
    title: "Credit Spreads, Latent Liquidity, and Quiet Default Risk",
    category: "Credit",
    researchType: "CREDIT MONITOR",
    publishedAt: "2025-11-06",
    readingTime: "11 min read",
    summary:
      "Spread compression has exceeded what underlying coverage ratios justify, creating selective asymmetry in senior tranches.",
    takeaways: [
      "Liquidity premia are being mistaken for solvency improvements.",
      "Maturity walls remain manageable for issuers with covenant flexibility.",
      "Patience in entry points is a competitive edge in credit."
    ],
    content: [
      {
        heading: "Diagnostics",
        body: [
          "Issuer quality is diverging faster than index-level spread data suggests.",
          "Portfolio construction should treat refinancing windows as endogenous, not fixed."
        ]
      },
      {
        heading: "Risk Protocol",
        body: [
          "We focus on downside-implied recovery value and avoid structures requiring benign capital market assumptions.",
          "In this regime, underwriting discipline matters more than velocity."
        ]
      }
    ]
  }
];

export const researchCategories = [
  "All",
  "Macro",
  "Equities",
  "Credit",
  "Commodities"
] as const;
