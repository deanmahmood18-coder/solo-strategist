"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import { Lock } from "lucide-react";

export default function GatePage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "denied">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password || status === "loading") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Full navigation so middleware sees the new cookie immediately
        window.location.href = "/";
      } else {
        setStatus("denied");
        setPassword("");
        inputRef.current?.focus();
      }
    } catch {
      setStatus("denied");
      setPassword("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4">

      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 58%, rgba(212,175,55,0.045) 0%, transparent 70%)",
        }}
      />

      {/* CRT scan-line texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px)",
        }}
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-[22rem] flex-col items-center">

        {/* Wordmark */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-500">
          The Solo Strategist
        </p>
        <div className="mt-2 h-px w-8 bg-gradient-to-r from-transparent via-champagne/30 to-transparent" />

        {/* Vault card */}
        <div
          className="mt-10 w-full rounded-sm border border-white/[0.07]"
          style={{
            background: "rgba(255, 255, 255, 0.025)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 32px 72px -16px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Top champagne accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-champagne/25 to-transparent" />

          <div className="p-8">
            {/* Lock icon + heading */}
            <div className="mb-7 flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne/20"
                style={{ background: "rgba(212,175,55,0.06)" }}
              >
                <Lock className="h-4 w-4 text-champagne/55" />
              </div>

              <div>
                <h1 className="font-serif text-[1.35rem] leading-snug text-slate-100">
                  Authorized Access Only.
                </h1>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                  Enter your Conviction Key to continue.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (status === "denied") setStatus("idle");
                }}
                placeholder="••••••••••••"
                autoComplete="current-password"
                spellCheck={false}
                required
                className="w-full rounded-sm border border-slate-700/60 bg-slate-900/60 px-4 py-3 text-center text-sm tracking-[0.22em] text-slate-200 placeholder:text-slate-700 placeholder:tracking-[0.12em] focus:border-champagne/35 focus:outline-none focus:ring-1 focus:ring-champagne/15 transition-colors"
              />

              {/* Error */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  status === "denied" ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-center text-[11px] font-medium tracking-wide text-rose-400">
                  Access denied - incorrect key.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading" || password.length === 0}
                className="w-full rounded-sm bg-champagne px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-900 transition-all hover:bg-champagne/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "loading" ? "Verifying…" : "Enter"}
              </button>
            </form>
          </div>

          {/* Bottom accent */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
        </div>

        {/* Footnote */}
        <p className="mt-8 text-center text-[10px] leading-relaxed text-slate-700">
          Private research terminal - not for public distribution.
        </p>
      </div>
    </div>
  );
}
