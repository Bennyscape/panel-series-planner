import { LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function AccountSetupIncomplete() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-lg rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(29,27,25,0.06)]">
        <div className="font-serif text-2xl text-[var(--text)]">
          Account setup incomplete
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Your account profile is not set up yet. Please contact an
          administrator to complete your account setup.
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
