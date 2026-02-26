🌐 The Solo Strategist
Full-Stack Institutional Research & AI-Augmented Investment Platform

The Solo Strategist is an elite research ecosystem built to bridge the gap between retail accessibility and institutional-grade rigor. Unlike standard financial blogs, this platform functions as a live, transparent investment firm—deploying Next.js 15 (Edge Runtime) and AI Vector Search to turn static research into interactive intelligence.

🏗️ The Capability Stack
1. Research Publishing Engine

Location: /research, components/article-layout.tsx

The Logic: Moves away from "opinion posts" toward Investment Memos. Every thesis is a structured document featuring metadata, actionable takeaways, and inline figures.

Value: Signals professional credibility and a process-driven operation. The rigor of the analysis is structurally visible.

2. Public Accountability System (The "Truth" Layer)

Location: /predictions, /archive/post-mortems

The Logic: A real-time tracking engine for every call.

Live Tracking: Entry price vs. current price vs. benchmark.

Post-Mortems: Failed theses are never deleted; they are analyzed. We document what diverged and how the process evolved.

Risk Metrics: Real-time calculation of Sharpe (1.82), Sortino (2.41), and Max Drawdown (-8.4%).

Value: Establishes a "Trust Moat." By turning errors into intellectual capital, the platform separates itself from 99% of ephemeral online research.

3. AI Research Companion (RAG Implementation)

Location: POST /api/agent/research, components/agent-panel.tsx

The Logic: A floating analyst grounded exclusively in the published corpus.

Pipeline: User Query → text-embedding-3-small → Pinecone Vector Search → Claude 3.5 Sonnet.

Constraint: Zero hallucination policy. The agent uses mandatory inline citations [N]. If the research doesn't cover it, the agent admits it.

Value: Turns a static archive into an interactive consultant.

4. Portfolio Auditor (The Flagship Feature)

Location: /auditor, POST /api/agent/audit

The Logic: The platform’s most sophisticated tool. It cross-references user holdings against the firm’s internal convictions.

Parallel Fetch: Live Finnhub quotes for all tickers.

Semantic Mapping: Embeds the portfolio and queries Pinecone for thematic conflicts.

Conflict Resolver: Flags "Broken" theses or high-volatility "Ticker Collisions."

Output: A 4-section report: Risk Summary, Conflict Alerts, Hidden Correlations, Actionable Pivots.

Value: Answers the critical question: "Does my portfolio conflict with the Solo Strategist's worldview?"

🛠️ Technical Architecture
Layer	Technology	Function
Framework	Next.js 15 (App Router)	Edge-ready, high-performance SSR.
Deployment	Cloudflare Pages	Global distribution with minimal latency.
Intelligence	Claude 3.5 Sonnet	Advanced reasoning for audit and synthesis.
Vector DB	Pinecone	1024-dim semantic search for RAG grounding.
Market Data	Finnhub / Treasury.gov	Real-time pricing, candles, and US Yield curves.
Middleware	Edge Middleware	SHA-256 hashed session gating for premium access.
📈 Value Accumulation Matrix
Mechanism	Compounding Effect
Research Archive	Each article expands the Vector Index, making AI agents "smarter" over time.
Track Record	Time-in-market builds the statistical significance of the Sharpe/Sortino ratios.
Post-Mortems	Transparency during downturns builds institutional trust that marketing cannot buy.
Access Control	Edge-gating creates friction-based exclusivity, enabling future monetization.
🛡️ The Defensible Position
What makes The Solo Strategist difficult to replicate isn't just the code—it's the integration of accountability into the tech stack.

Accountability by Design: Automated price tracking prevents "cherry-picking" winners.

Institutional Skepticism: The Entity Resolver flags ticker collisions (e.g., SYM) that retail tools ignore.

Proprietary Grounding: The AI isn't a generic wrapper; it is a digital twin of the analyst's specific methodology.

🚀 Getting Started

Clone & Install: npm install

Ingest Research: npm run ingest (Chunks and embeds Markdown files to Pinecone).

Live Market Feed: Ensure FINNHUB_API_KEY is set to hydrate the /market layer.

Audit: Upload a CSV to /auditor to test the RAG-based conflict logic.
