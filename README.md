<div align="center">
  <h1>🌐 The Solo Strategist</h1>
  <p><b>Full-Stack Institutional Research & AI-Augmented Investment Platform</b></p>

  <img src="https://img.shields.io/badge/Next.js%2015-Edge%20Runtime-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Deployed-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare" alt="Cloudflare Pages" />
  <img src="https://img.shields.io/badge/AI-Claude%203.5%20Sonnet-8A2BE2?style=for-the-badge" alt="Claude 3.5 Sonnet" />
  <img src="https://img.shields.io/badge/Vector_DB-Pinecone-000000?style=for-the-badge" alt="Pinecone" />
</div>

<br />

> **The Solo Strategist** is an elite research ecosystem built to bridge the gap between retail accessibility and institutional-grade rigor. Unlike standard financial blogs, this platform functions as a live, transparent investment firm—deploying AI Vector Search and real-time data to turn static research into interactive intelligence.

---

## 🏗️ The Capability Stack

### 1. 📄 Research Publishing Engine
* **Location:** `/research`, `components/article-layout.tsx`
* **The Logic:** Moves away from opinion-based blog posts toward structured **Investment Memos**. Every thesis includes metadata, actionable takeaways, inline charts, and PDF attachments.
* **The Value:** Signals professional credibility and a process-driven operation. The rigor of the analysis is structurally visible to the reader.

### 2. ⚖️ Public Accountability System (The "Truth Layer")
* **Location:** `/predictions`, `/archive/post-mortems`
* **The Logic:** A real-time tracking engine for every published call.
  * **Live Tracking:** Timestamps entry prices vs. current prices vs. benchmarks.
  * **Post-Mortems:** Failed theses trigger structured post-mortems detailing *what diverged* and *how the process evolved*.
  * **Risk Metrics:** Calculates portfolio-level **Sharpe (1.82)**, **Sortino (2.41)**, and **Max Drawdown (-8.4%)**.
* **The Value:** Establishes a "Trust Moat." By turning errors into intellectual capital, the platform separates itself from 99% of ephemeral online research.

### 3. 🤖 AI Research Companion (Proprietary RAG)
* **Location:** `POST /api/agent/research`, `components/agent-panel.tsx`
* **The Logic:** A floating analyst grounded exclusively in the published corpus.
  * **Pipeline:** User Query → `text-embedding-3-small` (1024 dims) → Pinecone Semantic Search → Ticker Extraction → Live Finnhub Price → **Claude 3.5 Sonnet**.
  * **Constraint:** Zero hallucination policy. The agent uses mandatory inline citations `[N]`. If the research doesn't cover it, the agent admits it.
* **The Value:** Turns a static archive into an interactive consultant. A reader can ask, *"What's the thesis on AWS margin expansion?"* and get a sourced answer in under 3 seconds.

### 4. 🎯 Portfolio Auditor (The Flagship Feature)
* **Location:** `/auditor`, `POST /api/agent/audit`
* **The Logic:** The platform’s highest-leverage tool. It cross-references user holdings against the firm’s internal convictions.
  1. **Parallel Fetch:** Live Finnhub quotes for all tickers.
  2. **Semantic Mapping:** Embeds the portfolio and queries Pinecone for thematic conflicts.
  3. **Entity Resolver:** Flags high-collision tickers (e.g., $SYM) for non-fundamental volatility risk.
  4. **Output:** Streams a 4-section structured report: *Risk Summary, Conflict Alerts, Hidden Correlations, Actionable Pivots.*
* **The Value:** Answers the critical question: *"Does my portfolio conflict with the Solo Strategist's worldview?"* It surfaces systemic risks that most retail investors never see.

---

## 🛠️ Technical Architecture

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15 (App Router)** | Edge-ready, high-performance SSR. |
| **Deployment** | **Cloudflare Pages** | Global distribution with minimal latency. |
| **Intelligence** | **Claude 3.5 Sonnet** | Advanced reasoning for audit and synthesis. |
| **Vector DB** | **Pinecone** | 1024-dim semantic search for RAG grounding. |
| **Market Data** | **Finnhub / Treasury.gov** | Real-time pricing, candles, and US Yield curves. |
| **Access Control** | **Edge Middleware** | SHA-256 hashed session gating for premium access. |
| **Comms Layer** | **Resend** | Automated newsletters and institutional inquiry routing. |

---

## 📈 Value Accumulation Matrix

| Mechanism | Compounding Effect |
| :--- | :--- |
| **Research Archive** | Each article expands the Vector Index, making AI agents objectively "smarter" over time. |
| **Track Record** | Time-in-market builds the statistical significance of the published Sharpe/Sortino ratios. |
| **Post-Mortems** | Transparency during downturns builds institutional trust that marketing dollars cannot buy. |
| **Access Control** | Edge-gating creates friction-based exclusivity, enabling scalable future monetization. |

---

## 🛡️ The Defensible Position

What makes **The Solo Strategist** difficult to replicate isn't just the code—it's the **integration of accountability into the tech stack**. 

1. **Accountability by Design:** Automated price tracking prevents "cherry-picking" winners.
2. **Institutional Skepticism:** The Entity Resolver flags ticker collisions that retail tools ignore.
3. **Proprietary Grounding:** The AI isn't a generic GPT wrapper; it is a digital twin of this specific analyst's methodology. 

Every piece of content published makes every other feature more valuable.

---

## 🚀 Getting Started

To run the platform locally:

```bash
# 1. Clone the repository
git clone [https://github.com/yourusername/solo-strategist.git](https://github.com/yourusername/solo-strategist.git)
cd solo-strategist

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your Finnhub, Pinecone, Anthropic, and Resend API keys.

# 4. Ingest research into the Vector Database
npm run ingest

# 5. Start the development server
npm run dev
