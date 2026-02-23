import type { ResearchArticle } from "@/data/research";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChunkMetadata = {
  slug: string;
  title: string;
  category: string;
  researchType: string;
  publishedAt: string;
  chunkType: string;
  /** Empty string for summary/takeaway chunks */
  sectionHeading: string;
  /** -1 for summary/takeaway chunks */
  sectionIndex: number;
  /** The URL path to the research article, e.g. /research/symbotic-automation-at-scale */
  url: string;
  /**
   * Full chunk text stored in metadata so Pinecone query results include
   * the content without a secondary lookup. Pinecone metadata limit is 40KB
   * per vector; chunks average ~500 chars — well within limits.
   */
  text: string;
};

export type ResearchChunk = {
  /** Deterministic ID: {slug}_{type}_{index} — enables idempotent re-ingestion */
  id: string;
  text: string;
  metadata: ChunkMetadata;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Converts a single body element to plain text.
 * Plain strings pass through; figure objects become their caption
 * (the caption is semantically meaningful; the src path is noise for embeddings).
 */
function bodyElementToText(
  element: string | { figure: { src: string; caption: string } }
): string {
  if (typeof element === "string") return element.trim();
  return `[Figure: ${element.figure.caption}]`;
}

/**
 * Joins all body elements in a section into a single string.
 */
function sectionBodyToText(
  body: Array<string | { figure: { src: string; caption: string } }>
): string {
  return body
    .map(bodyElementToText)
    .filter((t) => t.length > 0)
    .join("\n\n");
}

// ─── Chunking ─────────────────────────────────────────────────────────────────

/**
 * Produces all embeddable chunks for a single ResearchArticle.
 *
 * Chunk order per article:
 *   1. summary chunk  — answers "what is this report about"
 *   2. takeaways chunk — answers "what are the key conclusions"
 *   3. one section chunk per content[] entry — answers detailed questions
 */
export function chunkArticle(article: ResearchArticle): ResearchChunk[] {
  const chunks: ResearchChunk[] = [];
  const url = `/research/${article.slug}`;

  const sharedMeta = {
    slug: article.slug,
    title: article.title,
    category: article.category,
    researchType: article.researchType,
    publishedAt: article.publishedAt,
    url,
  };

  // ── Chunk: summary ──────────────────────────────────────────────────────────
  const summaryText = [
    `Title: ${article.title}`,
    `Category: ${article.category} | ${article.researchType}`,
    `Published: ${article.publishedAt}`,
    `Summary: ${article.summary}`,
  ].join("\n");

  chunks.push({
    id: `${article.slug}_summary`,
    text: summaryText,
    metadata: { ...sharedMeta, chunkType: "summary", sectionHeading: "", sectionIndex: -1, text: summaryText },
  });

  // ── Chunk: takeaways ────────────────────────────────────────────────────────
  if (article.takeaways.length > 0) {
    const takeawayText = [
      `Title: ${article.title}`,
      `Key Takeaways:`,
      ...article.takeaways.map((t, i) => `${i + 1}. ${t}`),
    ].join("\n");

    chunks.push({
      id: `${article.slug}_takeaways`,
      text: takeawayText,
      metadata: { ...sharedMeta, chunkType: "takeaways", sectionHeading: "", sectionIndex: -1, text: takeawayText },
    });
  }

  // ── Chunks: one per content section ────────────────────────────────────────
  article.content.forEach((section, index) => {
    const bodyText = sectionBodyToText(section.body);

    // Skip sections with no meaningful prose (e.g. figure-only intros)
    const meaningfulText = bodyText.replace(/\[Figure:.*?\]/g, "").trim();
    if (meaningfulText.length < 20) return;

    const sectionText = [
      `Title: ${article.title}`,
      `Section: ${section.heading}`,
      bodyText,
    ].join("\n\n");

    chunks.push({
      id: `${article.slug}_section_${index}`,
      text: sectionText,
      metadata: {
        ...sharedMeta,
        chunkType: "section",
        sectionHeading: section.heading,
        sectionIndex: index,
        text: sectionText,
      },
    });
  });

  return chunks;
}

/**
 * Chunks every article in the corpus. Call this from the ingest script.
 */
export function chunkAllArticles(articles: ResearchArticle[]): ResearchChunk[] {
  return articles.flatMap(chunkArticle);
}
