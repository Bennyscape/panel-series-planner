import { cn } from "@/lib/utils";

type ThemeTagProps = {
  label: string;
  color: string;
  className?: string;
};

const themeStyles: Record<string, string> = {
  terracotta: "bg-[#F9E2DB] text-[#6D3D32] border-[#E8C7BC]",
  ochre: "bg-[#F7E9C8] text-[#6E531C] border-[#E3D39D]",
  sage: "bg-[#E3E9DD] text-[#465A3E] border-[#C9D4C0]",
  sky: "bg-[#DDECF7] text-[#3C5C7D] border-[#C4D9EB]",
  plum: "bg-[#E9DFF2] text-[#5A416F] border-[#D7C3E1]",
  rose: "bg-[#F5DDE4] text-[#7A4657] border-[#E7C2CD]",
};

export function ThemeTag({ label, color, className }: ThemeTagProps) {
  const palette = themeStyles[color] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
        palette,
        className,
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-90" />
      {label}
    </span>
  );
}
