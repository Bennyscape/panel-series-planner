import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panel Series Planner",
  description: "Plan a recurring panel series with themes, session briefs, and notes in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[var(--background)] text-[var(--text)]">{children}</body>
    </html>
  );
}
