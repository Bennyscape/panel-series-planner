export default function MembersPage() {
  return (
    <div className="space-y-5">
      <header className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5">
        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Admin workspace</div>
        <h1 className="mt-1 font-serif text-[32px] text-[var(--text)]">Members</h1>
      </header>

      <section className="rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-5">
        <div className="text-sm text-[var(--muted)]">
          This is the stub for the member-management page described in the PRD addendum. It will later include approval, metrics, role changes, and removal safeguards.
        </div>
      </section>
    </div>
  );
}
