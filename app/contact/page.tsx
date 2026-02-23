import type { Metadata } from "next";
import { Linkedin, Mail, MapPin } from "lucide-react";

import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Contact | The Solo Strategist",
  description: "Institutional inquiries, research collaboration, and professional consultation."
};

export default function ContactPage() {
  return (
    <div className="container-shell py-14">
      <header className="mb-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Professional Engagement
        </p>
        <h1 className="mt-2 font-serif text-4xl text-slate-100 sm:text-5xl">
          Institutional Inquiries &<br />Collaborative Research
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400">
          For bespoke research requests, media inquiries, or professional collaboration,
          please use the form below or contact directly.
        </p>
        <div className="mt-6 h-px w-16 bg-champagne/30" />
      </header>

      <div className="grid gap-12 lg:grid-cols-[380px_1fr]">
        {/* Left Column — Direct Contact */}
        <div>
          <div className="rounded-sm border border-slate-700/60 bg-slate-900/80 p-6">
            <p className="font-serif text-2xl text-champagne">Direct Contact</p>
            <div className="my-4 h-px w-10 bg-champagne/30" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-300">London, United Kingdom</span>
              </div>
              <a
                href="mailto:deanmahmood18@icloud.com"
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-champagne"
              >
                <Mail className="h-4 w-4 text-slate-500" />
                deanmahmood18@icloud.com
              </a>
              <a
                href="https://www.linkedin.com/in/dean-mahmood-847aa21b5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-champagne"
              >
                <Linkedin className="h-4 w-4 text-slate-500" />
                Dean Mahmood
              </a>
            </div>

            {/* Signature / Logo */}
            <div className="mt-8 border-t border-slate-700/60 pt-6">
              <p className="font-serif text-lg tracking-wide text-champagne">
                The Solo Strategist
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Independent Capital Allocation Research
              </p>
            </div>
          </div>

          {/* Research Alerts */}
          <div className="mt-6 rounded-sm border border-slate-700/60 bg-slate-900/80 p-6">
            <p className="font-serif text-lg text-champagne">Research Alerts</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Receive published memos covering Macro, Credit, Commodities, and Equities
              directly to your inbox.
            </p>
            <form action="/api/subscribe" method="POST" className="mt-4">
              <input
                type="email"
                name="email"
                required
                placeholder="name@institution.com"
                className="w-full border-b border-slate-700 bg-transparent pb-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-champagne focus:outline-none"
              />
              <button
                type="submit"
                className="mt-4 w-full rounded-sm bg-midnight px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-slate-200 transition hover:bg-midnight/80"
              >
                Subscribe to Alerts
              </button>
            </form>
          </div>
        </div>

        {/* Right Column — Inquiry Form */}
        <InquiryForm />
      </div>

      {/* Compliance Footer */}
      <div className="mt-16 border-t border-slate-800 pt-6">
        <p className="max-w-3xl text-[11px] leading-6 text-slate-600">
          <strong className="font-medium text-slate-500">Compliance Notice:</strong>{" "}
          Submitting an inquiry does not establish a client-advisor relationship. All research
          published on this platform is for informational and educational purposes only and does
          not constitute personalised investment advice. The Solo Strategist does not hold itself
          out as a registered investment adviser. By submitting this form you acknowledge our{" "}
          <span className="text-champagne/60">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
