export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "solo_access";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function computeToken(key: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password } = body as { password?: string };

  const key = process.env.CONVICTION_KEY;

  if (!key || !password || password !== key) {
    // Uniform 401 — don't leak whether the key is simply unset
    return NextResponse.json({ error: "Access denied." }, { status: 401 });
  }

  const token = await computeToken(key);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return res;
}
