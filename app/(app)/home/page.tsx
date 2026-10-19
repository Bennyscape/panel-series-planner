import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSetupIncomplete } from "@/components/account-setup-incomplete";
import Link from "next/link";
import { ArrowRight, CalendarClock, Mic2, Sparkles } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "Unable to load the signed-in user's profile:",
      error.code,
      error.message,
    );
    throw new Error(
      `Unable to load the signed-in user's profile: ${error.code} ${error.message}`,
    );
  }

  if (!profile) {
    console.error(
      "Account setup incomplete: no profile row for signed-in user",
      user.id,
    );
    return <AccountSetupIncomplete />;
  }

  return (
    <div className="space-y-5">
      <header className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#786f68]">Member workspace</div>
            <h1 className="mt-1 font-serif text-[32px] leading-tight text-[var(--text)]">
              Welcome back, {profile.name}.
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Your cohort briefings, scheduled sessions, and reading list are ready to review.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfe9e7] bg-[#edf7f4] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            View only mode
          </div>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Next session</div>
              <h2 className="mt-2 font-serif text-[28px] leading-tight text-[var(--text)]">
                Work-Life Boundaries in a Noisy Age
              </h2>
            </div>
            <span className="rounded-full bg-[#fff1de] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#9d5d23]">
              4 days
            </span>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)] sm:grid-cols-3">
            <div className="rounded-md bg-[var(--surface)] p-3">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Date</div>
              <div className="mt-2 font-medium text-[var(--text)]">Mar 14, 2025</div>
            </div>
            <div className="rounded-md bg-[var(--surface)] p-3">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Time</div>
              <div className="mt-2 font-medium text-[var(--text)]">6:30 PM</div>
            </div>
            <div className="rounded-md bg-[var(--surface)] p-3">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Venue</div>
              <div className="mt-2 font-medium text-[var(--text)]">Blueprint Hall</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/sessions/d97c2f70fafe4c0f906b3f21ffe3907a"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#004b45]"
            >
              View session brief <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface)]"
            >
              <CalendarClock className="h-4 w-4" />
              Add to my calendar
            </button>
          </div>
        </article>

        <aside className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[#fffaf7] p-5">
          <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Upcoming</div>
          <ul className="mt-4 space-y-3">
            {[
              ["Mar 28", "Loneliness in the Hyper-Connected Age"],
              ["Apr 11", "Art in the Age of Generative Algorithms"],
              ["Apr 25", "The Future of Community Care"],
            ].map(([date, title]) => (
              <li key={title} className="rounded-md border border-[var(--border)] bg-white p-3">
                <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{date}</div>
                <div className="mt-1 text-sm font-medium text-[var(--text)]">{title}</div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">Cohort topics</div>
            <h2 className="mt-1 font-serif text-[24px] text-[var(--text)]">Recommended reading</h2>
          </div>
          <Link href="/topics" className="text-sm font-medium text-[var(--primary)]">
            Browse all
          </Link>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            "Community and identity",
            "Work-life boundaries",
            "Civic imagination",
          ].map((title) => (
            <div key={title} className="rounded-md border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#ecf5f3] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                  Theme
                </span>
                <Mic2 className="h-3.5 w-3.5 text-[var(--muted)]" />
              </div>
              <div className="mt-3 font-serif text-[24px] text-[var(--text)]">{title}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
