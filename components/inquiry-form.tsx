"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const inquiryTypes = [
  "Media Inquiry",
  "Research Collaboration",
  "Bespoke Macro Analysis",
  "General Feedback",
];

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    // Simulate submission (replace with real API later)
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center rounded-sm border border-slate-700/60 bg-slate-900/80 p-12">
        <div className="text-center">
          <p className="font-serif text-2xl text-champagne">Inquiry Received</p>
          <p className="mt-3 text-sm text-slate-400">
            Thank you for your interest. You can expect a response within 24–48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-sm border border-slate-700/60 bg-slate-900/80 p-6"
    >
      <p className="font-serif text-2xl text-champagne">Submit an Inquiry</p>
      <div className="my-4 h-px w-10 bg-champagne/30" />

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Smith"
            className="w-full border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-champagne focus:outline-none"
          />
        </div>

        {/* Company */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Company / Organisation
          </label>
          <input
            type="text"
            name="company"
            placeholder="Firm or institution"
            className="w-full border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-champagne focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Professional Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="name@institution.com"
            className="w-full border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-champagne focus:outline-none"
          />
        </div>

        {/* Inquiry Type */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Inquiry Type
          </label>
          <select
            name="inquiryType"
            required
            className="w-full border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 focus:border-champagne focus:outline-none"
          >
            <option value="" className="bg-slate-900">Select type...</option>
            {inquiryTypes.map((type) => (
              <option key={type} value={type} className="bg-slate-900">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-slate-500">
            Message
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="Describe your inquiry..."
            className="w-full resize-none border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-champagne focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-8 w-full rounded-sm bg-midnight px-6 py-3 text-xs font-medium uppercase tracking-widest text-slate-200 transition hover:bg-[#003366] disabled:opacity-50"
      >
        {status === "loading" ? "Submitting..." : "Submit Inquiry"}
      </button>

      <p className="mt-4 text-center text-[10px] text-slate-600">
        Expected response time: 24–48 hours
      </p>
    </form>
  );
}
