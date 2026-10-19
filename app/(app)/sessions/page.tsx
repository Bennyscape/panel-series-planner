"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  FileText,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { CsvDownloadButton } from "@/components/ui/csv-download-button";

type Session = {
  id: string;
  date: string;
  time: string;
  title: string;
  guests: number;
  theme: string;
  venue: string;
  brief: "Brief ready" | "Drafting" | "Brief missing";
  notes: "Notes added" | "Notes pending";
  tab: "Upcoming" | "Past sessions" | "Drafts";
};

const detailHref = "/sessions/d97c2f70fafe4c0f906b3f21ffe3907a";

const sessions: Session[] = [
  {
    id: "mar-14",
    date: "Mar 14, 2025",
    time: "6:30 PM EST",
    title: "Workplace Boundaries & Quiet Quitting",
    guests: 3,
    theme: "Career & Purpose",
    venue: "Downtown Community Center",
    brief: "Brief ready",
    notes: "Notes pending",
    tab: "Upcoming",
  },
  {
    id: "mar-28",
    date: "Mar 28, 2025",
    time: "6:30 PM EST",
    title: "Loneliness in the Hyper-Connected Age",
    guests: 4,
    theme: "Relationships",
    venue: "The Loft Studio",
    brief: "Brief ready",
    notes: "Notes pending",
    tab: "Upcoming",
  },
  {
    id: "apr-11",
    date: "Apr 11, 2025",
    time: "7:00 PM EST",
    title: "Art in the Age of Generative Algorithms",
    guests: 2,
    theme: "Creative Life",
    venue: "Eastside Innovation Lab",
    brief: "Drafting",
    notes: "Notes pending",
    tab: "Upcoming",
  },
  {
    id: "apr-25",
    date: "Apr 25, 2025",
    time: "6:30 PM EST",
    title: "Navigating Chronic Uncertainty",
    guests: 3,
    theme: "Mental Well-being",
    venue: "The Loft Studio",
    brief: "Brief missing",
    notes: "Notes pending",
    tab: "Upcoming",
  },
  {
    id: "may-09",
    date: "May 09, 2025",
    time: "6:30 PM EST",
    title: "Rebuilding Civic Duty Beyond Elections",
    guests: 3,
    theme: "Civic Engagement",
    venue: "Civic Hall Room 204",
    brief: "Brief ready",
    notes: "Notes added",
    tab: "Upcoming",
  },
  {
    id: "past-1",
    date: "Feb 28, 2025",
    time: "6:30 PM EST",
    title: "Finding Meaning in the In-Between",
    guests: 3,
    theme: "Relationships",
    venue: "Downtown Community Center",
    brief: "Brief ready",
    notes: "Notes added",
    tab: "Past sessions",
  },
  {
    id: "draft-1",
    date: "May 23, 2025",
    time: "6:30 PM EST",
    title: "The Future of Third Places",
    guests: 0,
    theme: "Civic Engagement",
    venue: "Venue not selected",
    brief: "Brief missing",
    notes: "Notes pending",
    tab: "Drafts",
  },
];

const themeColors: Record<string, string> = {
  "Career & Purpose": "#a86e25",
  Relationships: "#a34d42",
  "Creative Life": "#765887",
  "Mental Well-being": "#526f55",
  "Civic Engagement": "#367a73",
};

