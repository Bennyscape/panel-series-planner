import { ShieldX } from "lucide-react";
import Link from "next/link";

export default function RestrictedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-lg rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 text-center shadow-[0_16px_40px_rgba(29,27,25,0.06)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fbe8e8] text-[#b42318]">
          <ShieldX className="h-5 w-5" />
        </div>
        <div className="mt-4 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Restricted</div>
        <h1 className="mt-2 font-serif text-4xl text-[var(--text)]">Access not available</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This workspace is limited to approved members and admins. If you believe this is a mistake, contact the program lead.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#004b45]"
        >
          Return to sign in
        </Link>
      </div>
    </main>
  );
}
