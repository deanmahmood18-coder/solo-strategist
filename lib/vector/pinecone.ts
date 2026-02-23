import { Pinecone, type PineconeRecord } from "@pinecone-database/pinecone";
import type { ChunkMetadata } from "./chunker";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape passed to upsertVectors — mirrors Pinecone's PineconeRecord */
export type PineconeVector = {
  id: string;
  values: number[];
  metadata: ChunkMetadata;
};

export type PineconeMatch = {
  id: string;
  score: number;
  metadata: ChunkMetadata;
};

// ─── Client ───────────────────────────────────────────────────────────────────

function getClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) throw new Error("PINECONE_API_KEY is not set");
  return new Pinecone({ apiKey });
}

/**
 * Returns an index reference using the v7 options-object API.
 * The index must already exist: dims 1536, metric cosine, serverless.
 */
function getIndex() {
  const name = process.env.PINECONE_INDEX;
  if (!name) throw new Error("PINECONE_INDEX is not set");
  // Use default RecordMetadata generic; we cast to ChunkMetadata at the output boundary
  return getClient().index({ name });
}

// ─── Operations ───────────────────────────────────────────────────────────────

/**
 * Upserts pre-embedded vectors. Idempotent — existing IDs are overwritten.
 */
export async function upsertVectors(vectors: PineconeVector[]): Promise<void> {
  if (vectors.length === 0) return;
  // Cast to Pinecone's PineconeRecord type — shape is identical at runtime
  await getIndex().upsert({
    records: vectors as unknown as PineconeRecord[],
  });
}

/**
 * Queries for the top-K most semantically similar chunks.
 *
 * @param queryVector  1536-dim float array from text-embedding-3-small
 * @param topK         Number of results (default 5)
 */
export async function queryVectors(
  queryVector: number[],
  topK = 5
): Promise<PineconeMatch[]> {
  const response = await getIndex().query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return (response.matches ?? []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata as unknown as ChunkMetadata,
  }));
}
