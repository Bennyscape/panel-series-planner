import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CircleAlert,
  Layers3,
  Mic2,
  Plus,
  TrendingUp,
} from "lucide-react";
import { CsvDownloadButton } from "@/components/ui/csv-download-button";

const themes = [
  { name: "Relationships", count: 7, percent: 39, color: "#c65d4e" },
  { name: "Career & Purpose", count: 4, percent: 22, color: "#d18a36" },
  { name: "Mental Well-being", count: 3, percent: 17, color: "#608267" },
  { name: "Civic Engagement", count: 2, percent: 11, color: "#418b85" },
  { name: "Creative Life", count: 1, percent: 6, color: "#89689b" },
  { name: "Technology & Humanity", count: 1, percent: 6, color: "#6889a0" },
];

const upcoming = [
  {
    date: "Mar 14",
    theme: "Career & Purpose",
    title: "Workplace Boundaries & Quiet Quitting",
    detail: "Brief ready · 3 speakers confirmed",
    color: "#d18a36",
    href: "/sessions/d97c2f70fafe4c0f906b3f21ffe3907a",
  },
  {
    date: "Mar 28",
    theme: "Relationships",
    title: "Loneliness in the Hyper-Connected Age",
    detail: "Brief ready · 4 speakers confirmed",
    color: "#c65d4e",
    href: "/sessions/d97c2f70fafe4c0f906b3f21ffe3907a",
  },
  {
    date: "Apr 11",
    theme: "Creative Life",
    title: "Art in the Age of Generative Algorithms",
    detail: "Drafting · 2 speakers invited",
    color: "#89689b",
    href: "/sessions/d97c2f70fafe4c0f906b3f21ffe3907a",
  },
];

const monthly = [
  { month: "Oct", count: 2 },
  { month: "Nov", count: 3 },
  { month: "Dec", count: 2 },
  { month: "Jan", count: 4 },
  { month: "Feb", count: 3 },
  { month: "Mar 25", count: 4 },
];

