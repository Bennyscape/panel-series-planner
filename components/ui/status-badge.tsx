import { cn } from "@/lib/utils";

type Status = "idea" | "scheduled" | "done";

type StatusBadgeProps = {
  status: Status;
  className?: string;
};

const statusStyles: Record<Status, string> = {
  idea: "bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]",
  scheduled: "bg-[#DFF6F3] text-[#0F766E] border-[#B9E5E0]",
  done: "bg-[#E8F8E5] text-[#256F3F] border-[#C9EBC8]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label =
    status === "idea" ? "Idea" : status === "scheduled" ? "Scheduled" : "Done";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        statusStyles[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