const tabCounts: Record<Session["tab"], string> = {
  Upcoming: "6",
  "Past sessions": "24",
  Drafts: "2",
};

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<Session["tab"]>("Upcoming");
  const [query, setQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("All Themes");
  const [briefFilter, setBriefFilter] = useState("Brief: All Statuses");
  const [notesFilter, setNotesFilter] = useState("Notes: All");

  const filteredSessions = useMemo(
    () =>
      sessions.filter((session) => {
        const matchesTab = session.tab === activeTab;
        const matchesQuery = `${session.title} ${session.venue}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesTheme = themeFilter === "All Themes" || session.theme === themeFilter;
        const matchesBrief =
          briefFilter === "Brief: All Statuses" ||
          (briefFilter === "Brief ready" && session.brief === "Brief ready") ||
          (briefFilter === "Drafting" && session.brief === "Drafting") ||
          (briefFilter === "Brief missing" && session.brief === "Brief missing");
        const matchesNotes =
          notesFilter === "Notes: All" ||
          (notesFilter === "Notes added" && session.notes === "Notes added") ||
          (notesFilter === "Notes pending" && session.notes === "Notes pending");
        return matchesTab && matchesQuery && matchesTheme && matchesBrief && matchesNotes;
      }),
    [activeTab, briefFilter, notesFilter, query, themeFilter],
  );

  return (
    <div className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#786f68]">
            Cohort Program Matrix <span className="px-1 text-[#b0a69e]">·</span> Volume IV Archive
          </div>
          <h1 className="font-serif text-[34px] leading-[1.05]">Sessions</h1>
          <p className="mt-1.5 text-[10px] text-[var(--muted)]">
            Log of past and scheduled panel discussions, briefs, and coordinator archive.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CsvDownloadButton
            filename="panel-series-sessions.csv"
            label="Export CSV"
            rows={[
              ["Date", "Time", "Topic", "Theme", "Venue", "Brief", "Notes"],
              ...filteredSessions.map((session) => [
                session.date,
                session.time,
                session.title,
                session.theme,
                session.venue,
                session.brief,
                session.notes,
              ]),
            ]}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[9px] font-semibold hover:bg-[var(--surface)]"
          />
          <Link
            href="/calendar"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-[9px] font-semibold text-white hover:bg-[#004b45]"
          >
            <Plus className="h-3.5 w-3.5" /> Schedule session
          </Link>
        </div>
      </header>

      <section className="rounded-lg border border-[var(--border)] bg-white">
        <div className="flex flex-col justify-between gap-3 border-b border-[var(--border)] px-4 pt-3 sm:flex-row sm:items-center">
          <div className="flex gap-4">
            {(["Upcoming", "Past sessions", "Drafts"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative inline-flex items-center gap-1.5 pb-3 text-[9px] font-semibold ${
                  activeTab === tab ? "text-[var(--primary)]" : "text-[#807870]"
                }`}
              >
                {tab}
                <span className={`rounded-full px-1.5 py-0.5 text-[8px] ${activeTab === tab ? "bg-[#e5f1ed] text-[var(--primary)]" : "bg-[#f4efeb] text-[#7f766f]"}`}>
                  {tabCounts[tab]}
                </span>
                {activeTab === tab ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)]" /> : null}
              </button>
            ))}
          </div>
          <div className="mb-2 flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[8px] font-semibold text-[#746d66]">Curation Target</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#eee8e3]">
              <div className="h-full w-2/3 rounded-full bg-[var(--primary)]" />
            </div>
            <span className="text-[8px] text-[#827a73]">4 of 6 briefs sealed</span>
            <CircleHelp className="h-3 w-3 text-[#9a918a]" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-b border-[var(--border)] bg-[#fdfaf8] p-3 lg:flex-row lg:items-center">
          <label className="flex h-8 min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-2.5 text-[#8b827b]">
            <Search className="h-3 w-3 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search sessions"
              placeholder="Search by topic title, speaker, or venue..."
              className="min-w-0 flex-1 bg-transparent text-[9px] text-[var(--text)] outline-none placeholder:text-[#a49c95]"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              {
                value: themeFilter,
                setValue: setThemeFilter,
                label: "All Themes",
                options: ["All Themes", "Career & Purpose", "Relationships", "Creative Life", "Mental Well-being", "Civic Engagement"],
              },
              {
                value: briefFilter,
                setValue: setBriefFilter,
                label: "Brief: All Statuses",
                options: ["Brief: All Statuses", "Brief ready", "Drafting", "Brief missing"],
              },
              {
                value: notesFilter,
                setValue: setNotesFilter,
                label: "Notes: All",
                options: ["Notes: All", "Notes added", "Notes pending"],
              },
            ].map((filter) => (
              <label key={filter.label} className="relative">
                <select
                  value={filter.value}
                  onChange={(event) => filter.setValue(event.target.value)}
                  aria-label={filter.label}
                  className="h-8 max-w-[170px] appearance-none rounded-md border border-[var(--border)] bg-white py-1 pl-2.5 pr-7 text-[8px] font-medium text-[#5e5751] outline-none focus:border-[var(--primary)]"
                >
                  {filter.options.map((option) => <option key={option}>{option}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-[#867e76]" />
              </label>
            ))}
            <button type="button" aria-label="More session filters" className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] bg-white text-[#827a73] hover:bg-[var(--surface)]">
              <SlidersHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[132px_minmax(250px,1.7fr)_145px_180px_112px_110px_90px] gap-3 bg-[#fbf7f4] px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#817970]">
              <span>Date &amp; Time</span>
              <span>Topic Title</span>
              <span>Theme</span>
              <span>Venue</span>
              <span>Brief Status</span>
              <span>Notes</span>
              <span>Actions</span>
            </div>
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="grid grid-cols-[132px_minmax(250px,1.7fr)_145px_180px_112px_110px_90px] items-center gap-3 border-t border-[var(--border)] px-4 py-3 transition hover:bg-[#fdfaf8]"
              >
                <div className="text-[9px] font-semibold text-[#514a44]">
                  <div className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3 text-[#96755d]" />{session.date}</div>
                  <div className="mt-1 pl-[18px] text-[8px] font-normal text-[#837a72]">{session.time}</div>
                </div>
                <div className="min-w-0">
                  <Link href={detailHref} className="block truncate text-[10px] font-semibold text-[#302c29] hover:text-[var(--primary)]">
                    {session.title}
                  </Link>
                  <div className="mt-1 truncate text-[8px] text-[#857c74]">
                    {session.guests} panel guests
                  </div>
                </div>
                <span className="w-fit max-w-full truncate rounded-full px-2 py-1 text-[8px] font-semibold" style={{ backgroundColor: `${themeColors[session.theme] ?? "#777"}18`, color: themeColors[session.theme] ?? "#555" }}>
                  {session.theme}
                </span>
                <div className="flex min-w-0 items-center gap-1.5 truncate text-[8px] text-[#716a63]">
                  <MapPin className="h-3 w-3 shrink-0 text-[#97877a]" />
                  <span className="truncate">{session.venue}</span>
                </div>
                <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${
                  session.brief === "Brief ready"
                    ? "bg-[#e5f2eb] text-[#39724f]"
                    : session.brief === "Drafting"
                      ? "bg-[#fff0df] text-[#9e6427]"
                      : "bg-[#f9e6e3] text-[#a64d42]"
                }`}>
                  {session.brief === "Brief ready" ? <Check className="h-2.5 w-2.5" /> : null}
                  {session.brief}
                </span>
                <span className={`text-[8px] ${session.notes === "Notes added" ? "font-medium text-[#4d7759]" : "text-[#847b73]"}`}>
                  {session.notes}
                </span>
                <Link href={detailHref} className="inline-flex items-center gap-1 text-[8px] font-semibold text-[var(--primary)] hover:underline">
                  View detail <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
            {filteredSessions.length === 0 ? (
              <div className="px-4 py-10 text-center text-[10px] text-[var(--muted)]">
                No sessions match your current filters.
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5 text-[8px] text-[#817971]">
          <span>Showing {filteredSessions.length} of {tabCounts[activeTab]} {activeTab.toLowerCase()}</span>
          <span className="inline-flex items-center gap-1"><FileText className="h-3 w-3" /> Updated just now</span>
        </div>
      </section>
    </div>
  );
}
