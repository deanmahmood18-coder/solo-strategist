import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-slate-700 py-16 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-midnight/30 via-transparent to-champagne/[0.04]" />
      <div className="relative container-shell reading-width text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-champagne/80">
          Independent Research House
        </p>
        <h1 className="font-serif text-4xl leading-tight text-slate-100 md:text-6xl">
          Independent Capital Allocation
          <br />
          through Secular Thematics and Value Discipline
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-300">
          A research-driven portal documenting long-term asymmetric investment theses.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/research">Read the Latest Research</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/predictions">View Track Record</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
