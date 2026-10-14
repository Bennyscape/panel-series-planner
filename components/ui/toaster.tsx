import { cn } from "@/lib/utils";

export function Toaster() {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[320px] max-w-[calc(100vw-2rem)] flex-col gap-3" aria-live="polite" aria-atomic="true">
      <div className={cn("rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm") }>
        <p className="text-sm font-medium text-[var(--text)]">Saved</p>
        <p className="text-sm text-[var(--muted)]">Your changes were saved successfully.</p>
      </div>
    </div>
  );
}
