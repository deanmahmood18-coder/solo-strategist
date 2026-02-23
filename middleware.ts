import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "solo_access";

/** SHA-256 hash of the conviction key — computed at edge runtime */
async function expectedToken(): Promise<string> {
  const key = process.env.CONVICTION_KEY ?? "";
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(key)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the gate page and its API through
  if (pathname.startsWith("/gate") || pathname.startsWith("/api/gate")) {
    // If already authenticated and trying to visit /gate, send home
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (cookie && pathname === "/gate") {
      const token = await expectedToken();
      if (cookie === token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    return NextResponse.next();
  }

  // No key configured → block everything (safety net for misconfigured deploys)
  const key = process.env.CONVICTION_KEY;
  if (!key) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const token = await expectedToken();

  if (cookie !== token) {
    return NextResponse.redirect(new URL("/gate", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     *  - _next/static  (static files)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - public image/font files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?)$).*)",
  ],
};
