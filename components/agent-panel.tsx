"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport, type UIMessage } from "ai";
import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Bot, X, Send, BookOpen, Sparkles } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Citation = {
  index: number;
  slug: string;
  title: string;
  sectionHeading?: string;
  url: string;
  score: number;
};

// ─── Suggested prompts shown in the empty state ───────────────────────────────

const SUGGESTED_PROMPTS = [
  "What's the investment thesis on Alphabet?",
  "Explain the DCF valuation for Amazon's infrastructure cycle",
  "What are the key risks identified in the gold thesis?",
  "How does Google Cloud's backlog support the bull case?",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract plain text from the parts[] array of a UIMessage. */
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter(
      (p): p is { type: "text"; text: string } & typeof p =>
        p.type === "text" && "text" in p && typeof (p as { text?: unknown }).text === "string"
    )
    .map((p) => (p as { text: string }).text)
    .join("");
}

/**
 * Split message text on [N] citation markers and return an array of React
 * nodes — plain text runs interleaved with small clickable citation badges.
 */
function renderWithCitations(text: string, citations: Citation[]): React.ReactNode[] {
  const parts = text.split(/(\[\d+\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const citation = citations.find((c) => c.index === idx);
      if (citation) {
        return (
          <Link
            key={i}
            href={`/research/${citation.slug}`}
            title={citation.title}
            className="inline-flex items-center rounded-sm border border-champagne/40 bg-champagne/10 px-1 py-0 text-[10px] font-semibold leading-5 text-champagne no-underline transition-colors hover:bg-champagne/20 align-baseline"
          >
            [{idx}]
          </Link>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
}

/** Three-dot pulsing indicator shown while streaming. */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-champagne/40"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messageCitations, setMessageCitations] = useState<Record<string, Citation[]>>({});
  const pendingCitationsRef = useRef<Citation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Stable transport — captures headers from each response before streaming starts.
  const transport = useMemo(
    () =>
      new TextStreamChatTransport({
        api: "/api/agent/research",
        fetch: async (url, init) => {
          const response = await fetch(url as string, init as RequestInit);
          const header = response.headers.get("X-Citations");
          if (header) {
            try {
              pendingCitationsRef.current = JSON.parse(header) as Citation[];
            } catch {
              pendingCitationsRef.current = [];
            }
          }
          return response;
        },
      }),
    [] // pendingCitationsRef is a stable ref — no deps needed
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    onFinish: ({ message }) => {
      if (pendingCitationsRef.current.length > 0) {
        setMessageCitations((prev) => ({
          ...prev,
          [message.id]: [...pendingCitationsRef.current],
        }));
        pendingCitationsRef.current = [];
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Scroll to latest message as content arrives.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus the textarea whenever the panel opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => textareaRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Grow textarea with content, capped at 120px.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      {/* ── Floating trigger ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Research Companion"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-champagne/30 bg-slate-900 shadow-xl shadow-black/50 transition-all duration-200 hover:scale-105 hover:border-champagne/60 hover:bg-slate-800"
        >
          <Bot className="h-5 w-5 text-champagne" />
        </button>
      )}

      {/* ── Panel ── */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-slate-800 bg-slate-950 shadow-2xl md:w-[420px]">
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border border-champagne/25 bg-champagne/10">
                  <Bot className="h-3.5 w-3.5 text-champagne" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">
                    Research Companion
                  </p>
                  <p className="text-[10px] text-slate-600">Grounded in published reports</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
              {/* Empty state */}
              {!hasMessages && (
                <div className="py-8">
                  <div className="mb-6 text-center">
                    <Sparkles className="mx-auto mb-3 h-7 w-7 text-champagne/25" />
                    <p className="text-sm text-slate-400">Ask about the published research.</p>
                    <p className="mt-1 text-[11px] text-slate-600">
                      All responses are grounded in the corpus.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => {
                          setInput(prompt);
                          setTimeout(() => textareaRef.current?.focus(), 0);
                        }}
                        className="w-full rounded-sm border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-left text-xs text-slate-400 transition-colors hover:border-slate-700 hover:text-slate-300"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message) => {
                const isUser = message.role === "user";
                const text = getMessageText(message);
                const citations = !isUser ? (messageCitations[message.id] ?? []) : [];

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    {isUser ? (
                      <div className="max-w-[88%] rounded-sm border border-slate-700/80 bg-slate-800/60 px-4 py-2.5 text-sm leading-relaxed text-slate-200">
                        {text}
                      </div>
                    ) : (
                      <div className="w-full">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/45">
                          Research Companion
                        </p>

                        {/* Response text with inline [N] citation badges */}
                        <div className="text-sm leading-7 text-slate-300">
                          {citations.length > 0
                            ? renderWithCitations(text, citations)
                            : text}
                        </div>

                        {/* Source cards */}
                        {citations.length > 0 && (
                          <div className="mt-3">
                            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.13em] text-slate-700">
                              Sources
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {citations.map((c) => (
                                <Link
                                  key={c.index}
                                  href={`/research/${c.slug}`}
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-slate-700/80 bg-slate-900 px-2.5 py-1.5 text-[10px] text-slate-400 no-underline transition-colors hover:border-slate-600 hover:text-slate-300"
                                >
                                  <BookOpen className="h-2.5 w-2.5 shrink-0 text-champagne/40" />
                                  <span>
                                    <span className="text-champagne/60">[{c.index}]</span>{" "}
                                    {c.title}
                                    {c.sectionHeading && (
                                      <span className="ml-1 text-slate-600">
                                        — {c.sectionHeading}
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Streaming indicator */}
              {isLoading && (
                <div className="flex flex-col items-start">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-champagne/45">
                    Research Companion
                  </p>
                  <TypingIndicator />
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="rounded-sm border border-rose-900/40 bg-rose-950/20 px-4 py-3 text-xs text-rose-400">
                  {error.message?.toLowerCase().includes("401") ||
                  error.message?.toLowerCase().includes("unauthorized")
                    ? "Access restricted — a Conviction Key is required to query the Research Companion."
                    : "An error occurred. Please try again."}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="shrink-0 border-t border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about the research…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 resize-none overflow-hidden rounded-sm border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 transition-colors focus:border-champagne/30 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-champagne/25 bg-champagne/10 text-champagne transition-colors hover:bg-champagne/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1.5 text-[10px] text-slate-700">
                Grounded in published research only · Enter to send
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
