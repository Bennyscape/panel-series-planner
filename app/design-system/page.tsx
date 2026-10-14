import { CalendarDays, CheckCircle2, CircleDashed, Layers3, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { ThemeTag } from "@/components/ui/theme-tag";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toaster } from "@/components/ui/toaster";

type ThemeToken = {
  name: string;
  value: string;
  usage: string;
};

const tokens: ThemeToken[] = [
  { name: "Background", value: "#FAF8F5", usage: "App background" },
  { name: "Card", value: "#FFFFFF", usage: "Cards and panels" },
  { name: "Text", value: "#1F1D1B", usage: "Primary text" },
  { name: "Muted", value: "#6B665F", usage: "Secondary text" },
  { name: "Border", value: "#E7E2DB", usage: "Dividers and borders" },
  { name: "Primary", value: "#0F766E", usage: "Accent and active states" },
  { name: "Destructive", value: "#B42318", usage: "Delete actions" },
];

const themeColors = [
  { name: "Terracotta", value: "terracotta" },
  { name: "Ochre", value: "ochre" },
  { name: "Sage", value: "sage" },
  { name: "Sky", value: "sky" },
  { name: "Plum", value: "plum" },
  { name: "Rose", value: "rose" },
];

export default function DesignSystemPage() {
  return (
    <main className="bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <PageHeader
          title="Design system"
          description="Tokens, shared styles, and reusable UI patterns for Panel Series Planner."
          action={<button className="rounded-[var(--radius-input)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Primary action</button>}
        />

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Color tokens</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tokens.map((token) => (
              <div key={token.name} className="rounded-[var(--radius-card)] border border-[var(--border)] p-4">
                <div className="mb-3 h-12 rounded-[8px] border border-[var(--border)]" style={{ background: token.value }} />
                <div className="text-sm font-medium text-[var(--text)]">{token.name}</div>
                <div className="text-xs text-[var(--muted)]">{token.value}</div>
                <div className="mt-2 text-xs text-[var(--muted)]">{token.usage}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Theme colors</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {themeColors.map((theme) => (
              <ThemeTag key={theme.value} label={theme.name} color={theme.value} />
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Status badges</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge status="idea" />
            <StatusBadge status="scheduled" />
            <StatusBadge status="done" />
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Buttons & controls</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-[var(--radius-input)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Primary</button>
            <button className="rounded-[var(--radius-input)] border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Secondary</button>
            <button className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2">Muted</button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-3xl text-[var(--text)]">Empty state</h2>
            <div className="mt-6">
              <EmptyState
                icon={<CalendarDays className="h-5 w-5" />}
                title="No sessions yet"
                description="Start by adding a topic and scheduling it onto the calendar."
                action={<button className="rounded-[var(--radius-input)] bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white">Create first session</button>}
              />
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="font-serif text-3xl text-[var(--text)]">Confirm dialog</h2>
            <div className="mt-6">
              <ConfirmDialog
                open={true}
                title="Delete theme"
                description="This theme is currently in use. Remove it only after reassigning those topics."
                confirmLabel="Delete"
                cancelLabel="Keep"
                onConfirm={() => {}}
                onCancel={() => {}}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Sample content</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-[var(--radius-card)] border border-[var(--border)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]">
              <div className="flex items-center justify-between gap-3">
                <ThemeTag label="Community" color="sage" />
                <StatusBadge status="scheduled" />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[var(--text)]">What makes a good community?</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">A practical conversation about belonging, responsibility, and everyday acts of care across different age groups.</p>
            </article>
            <article className="rounded-[var(--radius-card)] border border-[var(--border)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]">
              <div className="flex items-center justify-between gap-3">
                <ThemeTag label="Identity" color="plum" />
                <StatusBadge status="idea" />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[var(--text)]">Finding your voice</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">Exploring confidence, self-expression and the pressure to fit the values of the people around us.</p>
            </article>
            <article className="rounded-[var(--radius-card)] border border-[var(--border)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--primary)]">
              <div className="flex items-center justify-between gap-3">
                <ThemeTag label="Money" color="terracotta" />
                <StatusBadge status="done" />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[var(--text)]">Money stress and trust</h3>
              <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">A candid discussion about budgeting, pressure, and the emotional side of financial decision-making.</p>
            </article>
          </div>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-serif text-3xl text-[var(--text)]">Typography</h2>
          <div className="mt-6 space-y-4 text-[var(--text)]">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Serif heading</p>
              <h3 className="mt-2 font-serif text-4xl">Fraunces</h3>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Body copy</p>
              <p className="mt-2 text-base text-[var(--text)]">Inter</p>
            </div>
          </div>
        </section>
      </div>
      <Toaster />
    </main>
  );
}
