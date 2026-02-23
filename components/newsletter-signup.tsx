"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data: { error?: string } = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to complete subscription. Please try again.");
    }
  }

  return (
    <section className="border-t border-slate-800 py-20">
      <div className="container-shell">
        <div className="reading-width mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-champagne/50">
            Research Correspondence
          </p>

          <h2 className="mt-4 font-serif text-3xl text-slate-100">
            Receive New Research Memos
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
            Published memos are distributed quarterly. Enter your address to receive new
            issues directly.
          </p>

          {status === "success" ? (
            <p className="mt-10 text-sm text-slate-400">
              Subscription confirmed. You will receive the next issue on publication.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
                aria-label="Email address"
                placeholder="name@institution.com"
                className="h-10 w-full max-w-sm rounded-sm border border-slate-600 bg-slate-900 px-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-champagne/25 disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="default"
                disabled={status === "loading"}
                className="w-full shrink-0 sm:w-auto"
              >
                {status === "loading" ? "Submitting…" : "Subscribe"}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-xs text-rose-400">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
