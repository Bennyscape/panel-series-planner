"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  CircleCheck,
  FileText,
  MoreHorizontal,
  Pencil,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
  UsersRound,
} from "lucide-react";

export function SessionDetailClient({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<"Brief" | "Notes & Debrief">("Brief");
  const [notice, setNotice] = useState("");

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[9px]">
        <div className="flex items-center gap-2 text-[#77716b]">
          <Link href="/sessions" className="hover:text-[var(--primary)]">
            Sessions
          </Link>
          <span>/</span>
          <span className="text-[#b1a9a2]">Upcoming</span>
          <span>/</span>
          <span className="max-w-[240px] truncate font-medium text-[var(--text)]">
            Workplace Boundaries &amp; Quiet Quitting {id}
          </span>
        </div>
        <span className="rounded-full bg-[#f4eee9] px-2.5 py-1 text-[8px] font-medium text-[#766e67]">
          Curator Draft v2.4
        </span>
      </div>

      <header className="flex flex-col justify-between gap-4 border-b border-[var(--border)] pb-4 xl:flex-row xl:items-end">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f8e6dc] px-2 py-1 text-[8px] font-semibold text-[#9a4c31]">
              <span className="h-1 w-1 rounded-full bg-[#c65d4e]" />
              Career &amp; Purpose
            </span>
            <span className="text-[8px] text-[#817970]">Cohort 04 · Fall/Spring Series</span>
          </div>
          <h1 className="max-w-4xl font-serif text-[30px] leading-[1.05] sm:text-[36px]">
            Workplace Boundaries &amp; Quiet Quitting
          </h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-[#6f6963]">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#a75a3e]">◷</span>
              Friday, March 14, 2025 · 6:30 PM – 8:00 PM
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#a75a3e]">⌖</span>
              Downtown Community Center (Hall A)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersRound className="h-3 w-3 text-[#a75a3e]" />
              45 registered <span className="text-[#9a928b]">(Capacity 50)</span>
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-[9px] font-semibold hover:bg-[var(--surface)]"
          >
            <Printer className="h-3.5 w-3.5" /> Export PDF
          </button>
          <button
            type="button"
            onClick={() => setNotice("Brief regenerated from the latest session notes.")}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-3 text-[9px] font-semibold text-white hover:bg-[#004b45]"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Regenerate brief
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--border)]">
        {(["Brief", "Notes & Debrief"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative px-3 py-2.5 text-[9px] font-semibold ${
              activeTab === tab ? "text-[var(--primary)]" : "text-[#817a73] hover:text-[var(--text)]"
            }`}
          >
            {tab}
            {activeTab === tab ? (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--primary)]" />
            ) : null}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setNotice("All 3 panelists have confirmed.")}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[9px] font-medium text-[#817a73] hover:text-[var(--text)]"
        >
          <UsersRound className="h-3 w-3" /> Confirmed Panelists <span className="text-[#a34d34]">3</span>
        </button>
      </div>

      {notice ? (
        <div role="status" className="flex items-center justify-between rounded-md bg-[#e6f3ed] px-3 py-2 text-[9px] text-[#356d4a]">
          <span className="inline-flex items-center gap-1.5"><CircleCheck className="h-3.5 w-3.5" />{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><MoreHorizontal className="h-4 w-4" /></button>
        </div>
      ) : null}

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <main className="min-w-0 rounded-lg border border-[var(--border)] bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#56514b]">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e5f2ee] text-[var(--primary)]">
                <FileText className="h-3.5 w-3.5" />
              </span>
              {activeTab === "Brief" ? "Young Adult Dialogue Kit · Discussion Architecture" : "Session Notes & Debrief"}
            </div>
            <span className="text-[8px] text-[#8a817a]">Doc Ref: YA-2025-03B</span>
          </div>

          {activeTab === "Brief" ? (
            <div className="space-y-3 pt-3">
              <section className="rounded-md border border-[#eae3de] bg-[#fcf9f6] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff1ec] text-[9px] text-[var(--primary)]">1</span>
                    Opening Provocation
                  </h2>
                  <button type="button" onClick={() => setNotice("Opening provocation is ready to edit.")} className="inline-flex items-center gap-1 text-[8px] font-medium text-[var(--primary)]">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <blockquote className="border-l-2 border-[#d88c66] pl-3 font-serif text-[14px] italic leading-5 text-[#322b26]">
                  “When did setting reasonable limits on work become framed as an act of quiet rebellion rather than basic self-preservation?”
                </blockquote>
                <p className="mt-2 text-[8px] leading-4 text-[#7d746d]">
                  Target timing: First 10 minutes · Recommended format: Open room response via silent index cards or rapid round.
                </p>
              </section>

              <section className="rounded-md border border-[#eae3de] bg-[#fcf9f6] p-3">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff1ec] text-[9px] text-[var(--primary)]">2</span>
                    Guided Discussion Prompts
                  </h2>
                  <span className="text-[8px] text-[#867d76]">3 Sequence Prompts</span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      letter: "A.",
                      prompt: "What is the psychological difference between healthy disengagement and cynical withdrawal from one’s team?",
                      focus: "Emotional Boundaries",
                      time: "15 min slot",
                    },
                    {
                      letter: "B.",
                      prompt: "How do remote and hybrid arrangements blur spatial and temporal boundaries that previously guarded rest?",
                      focus: "Physical / Digital Overlap",
                      time: "15 min slot",
                    },
                    {
                      letter: "C.",
                      prompt: "Can early-career workers afford to set hard boundaries without sacrificing mentorship and career advancement?",
                      focus: "Power Dynamics & Equity",
                      time: "20 min slot",
                    },
                  ].map((item) => (
                    <div key={item.letter} className="rounded-md border border-[#eee7e2] bg-white px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-[9px] font-bold text-[var(--primary)]">{item.letter}</span>
                        <p className="flex-1 text-[9px] leading-4 text-[#49433e]">{item.prompt}</p>
                        <button type="button" aria-label={`Edit prompt ${item.letter}`} onClick={() => setNotice(`Prompt ${item.letter} is ready to edit.`)} className="text-[#8b8179]">
                          <Pencil className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap justify-between gap-2 pl-4 text-[8px] text-[#827971]">
                        <span>Focus: <strong className="font-medium text-[#5f5851]">{item.focus}</strong></span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-md border border-[#eadfd7] bg-[#fdf5ef] p-3">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fae5d8] text-[9px] text-[#a64c2d]">3</span>
                  Tension &amp; Counterpoint
                </div>
                <p className="font-serif text-[12px] italic leading-[1.55] text-[#443630]">
                  “Is ‘quiet quitting’ merely an inevitable corrective to decades of unpaid overtime, or does it risk hollowing out vocational pride and genuine craft?”
                </p>
                <p className="mt-2 text-[8px] leading-4 text-[#85746a]">
                  Curator note: Encourage speakers not to settle for an easy dichotomy between burnout and apathy.
                </p>
              </section>

              <section className="rounded-md border border-[#eae3de] bg-[#fcf9f6] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[10px] font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#dff1ec] text-[9px] text-[var(--primary)]">4</span>
                    Closing Reflection &amp; Takeaway
                  </h2>
                  <button type="button" onClick={() => setNotice("Closing reflection is ready to edit.")} className="inline-flex items-center gap-1 text-[8px] font-medium text-[var(--primary)]">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                </div>
                <div className="rounded-md bg-white px-3 py-2.5">
                  <div className="text-[9px] font-semibold">5-Minute Paired Exercise</div>
                  <p className="mt-1 text-[8px] leading-4 text-[#6f6862]">
                    Have attendees write down one non-negotiable boundary they will enforce next Monday and share it aloud with their immediate neighbor. Provide blank takeaway commitment cards from the welcome table.
                  </p>
                </div>
              </section>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[8px] text-[#898078]">
                <span className="inline-flex items-center gap-1"><Sparkles className="h-3 w-3 text-[var(--primary)]" /> Generated via Cohort Engine v3</span>
                <span>Last saved 14 mins ago</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <h2 className="font-serif text-xl">Coordinator notes</h2>
              <textarea
                aria-label="Session notes"
                defaultValue="Welcome guests at 6:10 PM. Keep the opening round to one minute per speaker and save ten minutes for audience questions."
                className="min-h-40 w-full rounded-md border border-[var(--border)] bg-[#fcf9f6] p-3 text-[10px] leading-5 outline-none focus:border-[var(--primary)]"
              />
              <button type="button" onClick={() => setNotice("Notes saved.")} className="rounded-md bg-[var(--primary)] px-3 py-2 text-[9px] font-semibold text-white">Save notes</button>
            </div>
          )}
        </main>

        <aside className="space-y-3">
          <section className="rounded-lg border border-[var(--border)] bg-white p-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold">Confirmed Panelists</h2>
              <span className="text-[8px] font-medium text-[var(--muted)]">No panelists listed</span>
            </div>
            <div className="mt-3 rounded-md bg-[var(--surface)] p-3 text-[8px] leading-4 text-[var(--muted)]">
              Panelist details will appear here when they are added to this session.
            </div>
            <button type="button" className="mt-3 w-full rounded-md border border-[var(--border)] py-2 text-[8px] font-semibold text-[#615a54] hover:bg-[var(--surface)]">
              Manage panelists
            </button>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-white p-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold">Readiness Score</h2>
              <span className="text-[12px] font-bold text-[#28694b]">92%</span>
            </div>
            <p className="mt-1 text-[8px] leading-4 text-[#777069]">
              Brief approved by co-moderator. Microphones and recording deck reserved.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-10 w-10 rounded-full" style={{ background: "conic-gradient(#2d7654 0 92%, #e6ede8 92% 100%)" }}>
                <div className="absolute inset-[4px] rounded-full bg-white" />
              </div>
              <div className="space-y-1 text-[8px] text-[#756d66]">
                <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#2d7654]" />Panelists confirmed</div>
                <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#6796a3]" />Venue &amp; AV reserved</div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-white p-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-semibold">Curator Diagnostic</h2>
              <button type="button" aria-label="Diagnostic options" className="text-[#8c837b]"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
            <p className="mt-1 text-[8px] leading-4 text-[#7f766f]">Simulate background stressors and generate cohesion score.</p>
            <button type="button" onClick={() => setNotice("Preview generation has been queued.")} className="mt-3 flex w-full items-center justify-between rounded-md border border-[var(--border)] px-2.5 py-2 text-[8px] font-semibold text-[#5e5751] hover:bg-[var(--surface)]">
              Preview Generation Scenario <ChevronDown className="h-3 w-3" />
            </button>
            <button type="button" onClick={() => setNotice("This session is protected from accidental deletion.")} className="mt-2 flex w-full items-center gap-1.5 text-left text-[8px] font-semibold text-[#a63f35]">
              <Trash2 className="h-3 w-3" /> Delete Session Brief
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
