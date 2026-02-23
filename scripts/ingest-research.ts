/**
 * One-time ingestion script: chunks data/research.ts, embeds with OpenAI,
 * and upserts into Pinecone.
 *
 * Usage:
 *   npm run ingest
 *
 * Re-running is safe — Pinecone upsert overwrites by ID.
 * Run again whenever you add new articles to data/research.ts.
 */

import { researchArticles } from "../data/research";
import { chunkAllArticles, type ResearchChunk } from "../lib/vector/chunker";
import { upsertVectors, type PineconeVector } from "../lib/vector/pinecone";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

const BATCH_SIZE = 50;
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMS = 1024; // matches Pinecone index dimensions

function batchArray<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

async function ingest(): Promise<void> {
  console.log("=== Solo Strategist — Research Corpus Ingestion ===\n");

  // Validate env vars before doing any work
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in .env.local");
  }
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set in .env.local");
  }
  if (!process.env.PINECONE_INDEX) {
    throw new Error("PINECONE_INDEX is not set in .env.local");
  }

  // Generate all chunks
  const chunks: ResearchChunk[] = chunkAllArticles(researchArticles);
  console.log(
    `Generated ${chunks.length} chunks from ${researchArticles.length} articles.\n`
  );

  // Preview first 3 chunks for sanity check
  chunks.slice(0, 3).forEach((c) => {
    console.log(`  [${c.id}] (${c.text.length} chars)`);
  });
  console.log(`  ...\n`);

  // Process in batches
  const batches = batchArray(chunks, BATCH_SIZE);
  let totalUpserted = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Batch ${i + 1}/${batches.length} — embedding ${batch.length} chunks...`);

    // Embed the batch
    const { embeddings } = await embedMany({
      model: openai.embedding(EMBEDDING_MODEL),
      values: batch.map((chunk) => chunk.text),
      providerOptions: { openai: { dimensions: EMBEDDING_DIMS } },
    });

    // Assemble Pinecone vectors
    const vectors: PineconeVector[] = batch.map((chunk, j) => ({
      id: chunk.id,
      values: embeddings[j],
      metadata: chunk.metadata,
    }));

    // Upsert to Pinecone
    await upsertVectors(vectors);
    totalUpserted += vectors.length;
    console.log(`  ✓ Upserted ${vectors.length} vectors. (Running total: ${totalUpserted})\n`);
  }

  console.log(`=== Done. ${totalUpserted} vectors now in Pinecone. ===`);
}

ingest().catch((err: unknown) => {
  console.error("\nIngestion failed:", err);
  process.exit(1);
});
