"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react";
import { CsvDownloadButton } from "@/components/ui/csv-download-button";

const themes = [
  { name: "Relationships", count: 12, color: "#bd584c" },
  { name: "Career & Purpose", count: 9, color: "#be8633" },
  { name: "Mental Well-being", count: 7, color: "#567e61" },
  { name: "Civic Engagement", count: 4, color: "#3d8b82" },
  { name: "Creative Life", count: 3, color: "#826596" },
  { name: "Technology & Humanity", count: 3, color: "#65869d" },
];

const topics = [
  {
    theme: "Relationships",
    title: "Friendship Breakups in Adulthood",
    question: "Why don’t we have scripts for ending close friendships, and what does healthy closure look like?",
    audience: "Ages 22–30",
    format: "Quintet Panel",
    status: "Scheduled",
    meta: "Scheduled: Mar 28",
  },
  {
    theme: "Career & Purpose",
    title: "The Illusion of Dream Jobs",
    question: "How do we uncouple self-worth from occupational prestige in high-pressure urban centers?",
    audience: "Mid-level & Career Switchers",
    format: "Fireside",
    status: "Idea",
    meta: "",
  },
  {
    theme: "Mental Well-being",
    title: "Navigating Chronic Uncertainty",
    question: "Coping mechanisms when structural timelines (housing, career milestones) feel indefinitely deferred.",
    audience: "Universal",
    format: "",
    status: "Done",
    meta: "Conducted: Nov 14",
  },
  {
    theme: "Creative Life",
    title: "Making Art When Nobody Pays You",
    question: "Sustaining creative practices alongside exhausting 40-hour work weeks.",
    audience: "Designers & Writers",
    format: "Round Table",
    status: "Idea",
    meta: "",
  },
  {
    theme: "Civic Engagement",
    title: "Third Places in Shrinking Cities",
    question: "Rebuilding community cohesion through hyper-local public libraries and radical community spaces.",
    audience: "Local organizers",
    format: "Round Table",
    status: "Scheduled",
    meta: "Scheduled: Apr 25",
  },
];

const themeColors: Record<string, string> = {
  Relationships: "#bd584c",
  "Career & Purpose": "#be8633",
  "Mental Well-being": "#567e61",
  "Civic Engagement": "#3d8b82",
  "Creative Life": "#826596",
  "Technology & Humanity": "#65869d",
};

