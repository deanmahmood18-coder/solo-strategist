"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";

/* ── Navigation structure ─────────────────────────────────── */

type NavItem = {
  label: string;
  href: string;
  description: string;
};

type NavGroup = {
  label: string;
  href?: string;       // set for direct links (no dropdown)
  items?: NavItem[];   // set for dropdown groups
};

const navGroups: NavGroup[] = [
  {
    label: "Strategy",
    items: [
      {
        label: "Philosophy",
        href: "/philosophy",
        description: "Framework, first principles & mental models",
      },
      {
        label: "Conviction",
        href: "/predictions",
        description: "Live sector positioning & risk ratios",
      },
      {
        label: "Post-Mortems",
        href: "/archive/post-mortems",
        description: "Resolved calls, lessons & accountability",
      },
    ],
  },
  {
    label: "Research",
    items: [
      {
        label: "Sector Reports",
        href: "/research",
        description: "Equity & thematic deep-dive memos",
      },
      {
        label: "Intelligence",
        href: "/news",
        description: "Curated macro signals & market dispatches",
      },
      {
        label: "Archive",
        href: "/archive",
        description: "Full chronological research history",
      },
    ],
  },
  {
    label: "Library",
    href: "/library",
  },
  {
    label: "Auditor",
    href: "/auditor",
  },
];

/* ── Navbar component ─────────────────────────────────────── */

export function Navbar() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenGroup(label);
  };

  const scheduleClose = () => {
    closeTimerRef.current = setTimeout(() => setOpenGroup(null), 180);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-md"
    >
      <div className="container-shell flex h-16 items-center justify-between">

        {/* ── Logo ───────────────────────────────────────────── */}
        <Link
          href="/"
          className="font-serif text-lg tracking-wide text-champagne transition-opacity hover:opacity-75"
          onClick={() => setMobileOpen(false)}
        >
          The Solo Strategist
        </Link>

        {/* ── Desktop primary nav ────────────────────────────── */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {navGroups.map((group) => {
            const isOpen = openGroup === group.label;

            // Direct link (Library)
            if (!group.items) {
              return (
                <Link
                  key={group.label}
                  href={group.href!}
                  className="rounded-sm px-4 py-2 text-sm text-slate-300 transition-colors hover:text-champagne"
                >
                  {group.label}
                </Link>
              );
            }

            // Dropdown group (Strategy, Research)
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => openDropdown(group.label)}
                onMouseLeave={scheduleClose}
              >
                <button
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  className={`flex items-center gap-1 rounded-sm px-4 py-2 text-sm transition-colors ${
                    isOpen
                      ? "text-champagne"
                      : "text-slate-300 hover:text-champagne"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-champagne" : "text-slate-500"
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                <div
                  onMouseEnter={() => openDropdown(group.label)}
                  onMouseLeave={scheduleClose}
                  className={`absolute left-0 top-full mt-1.5 w-68 min-w-[17rem] origin-top-left overflow-hidden rounded-sm border border-slate-700/50 bg-slate-950/92 shadow-[0_20px_48px_-8px_rgba(0,0,0,0.75)] transition-all duration-200 ease-out [backdrop-filter:blur(10px)] ${
                    isOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  {/* Top accent */}
                  <div className="h-px bg-gradient-to-r from-transparent via-champagne/25 to-transparent" />

                  <div className="p-1.5">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenGroup(null)}
                        className="group/item block rounded-sm px-4 py-3 transition-colors hover:bg-slate-800/50"
                      >
                        <p className="text-[13px] font-semibold text-slate-200 transition-colors group-hover/item:text-champagne">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>

                  {/* Bottom accent */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
                </div>
              </div>
            );
          })}
        </nav>

        {/* ── Desktop: Contact ghost button ──────────────────── */}
        <div className="hidden items-center md:flex">
          <Link
            href="/contact"
            className="rounded-sm border border-slate-700/60 px-4 py-2 text-sm text-slate-300 transition-all duration-200 hover:border-champagne/50 hover:text-champagne"
          >
            Contact
          </Link>
        </div>

        {/* ── Mobile: Hamburger toggle ───────────────────────── */}
        <button
          className="rounded-sm p-2 text-slate-400 transition-colors hover:text-champagne md:hidden"
          onClick={() => {
            setMobileOpen((v) => !v);
            setMobileExpanded(null);
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* ── Mobile slide-down menu ─────────────────────────────── */}
      <div
        className={`overflow-hidden border-t border-slate-800/60 transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-slate-950/98 px-4 py-2 [backdrop-filter:blur(10px)]">
          {navGroups.map((group) =>
            !group.items ? (
              // Direct link
              <Link
                key={group.label}
                href={group.href!}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-slate-800/40 py-3.5 text-sm text-slate-300 transition-colors hover:text-champagne last:border-0"
              >
                {group.label}
              </Link>
            ) : (
              // Accordion group
              <div key={group.label} className="border-b border-slate-800/40 last:border-0">
                <button
                  onClick={() =>
                    setMobileExpanded(
                      mobileExpanded === group.label ? null : group.label
                    )
                  }
                  className="flex w-full items-center justify-between py-3.5 text-sm text-slate-300 transition-colors hover:text-champagne"
                >
                  {group.label}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      mobileExpanded === group.label ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    mobileExpanded === group.label
                      ? "max-h-48 pb-2"
                      : "max-h-0"
                  }`}
                >
                  <div className="space-y-0.5 pl-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-sm px-3 py-2.5 text-[13px] text-slate-400 transition-colors hover:bg-slate-800/40 hover:text-champagne"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Contact in mobile */}
          <div className="pb-3 pt-3">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full rounded-sm border border-slate-700/60 py-2.5 text-center text-sm text-slate-300 transition-all hover:border-champagne/40 hover:text-champagne"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
