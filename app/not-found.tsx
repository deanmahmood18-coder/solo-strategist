import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell py-20 text-center">
      <h2 className="font-serif text-4xl text-midnight dark:text-slate-100">Research memo not found</h2>
      <p className="mt-4 text-ink/75 dark:text-slate-300">The requested article may have moved to the archive.</p>
      <Link href="/research" className="mt-6 inline-block text-midnight underline-offset-4 hover:underline dark:text-champagne">
        Return to Research
      </Link>
    </div>
  );
}
