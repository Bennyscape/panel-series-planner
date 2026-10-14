"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  MapPin,
  Plus,
  Search,
  X,
} from "lucide-react";

const initialTopics = [
  { title: "Making Art When Nobody Pays You", theme: "Creative Life", duration: "90 min" },
  { title: "Ethics of AI in Everyday Life", theme: "Technology & Humanity", duration: "Ready for panel" },
  { title: "Local Governance for Gen Z", theme: "Civic Engagement", duration: "Needs 3 panelists" },
  { title: "Rebuilding Community Care", theme: "Relationships", duration: "Discussion circle" },
  { title: "The Freelance Trap: Freedom or Precarity?", theme: "Career & Purpose", duration: "Economic panel" },
];

const themeColors: Record<string, string> = {
  "Career & Purpose": "#c37a31",
  Relationships: "#bd584c",
  "Creative Life": "#826596",
  "Civic Engagement": "#39847b",
  "Technology & Humanity": "#65869d",
};

const events: Record<string, { title: string; detail: string; color: string }[]> = {
  "2025-03-08": [{ title: "Curator Review", detail: "", color: "#6a8b84" }],
  "2025-03-10": [{ title: "Prep Sync", detail: "14:00", color: "#43877a" }],
  "2025-03-14": [{ title: "Workplace Boundaries & Quiet Quitting", detail: "18:30 · Main Hall", color: "#c47c43" }],
  "2025-03-20": [{ title: "Vernal Equinox", detail: "Panel Off-week", color: "#798b74" }],
  "2025-03-28": [{ title: "Loneliness in the Hyper-Connected Age", detail: "18:30 · Loft Studio", color: "#ba6f57" }],
};

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
  const [month, setMonth] = useState(new Date(2025, 2, 1));
  const [viewMode, setViewMode] = useState<"Month" | "Agenda">("Month");
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("2025-03-28");
  const [scheduledTopics, setScheduledTopics] = useState<string[]>([]);
  const [notice, setNotice] = useState("");

  const monthName = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = useMemo(() => {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const start = new Date(firstOfMonth);
    start.setDate(firstOfMonth.getDate() - offset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [month]);

  const visibleTopics = initialTopics.filter((topic) =>
    `${topic.title} ${topic.theme}`.toLowerCase().includes(search.toLowerCase()),
  );

  function changeMonth(delta: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  }

  return (
    <div className="space-y-4 pb-5">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="mb-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#786f68]">
            Editorial Term Planning
          </div>
          <div className="flex items-end gap-2">
            <h1 className="font-serif text-[32px] leading-[1.05]">{monthName}</h1>
            <span className="pb-1 text-[9px] text-[#817971]">(Semester Curation)</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-md border border-[var(--border)] bg-white">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month" className="flex h-8 w-8 items-center justify-center text-[#6e665f] hover:bg-[var(--surface)]">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={() => setMonth(new Date(2025, 2, 1))} className="h-8 border-x border-[var(--border)] px-3 text-[9px] font-semibold text-[#49433e] hover:bg-[var(--surface)]">
              Today
            </button>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month" className="flex h-8 w-8 items-center justify-center text-[#6e665f] hover:bg-[var(--surface)]">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex h-8 rounded-md border border-[var(--border)] bg-white p-0.5">
            {(["Month", "Agenda"] as const).map((mode) => (
              <button key={mode} type="button" onClick={() => setViewMode(mode)} className={`rounded px-2.5 text-[9px] font-semibold ${viewMode === mode ? "bg-[#f1ebe6] text-[#3f3934]" : "text-[#80776f]"}`}>
                {mode}
              </button>
            ))}
          </div>
          <Link href="/topics" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--primary)] px-3 text-[9px] font-semibold text-white hover:bg-[#004b45]">
            <Plus className="h-3.5 w-3.5" /> New Panel
          </Link>
        </div>
      </header>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_270px]">
        <section className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
          {viewMode === "Month" ? (
            <>
              <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[#fbf8f5]">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="py-2 text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-[#827a73]">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((date) => {
                  const key = dateKey(date);
                  const outsideMonth = date.getMonth() !== month.getMonth();
                  const dayEvents = events[key] ?? [];
                  const isToday = key === "2025-03-10";
                  const isSelected = key === selectedDate;
                  return (
                    <div
                      key={key}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        const topic = event.dataTransfer.getData("text/topic");
                        if (topic) {
                          setScheduledTopics((current) => [...current, topic]);
                          setSelectedDate(key);
                          setNotice(`“${topic}” added to ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`);
                        }
                      }}
                      className={`group min-h-[66px] border-b border-r border-[var(--border)] p-1.5 transition-colors sm:min-h-[78px] sm:p-2 ${
                        outsideMonth ? "bg-[#fbf9f7] text-[#b2aaa3]" : "bg-white"
                      } ${isSelected ? "bg-[#f8f2ee]" : "hover:bg-[#fdfaf8]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] ${isToday ? "bg-[var(--primary)] font-bold text-white" : outsideMonth ? "text-[#a9a19a]" : "font-medium text-[#625b55]"}`}>
                          {date.getDate()}
                        </span>
                        {isToday ? <span className="text-[7px] font-semibold uppercase tracking-wide text-[var(--primary)]">Today</span> : null}
                        {date.getDate() === 22 && date.getMonth() === 2 ? <span className="text-[7px] text-[#a49a91]">Slot open</span> : null}
                      </div>
                      <div className="mt-1 space-y-1">
                        {dayEvents.map((item) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => setSelectedDate(key)}
                            className="block w-full truncate rounded-[3px] border-l-2 px-1 py-1 text-left text-[7px] font-semibold leading-3 text-[#4d4944] sm:text-[8px]"
                            style={{ borderColor: item.color, backgroundColor: `${item.color}18` }}
                          >
                            {item.title}
                            {item.detail ? <span className="hidden font-normal sm:inline"> · {item.detail}</span> : null}
                          </button>
                        ))}
                        {scheduledTopics
                          .filter((_, index) => index === 0 && key === selectedDate)
                          .map((topic) => (
                            <span key={topic} className="block truncate rounded-[3px] bg-[#e4f1ec] px-1 py-1 text-[7px] font-semibold text-[var(--primary)]">{topic}</span>
                          ))}
                        {date.getDate() === 22 && date.getMonth() === 2 && month.getMonth() === 2 ? (
                          <button type="button" onClick={() => setSelectedDate(key)} className="flex w-full items-center gap-1 rounded border border-dashed border-[#c9d7d1] px-1 py-1 text-[7px] text-[#5e7f72]">
                            <CirclePlus className="h-2.5 w-2.5" /> Drop topic here
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fbf8f5] px-3 py-2 text-[7px] text-[#716a63]">
                <div className="flex flex-wrap gap-3">
                  {[
                    ["#4b887d", "Current Date"],
                    ["#bd584c", "Orchard Stream"],
                    ["#cf8756", "Terracotta Stream"],
                    ["#826596", "Plum Stream"],
                  ].map(([color, label]) => (
                    <span key={label} className="inline-flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />{label}
                    </span>
                  ))}
                </div>
                <span>Standard Session Slot: 18:30 – 20:00 EST</span>
              </div>
            </>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {Object.entries(events).map(([key, items]) =>
                items.map((item) => (
                  <button key={key} type="button" onClick={() => setSelectedDate(key)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#fcf8f5]">
                    <CalendarDays className="h-4 w-4 text-[var(--primary)]" />
                    <span className="w-24 text-[9px] font-semibold">{new Date(`${key}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex-1 text-[9px] font-medium">{item.title}</span>
                    <span className="text-[8px] text-[#817970]">{item.detail}</span>
                  </button>
                )),
              )}
            </div>
          )}
        </section>

        <aside className="space-y-3">
          <section className="rounded-lg border border-[var(--border)] bg-white p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-serif text-[19px] leading-5">Unscheduled Topics</h2>
                <p className="mt-1 text-[8px] text-[#817970]">Drag any topic onto the calendar to schedule a session.</p>
              </div>
              <span className="rounded-full bg-[#f4efeb] px-2 py-1 text-[8px] font-medium text-[#716a63]">14 topics</span>
            </div>
            <label className="mt-3 flex h-8 items-center gap-2 rounded-md border border-[var(--border)] bg-[#fcf9f6] px-2.5 text-[#898078]">
              <Search className="h-3 w-3" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Filter unscheduled topics" placeholder="Filter unscheduled..." className="min-w-0 flex-1 bg-transparent text-[8px] outline-none placeholder:text-[#a49c95]" />
            </label>
            <div className="mt-2 divide-y divide-[#eee8e3]">
              {visibleTopics.map((topic) => (
                <div
                  key={topic.title}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData("text/topic", topic.title)}
                  className="group flex cursor-grab items-start gap-2 py-2.5 active:cursor-grabbing"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: themeColors[topic.theme] }} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[9px] font-semibold text-[#48423d]">{topic.title}</div>
                    <div className="mt-1 flex items-center justify-between gap-1 text-[7px] text-[#857d76]">
                      <span className="truncate">{topic.duration}</span>
                      <span className="shrink-0 rounded-full bg-[#f6f1ed] px-1.5 py-0.5" style={{ color: themeColors[topic.theme] }}>{topic.theme}</span>
                    </div>
                  </div>
                  <span className="mt-1 text-[#9b9189]">⠿</span>
                </div>
              ))}
              {visibleTopics.length === 0 ? <p className="py-5 text-center text-[9px] text-[var(--muted)]">No topics found.</p> : null}
            </div>
            <Link href="/topics" className="mt-1 inline-flex items-center gap-1 text-[8px] font-semibold text-[var(--primary)]">
              <Plus className="h-3 w-3" /> Draft new topic
            </Link>
          </section>

          {events[selectedDate]?.[0] ? (
            <section className="rounded-lg border border-[var(--border)] bg-white p-3.5 shadow-[0_8px_24px_rgba(47,38,31,0.06)]">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#f6e7df] px-2 py-1 text-[7px] font-semibold text-[#a25139]">Confirmed</span>
                <button type="button" onClick={() => setSelectedDate("")} aria-label="Close session detail" className="text-[#928981]"><X className="h-3.5 w-3.5" /></button>
              </div>
              <h3 className="mt-2 font-serif text-[17px] leading-5">{events[selectedDate][0].title}</h3>
              <p className="mt-1 text-[8px] leading-4 text-[#78716b]">
                A conversational panel interrogating algorithmic isolation vs authentic collective spaces.
              </p>
              <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3 text-[8px] text-[#716a63]">
                <div className="flex items-center gap-2"><CalendarDays className="h-3 w-3 text-[var(--primary)]" /> Friday, Mar 28, 2025</div>
                <div className="flex items-center gap-2"><Clock3 className="h-3 w-3 text-[var(--primary)]" /> 6:30 PM – 8:00 PM EST</div>
                <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-[var(--primary)]" /> The Loft Studio · Cap. 45</div>
              </div>
              <Link href="/sessions/d97c2f70fafe4c0f906b3f21ffe3907a" className="mt-3 flex items-center justify-between rounded-md bg-[var(--primary)] px-3 py-2 text-[8px] font-semibold text-white">
                Open session brief <ArrowRight className="h-3 w-3" />
              </Link>
            </section>
          ) : null}
          {notice ? (
            <div role="status" className="flex items-start justify-between gap-2 rounded-md bg-[#e5f2eb] px-3 py-2 text-[8px] text-[#386c4d]">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss"><X className="h-3 w-3" /></button>
            </div>
          ) : null}
          <p className="flex items-center gap-1.5 px-1 text-[7px] text-[#867d75]">
            <ArrowLeft className="h-3 w-3" /> Calendar changes are saved to the current cohort.
          </p>
        </aside>
      </div>
    </div>
  );
}