export default function TopicsPage() {
  const [query, setQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("Mental Well-being");
  const [saved, setSaved] = useState(false);

  const filteredTopics = useMemo(
    () =>
      topics.filter((topic) => {
        const matchesQuery = `${topic.title} ${topic.question} ${topic.theme}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesTheme = themeFilter === "All" || topic.theme === themeFilter;
        const matchesStatus = statusFilter === "All" || topic.status === statusFilter;
        return matchesQuery && matchesTheme && matchesStatus;
      }),
    [query, statusFilter, themeFilter],
  );

  return (
    <div className="relative min-h-[calc(100vh-112px)] space-y-5 pb-4">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#786f68]">
            Curatorial Repository <span className="px-1 text-[#b0a69e]">•</span> Curriculum V4
          </div>
          <h1 className="font-serif text-[34px] leading-[1.05]">Topics</h1>
          <p className="mt-1 text-[10px] text-[var(--muted)]">(38 total topics stored)</p>
        </div>
        <div className="flex items-center gap-2">
          <CsvDownloadButton
            filename="panel-series-topic-matrix.csv"
            label="Export Matrix"
            rows={[
              ["Theme", "Topic", "Framing question", "Audience", "Format", "Status", "Schedule"],
              ...topics.map((topic) => [
                topic.theme,
                topic.title,
                topic.question,
                topic.audience,
                topic.format,
                topic.status,
                topic.meta,
              ]),
            ]}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[10px] font-semibold text-[#45413d] hover:bg-[var(--surface)]"
          />
          <button
            type="button"
            onClick={() => {
              setSaved(false);
              setDrawerOpen(true);
            }}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-[10px] font-semibold text-white hover:bg-[#004b45]"
          >
            <Plus className="h-3.5 w-3.5" /> New topic
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-4">
          <section className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-white p-3 sm:flex-row sm:items-center">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-[var(--border)] bg-[#fcf9f6] px-3 text-[#837b74]">
              <Search className="h-3.5 w-3.5 shrink-0" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search topics"
                placeholder="Search the topic repository..."
                className="min-w-0 flex-1 bg-transparent text-[10px] text-[var(--text)] outline-none placeholder:text-[#a49c95]"
              />
              <kbd className="hidden rounded border border-[var(--border)] bg-white px-1.5 py-0.5 text-[8px] text-[#918a83] sm:inline">
                /
              </kbd>
            </label>
            <label className="flex h-9 items-center gap-2 text-[9px] text-[#766e67]">
              Status:
              <span className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter by status"
                  className="h-8 appearance-none rounded-md border border-[var(--border)] bg-white py-1 pl-2.5 pr-7 text-[9px] font-medium text-[#46413d] outline-none"
                >
                  <option>All</option>
                  <option>Idea</option>
                  <option>Scheduled</option>
                  <option>Done</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#817972]" />
              </span>
            </label>
            <div className="flex items-center gap-1 rounded-md bg-[#f6f1ed] p-1">
              <button
                type="button"
                aria-label="Grid view"
                className="rounded bg-white p-1.5 text-[var(--primary)] shadow-sm"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="List view"
                className="rounded p-1.5 text-[#807872] hover:bg-white"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setThemeFilter("All")}
              className={`rounded-full px-3 py-1.5 text-[9px] font-semibold ${
                themeFilter === "All"
                  ? "bg-[var(--primary)] text-white"
                  : "border border-[var(--border)] bg-white text-[#6f6862]"
              }`}
            >
              All <span className="ml-1 opacity-75">38</span>
            </button>
            {themes.map((theme) => (
              <button
                key={theme.name}
                type="button"
                onClick={() => setThemeFilter(theme.name)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-medium ${
                  themeFilter === theme.name
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] bg-white text-[#6f6862]"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.color }} />
                {theme.name} <span className="opacity-60">{theme.count}</span>
              </button>
            ))}
          </div>

          <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {filteredTopics.map((topic) => (
              <article
                key={topic.title}
                className="rounded-lg border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(53,41,32,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold" style={{ color: themeColors[topic.theme] }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: themeColors[topic.theme] }} />
                    {topic.theme}
                  </span>
                  <button type="button" aria-label={`More actions for ${topic.title}`} className="text-[#938b84] hover:text-[var(--text)]">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-3 font-serif text-[20px] leading-6">{topic.title}</h2>
                <p className="mt-2 min-h-10 text-[10px] leading-[1.55] text-[#6f6963]">
                  {topic.question}
                </p>
                <div className="mt-3 border-t border-[var(--border)] pt-3 text-[8px] text-[#77706a]">
                  <span className="inline-flex items-center gap-1">
                    <Mic2Icon /> Target: {topic.audience}
                  </span>
                  {topic.format ? <span> <span className="px-1">•</span> Format: {topic.format}</span> : null}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-semibold ${
                      topic.status === "Scheduled"
                        ? "bg-[#e3f2ec] text-[#356d4a]"
                        : topic.status === "Done"
                          ? "bg-[#e7eee4] text-[#526849]"
                          : "bg-[#f8e8de] text-[#a14e31]"
                    }`}
                  >
                    {topic.status === "Scheduled" ? <Check className="h-3 w-3" /> : null}
                    {topic.status}
                  </span>
                  {topic.meta ? (
                    <span className="text-[8px] text-[#837a73]">{topic.meta}</span>
                  ) : (
                    <Link href="/calendar" className="inline-flex items-center gap-1 text-[9px] font-semibold text-[var(--primary)]">
                      <CalendarPlus className="h-3 w-3" /> Schedule
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </section>
          {filteredTopics.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)]">
              No topics match these filters.
            </p>
          ) : null}
        </div>

        <aside className="h-fit rounded-lg border border-[var(--border)] bg-white p-4 lg:sticky lg:top-16">
          <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#827a73]">
            Theme distribution
          </div>
          <div className="mt-3 space-y-3">
            {themes.map((theme) => (
              <div key={theme.name}>
                <div className="flex items-center justify-between gap-2 text-[9px]">
                  <span className="flex min-w-0 items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: theme.color }} />
                    <span className="truncate">{theme.name}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{theme.count}</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#f1ece8]">
                  <div className="h-full rounded-full" style={{ width: `${theme.count * 6}%`, background: theme.color }} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {drawerOpen ? (
        <>
          <button
            type="button"
            aria-label="Close new topic drawer"
            onClick={() => setDrawerOpen(false)}
            className="fixed bottom-0 left-0 right-0 top-[var(--topbar-height)] z-40 bg-[#302923]/20 backdrop-blur-[2px] lg:left-[var(--sidebar-width)]"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-topic-title"
            className="fixed bottom-0 right-0 z-50 flex w-full flex-col border-l border-[var(--border)] bg-[#fffaf7] shadow-[-10px_0_35px_rgba(31,26,22,0.12)] sm:w-[min(470px,calc(100vw-32px))]"
            style={{ top: "var(--topbar-height)" }}
          >
            <header className="flex items-start justify-between border-b border-[var(--border)] px-6 py-5">
              <div>
                <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#82776f]">
                  Curatorial Editor
                </div>
                <h2 id="new-topic-title" className="mt-1 font-serif text-[25px] leading-7">
                  New Topic
                </h2>
                <p className="mt-1 text-[9px] text-[var(--muted)]">
                  Add a rich conversation prompt to the series bank.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-[#8d847d] hover:bg-[var(--surface)]"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <form
              className="flex min-h-0 flex-1 flex-col"
              onSubmit={(event) => {
                event.preventDefault();
                setSaved(true);
              }}
            >
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-[9px] font-semibold">
                    <span>Title <span className="text-[#b24b34]">*</span></span>
                    <span className="font-normal text-[#827a73]">46 / 80</span>
                  </span>
                  <input
                    required
                    maxLength={80}
                    defaultValue="Navigating Burnout Before the Breaking Point"
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-white px-3 text-[10px] outline-none focus:border-[var(--primary)]"
                  />
                  <span className="mt-1.5 block text-[8px] text-[#8b817a]">
                    Distinct, memorable phrase for session program cards.
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 flex items-center justify-between text-[9px] font-semibold">
                    <span>Framing Question <span className="text-[#b24b34]">*</span></span>
                    <span className="font-normal text-[#827a73]">128 chars</span>
                  </span>
                  <textarea
                    required
                    rows={4}
                    defaultValue="What early physical and emotional signals do we consistently normalize before reaching acute exhaustion, and how can peers intervene?"
                    className="w-full resize-none rounded-md border border-[var(--border)] bg-white px-3 py-2.5 text-[10px] leading-5 outline-none focus:border-[var(--primary)]"
                  />
                  <span className="mt-1.5 block text-[8px] text-[#8b817a]">
                    Open-ended premise to ignite debate between panelists.
                  </span>
                </label>

                <div>
                  <div className="mb-2 flex items-center justify-between text-[9px] font-semibold">
                    <span>Curatorial Theme</span>
                    <button type="button" className="text-[#8b817a]" aria-label="Theme options">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mb-2 flex items-center gap-2 rounded-md bg-[#f4eee9] px-2.5 py-2 text-[9px]">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: themeColors[selectedTheme] }} />
                    <span className="font-medium">{selectedTheme}</span>
                  </div>
                  <div className="mb-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#898077]">
                    Select theme
                  </div>
                  <div className="space-y-0.5">
                    {themes.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setSelectedTheme(theme.name)}
                        className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-[9px] ${
                          selectedTheme === theme.name
                            ? "bg-[#f2eee9] font-semibold text-[#3e3935]"
                            : "text-[#69635e] hover:bg-[#f7f3ef]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: theme.color }} />
                          {theme.name}
                        </span>
                        {selectedTheme === theme.name ? (
                          <Check className="h-3 w-3 text-[var(--primary)]" />
                        ) : (
                          <span className="text-[8px] text-[#8b817a]">{theme.name === "Relationships" ? "Terracotta" : theme.name === "Career & Purpose" ? "Ochre" : theme.name === "Mental Well-being" ? "Sage" : theme.name === "Civic Engagement" ? "Sky Blue" : theme.name === "Creative Life" ? "Plum" : "Rose"}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <footer className="flex items-center justify-between border-t border-[var(--border)] bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-md px-3 py-2 text-[9px] font-semibold text-[#766e67] hover:bg-[var(--surface)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-[9px] font-semibold text-white hover:bg-[#004b45]"
                >
                  {saved ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  {saved ? "Topic saved" : "Save topic"}
                </button>
              </footer>
            </form>
          </aside>
        </>
      ) : null}
    </div>
  );
}

function Mic2Icon() {
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[#7a726b]" />;
}
