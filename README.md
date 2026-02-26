The Solo Strategist — Capability Roundup

What It Is
A full-stack institutional research platform built on Next.js 15 with edge runtime, deployed to Cloudflare Pages. It functions as a public-facing investment research firm — structured, transparent, and AI-augmented.

The Capability Stack (Layer by Layer)

1. Research Publishing Engine
Where: /research, /research/[slug], data/research.ts, components/article-layout.tsx
Every thesis is a structured document: sections, figures, takeaways, metadata (category, reading time, published date). Articles are not blog posts — they follow investment memo format. The system supports cover thumbnails, inline charts, and PDF attachments.
Value created: Professional credibility. The format signals that this is a serious, process-driven operation, not opinion. The rigour is visible.

2. Public Accountability System
Where: /predictions, /archive/post-mortems, data/track-record.ts, data/post-mortems.ts, data/predictions.ts
Every published call is timestamped and tracked with entry price, current price, benchmark return, and thesis status (Playing Out, Broken - Exited, Pending). Failed calls get a structured post-mortem: original thesis, what diverged, what changed in the process. Risk stats are published (Sharpe 1.82, Sortino 2.41, max drawdown -8.4%).
Value created: Trust that almost no retail or independent research operation offers. Most analysts disappear when they're wrong. The post-mortem system turns errors into intellectual capital and separates the platform from 99% of the internet.

3. Live Market Intelligence Layer
Where: GET /api/market, GET /api/market/candles, GET /api/yields, GET /api/news, components/market-ticker.tsx, components/yield-banner.tsx
* 8 instruments priced live from Finnhub (SPY, EWU, EWJ, GLD, IGLN.L, BNO, GOOGL, AMZN) with 60s TTL cache
* 7-day candle data per symbol
* US Treasury yields (2Y, 10Y, 30Y) from Treasury.gov — 30-minute cache
* Financial news aggregated from NewsData.io with Finnhub fallback — 5-minute cache
Value created: The site is alive. Visitors see real prices and yields, not static pages. This creates the sense of a live trading room, not an archive.

4. AI Research Companion
Where: POST /api/agent/research, components/agent-panel.tsx
A floating chat panel that is grounded exclusively in published research. The pipeline: user message → text-embedding-3-small (1024 dims) → Pinecone semantic search (top 5 chunks) → ticker extraction → live Finnhub price → claude-sonnet-4-6 stream with mandatory [N] inline citations.
Critical constraint: the model cannot fabricate. It can only cite what's in the corpus. If coverage is absent, it says so. The interface renders citation badges and source cards automatically.
Value created: Turns a static research archive into an interactive analyst. A visitor reading the Amazon memo can ask "what's the thesis on AWS margin expansion?" and get a sourced, paragraph-level answer within 3 seconds. No other independent research site does this.

5. Portfolio Auditor
Where: POST /api/agent/audit, /auditor, components/portfolio-input.tsx, components/audit-report.tsx
The most sophisticated feature. Pipeline:
1. User inputs holdings (free text, CSV, or chips)
2. Live Finnhub quotes fetched for all tickers in parallel
3. Portfolio weights computed (price × shares / total)
4. Query embedded and sent to Pinecone (top 8 research chunks)
5. Local cross-reference: post-mortems (ticker match → divergence warning), track record (Broken - Exited = explicit conflict flag, Playing Out = supporting conviction)
6. Entity resolver: flags high-collision tickers (SYM) for non-fundamental volatility risk
7. claude-sonnet-4-6 streams a 4-section structured report: Risk Summary, Conflict Alerts, Hidden Correlations, Actionable Pivots
Value created: This is the product's highest-leverage feature. It answers "does my portfolio conflict with what Solo Strategist believes?" in real time. It surfaces the kind of cross-holding systemic risks that most retail investors never see — sector concentration, macro factor overlaps, thesis conflicts. The entity resolver adds a layer of sophistication (ticker collision risk) that institutional desks pay for.

6. Vector Search Infrastructure
Where: lib/vector/pinecone.ts, lib/vector/chunker.ts, scripts/ingest-research.ts
Every research article is chunked into three chunk types — summary, takeaways, and per-section — and embedded into Pinecone at 1024 dimensions. The edge-compatible REST client (no Node.js dependencies) makes this available to both AI agents. New research can be ingested via npm run ingest.
Value created: The intelligence layer that powers both the Research Companion and Portfolio Auditor. Without it, the AI agents would have no grounding and would hallucinate. With it, every AI response traces back to a specific section of a specific published report.

7. Access Control & Gating
Where: middleware.ts, /gate, /api/gate, POST /api/gate
Edge middleware intercepts every request, checks for a valid conviction key cookie (SHA-256 hashed), and redirects to /gate if absent. Session lasts 30 days. The gate itself is a full-screen vault-aesthetic UI.
Value created: Revenue model enabler. The platform can gate premium content, the AI agents, or the full site behind a key. As the audience grows, this becomes the subscription layer without needing an external auth provider.

8. Email Infrastructure
Where: POST /api/subscribe, components/newsletter-signup.tsx, components/inquiry-form.tsx
Resend-powered. Newsletter signups get a confirmation email; the owner gets a notification. Institutional inquiry form routes to email with company and message context.
Value created: Audience capture. Every visitor who signs up becomes a subscriber. This is the growth flywheel — new research → email list → return traffic → citations → credibility.

9. Intelligence Feed
Where: GET /api/news, data/intelligence-feed.ts, /news, components/news-card.tsx
Macro signal aggregation with strategist-generated commentary. The generateSummary function in lib/news-summary.ts maps news categories (central banks, geopolitics, global trade, markets) to concise implications: rate path, duration allocation, tail-hedge recommendations, sector tilts.
Value created: Turns raw news into analyst framing. A rate decision isn't just "Fed holds" — it's "short-duration bias intact, watch for repricing." This positions the site as a filter, not a firehose.

10. Library & Intellectual Framework
Where: /library, app/library/page.tsx
Three shelves: Foundation (The Intelligent Investor, Antifragile — with Amazon links), Framework (whitepapers), and Pulse (Odd Lots, The Compound, Money Stuff, Grant's — with direct links). Not decoration — it signals the epistemological framework the research is built on.
Value created: Builds the persona. Every serious investor recognises these sources. It communicates "this is the intellectual background of the analyst" and creates an affinity signal for the target audience.

Where Value Accumulates
Layer	Mechanism	Compounding effect
Research archive	Each article adds to the corpus	AI agents become more useful over time
Track record	Each resolved call adds signal	Credibility compounds with time
Post-mortems	Each failure adds process improvement	Trust compounds with transparency
Email list	Each subscriber is a retention lever	Distribution value grows
Vector index	Each article expands semantic coverage	AI gets smarter as research grows
Access control	Friction → perceived exclusivity	Monetisation leverage increases
The Defensible Position
What makes this hard to replicate isn't the tech — it's the combination:
* Timestamped forecasts with prices → accountability most analysts avoid
* Post-mortems on losses → institutional credibility most independents skip
* AI agents grounded in the corpus → not generic, not hallucinated — specifically this analyst's view
* Entity resolver, ticker collision warnings → research sophistication visible in the product
The platform is designed so that every piece of content published makes every other feature more valuable. One new research article improves the Research Companion, the Portfolio Auditor, the Archive, and the credibility of the Track Record simultaneously.