function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="font-serif text-[21px] leading-6">{title}</h2>
        {description ? (
          <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#786f68]">
            Cohort Pulse <span className="text-[#afa59e]">·</span> Q1 Live Cycle
          </div>
          <h1 className="font-serif text-[32px] leading-[1.05] sm:text-[36px]">Series overview</h1>
          <p className="mt-1.5 text-[11px] text-[var(--muted)]">
            Spring 2025 Young Adult Forum series health &amp; momentum
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CsvDownloadButton
            filename="panel-series-ledger.csv"
            label="Export Ledger"
            rows={[
              ["Date", "Theme", "Topic", "Brief", "Speaker count"],
              ...upcoming.map((session) => [
                session.date,
                session.theme,
                session.title,
                session.detail.split(" · ")[0],
                session.detail.split(" · ")[1] ?? "",
              ]),
            ]}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[10px] font-semibold text-[#45413d] transition hover:bg-[var(--surface)]"
          />
          <Link
            href="/topics"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-[10px] font-semibold text-white transition hover:bg-[#004b45]"
          >
            <Plus className="h-3.5 w-3.5" />
            New topic
          </Link>
        </div>
      </header>

      <section aria-label="Series metrics" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total topics",
            value: "38",
            note: "+4 added this month",
            icon: Layers3,
            tint: "#f6e7de",
            iconColor: "#a34a31",
          },
          {
            label: "Sessions this month",
            value: "3",
            note: "Next: Mar 14, 2025",
            icon: CalendarCheck,
            tint: "#fce9df",
            iconColor: "#bd5931",
          },
          {
            label: "Topics unscheduled",
            value: "14",
            note: "Ready to assign to calendar",
            icon: TrendingUp,
            tint: "#f6e6df",
            iconColor: "#b95735",
          },
          {
            label: "Next session date",
            value: "Mar 14",
            note: "In 4 days · “Ethics of AI Work”",
            icon: Mic2,
            tint: "#e1f3ee",
            iconColor: "#005c55",
          },
        ].map(({ label, value, note, icon: Icon, tint, iconColor }) => (
          <article
            key={label}
            className="flex min-h-[94px] items-center justify-between rounded-lg border border-[var(--border)] bg-white px-4 py-3.5"
          >
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#716c67]">
                {label}
              </div>
              <div className="mt-1 font-serif text-[26px] leading-7">{value}</div>
              <div className="mt-1 text-[9px] text-[var(--muted)]">{note}</div>
            </div>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: tint, color: iconColor }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </span>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-[#efd8ca] bg-[#fff1e9] px-4 py-3 sm:flex-row sm:items-center">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#f8ddd0] text-[#a3472a]">
          <CircleAlert className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#673b2b]">
            Theme Distribution Alert
            <span className="rounded-full bg-white/70 px-2 py-0.5 text-[8px] font-medium text-[#986245]">
              Disparity detected
            </span>
          </div>
          <p className="mt-0.5 text-[9px] leading-4 text-[#795b4e]">
            Relationships represents 39% of recent panels. Consider scheduling{" "}
            <strong className="font-semibold text-[#644639]">Creative Life</strong> or{" "}
            <strong className="font-semibold text-[#644639]">Technology &amp; Humanity</strong>{" "}
            next to preserve editorial breadth.
          </p>
        </div>
        <Link
          href="/topics"
          className="inline-flex shrink-0 items-center gap-1 text-[9px] font-semibold text-[#7b3e26] hover:underline"
        >
          Browse underrepresented <ArrowRight className="h-3 w-3" />
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.12fr_0.88fr]">
        <article className="rounded-lg border border-[var(--border)] bg-white p-4">
          <SectionTitle
            title="Themes covered"
            description="Sessions per theme over the last 90 days (target: balanced representation)"
            action={
              <span className="shrink-0 rounded-full bg-[var(--surface)] px-2 py-1 text-[8px] font-medium text-[#746e68]">
                18 sessions tracked
              </span>
            }
          />
          <div className="mt-4 space-y-3">
            {themes.map((theme) => (
              <div key={theme.name}>
                <div className="mb-1 flex items-center justify-between gap-3 text-[9px]">
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    />
                    <span className="truncate">{theme.name}</span>
                    <span className="text-[8px] font-normal text-[#928982]">
                      {theme.count} {theme.count === 1 ? "session" : "sessions"}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{theme.percent}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#f3efec]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${theme.percent}%`, backgroundColor: theme.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3 text-[8px] text-[var(--muted)]">
            <span>Target per theme: 16.7% across recurring 6-month cycles</span>
            <Link href="/topics" className="inline-flex shrink-0 items-center gap-1 font-semibold text-[var(--primary)]">
              Adjust Matrix <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </article>

        <article className="rounded-lg border border-[var(--border)] bg-white p-4">
          <SectionTitle
            title="Upcoming sessions"
            description="Scheduled cohort engagements"
            action={
              <Link href="/sessions" className="text-[9px] font-semibold text-[var(--primary)] hover:underline">
                View All
              </Link>
            }
          />
          <div className="mt-3 divide-y divide-[var(--border)]">
            {upcoming.map((session) => (
              <Link
                key={session.date}
                href={session.href}
                className="group flex gap-3 py-3 first:pt-1.5 last:pb-1"
              >
                <div className="w-[42px] shrink-0 pt-0.5 text-[9px] font-bold text-[#625c56]">
                  {session.date}
                  <span
                    className="mt-1 block h-1 w-7 rounded-full"
                    style={{ backgroundColor: session.color }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.06em] text-[#827a73]">
                    {session.theme}
                  </div>
                  <div className="truncate text-[10px] font-semibold group-hover:text-[var(--primary)]">
                    {session.title}
                  </div>
                  <div className="mt-1 text-[8px] text-[var(--muted)]">{session.detail}</div>
                </div>
                <ArrowRight className="mt-4 h-3 w-3 shrink-0 text-[#aaa39d] transition group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-lg border border-[var(--border)] bg-white p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <SectionTitle
            title="Sessions per month"
            description="Cadence overview across scheduled cohort panels"
          />
          <div className="flex items-center gap-3 text-[8px] text-[#746e68]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-[var(--primary)]" />
              Conducted / Planned
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-sm bg-[#d8d2cd]" />
              Target (3)
            </span>
          </div>
        </div>
        <div className="relative mt-3 grid h-[126px] grid-cols-6 items-end gap-3 border-b border-[var(--border)] px-2 sm:h-[150px]">
          <div className="pointer-events-none absolute inset-x-2 top-[22%] border-t border-dashed border-[#e8e1dc]" />
          <div className="pointer-events-none absolute inset-x-2 top-[53%] border-t border-dashed border-[#e8e1dc]" />
          {monthly.map((item) => (
            <div key={item.month} className="relative flex h-full flex-col items-center justify-end gap-2 pb-0">
              <span className="text-[8px] font-medium text-[#746e68]">{item.count} sessions</span>
              <div
                className="z-[1] w-full max-w-16 rounded-t-[4px] bg-[var(--primary)]"
                style={{ height: `${item.count * 17}%` }}
              />
              <span className="absolute -bottom-4 text-[8px] text-[#827b75]">{item.month}</span>
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-2 text-[8px] text-[var(--muted)]">
          <span>Average pacing: 3.0 sessions monthly across the current series</span>
          <span className="inline-flex items-center gap-1 font-medium text-[var(--primary)]">
            <TrendingUp className="h-3 w-3" /> Momentum index: High
          </span>
        </div>
      </section>
    </div>
  );
}
