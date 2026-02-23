/**
 * Pinecone REST client — zero Node.js dependencies, fully edge-compatible.
 *
 * Uses the Pinecone Data Plane REST API directly instead of the SDK so that
 * this module can be bundled for Cloudflare Workers / edge runtimes without
 * pulling in node:stream or other Node.js-only packages.
 *
 * SDK is still used in scripts/ingest-research.ts (Node.js, runs locally).
 */

import type { ChunkMetadata } from "./chunker";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Config helpers ───────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.PINECONE_API_KEY;
  if (!key) throw new Error("PINECONE_API_KEY is not set");
  return key;
}

function getIndexName(): string {
  const name = process.env.PINECONE_INDEX;
  if (!name) throw new Error("PINECONE_INDEX is not set");
  return name;
}

// Cache the index host so we only look it up once per cold start.
let cachedHost: string | null = null;

async function getIndexHost(): Promise<string> {
  if (cachedHost) return cachedHost;

  const apiKey = getApiKey();
  const name = getIndexName();

  const res = await fetch(`https://api.pinecone.io/indexes/${name}`, {
    headers: { "Api-Key": apiKey, Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Pinecone describe-index failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { host: string };
  cachedHost = data.host;
  return cachedHost;
}

// ─── Operations ───────────────────────────────────────────────────────────────

/**
 * Upserts pre-embedded vectors into the index.
 * Idempotent — existing IDs are overwritten.
 * Used by the local ingest script (Node.js).
 */
export async function upsertVectors(vectors: PineconeVector[]): Promise<void> {
  if (vectors.length === 0) return;

  const host = await getIndexHost();
  const apiKey = getApiKey();

  const res = await fetch(`https://${host}/vectors/upsert`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vectors }),
  });

  if (!res.ok) {
    throw new Error(`Pinecone upsert failed: ${res.status} ${await res.text()}`);
  }
}

/**
 * Queries for the top-K most semantically similar chunks.
 *
 * @param queryVector  1024-dim float array from text-embedding-3-small
 * @param topK         Number of results (default 5)
 */
export async function queryVectors(
  queryVector: number[],
  topK = 5
): Promise<PineconeMatch[]> {
  const host = await getIndexHost();
  const apiKey = getApiKey();

  const res = await fetch(`https://${host}/query`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ vector: queryVector, topK, includeMetadata: true }),
  });

  if (!res.ok) {
    throw new Error(`Pinecone query failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    matches: Array<{ id: string; score: number; metadata: Record<string, unknown> }>;
  };

  return (data.matches ?? []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: match.metadata as unknown as ChunkMetadata,
  }));
}
