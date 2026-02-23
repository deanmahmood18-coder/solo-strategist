"use client";

import { usePathname } from "next/navigation";

import { AgentPanel } from "@/components/agent-panel";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { YieldBanner } from "@/components/yield-banner";

/**
 * Wraps every page with Navbar + YieldBanner + Footer,
 * but strips all chrome on the /gate page so it renders
 * as a pure full-screen vault with no distractions.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isGate = pathname === "/gate";

  if (isGate) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <YieldBanner />
      <main>{children}</main>
      <Footer />
      <AgentPanel />
    </>
  );
}
