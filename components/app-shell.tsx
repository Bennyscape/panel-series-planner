"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mic2,
  NotebookTabs,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/topics", label: "Topics Bank", icon: NotebookTabs },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/sessions", label: "Sessions List", icon: Mic2 },
];

function isActivePath(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({
  pathname,
  mobile = false,
}: {
  pathname: string;
  mobile?: boolean;
}) {
  return navItems.map(({ href, label, icon: Icon }) => {
    const active = isActivePath(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          mobile
            ? "flex flex-col items-center gap-1 rounded-md py-1.5 text-[9px] font-medium"
            : "flex h-9 items-center gap-3 rounded-md px-3 text-[12px] font-medium transition-colors",
          active
            ? "bg-[#f7f1ed] text-[var(--primary)]"
            : mobile
              ? "text-[var(--muted)]"
              : "text-[#625d58] hover:bg-[#faf6f3] hover:text-[var(--text)]",
        )}
      >
        <Icon className={mobile ? "h-4 w-4" : "h-4 w-4 shrink-0"} strokeWidth={1.8} />
        {mobile ? label.replace(" ", "\u00a0") : label}
      </Link>
    );
  });
}

function CurrentNavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} mobile={mobile} />;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[var(--sidebar-width)] flex-col border-r border-[var(--border)] bg-white lg:flex">
        <Link
          href="/dashboard"
          className="flex h-[76px] items-center gap-3 border-b border-[var(--border)] px-6"
        >
          <Image
            src="/stitch/emblem.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="min-w-0">
            <span className="block font-serif text-[17px] leading-5 text-[var(--text)]">
              Series Planner
            </span>
            <span className="mt-0.5 block text-[8px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
              Coordinator Studio
            </span>
          </span>
        </Link>

        <div className="px-5 pb-2 pt-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8b8580]">
          Curation
        </div>
        <nav aria-label="Main navigation" className="space-y-1 px-2.5">
          <Suspense fallback={<NavLinks pathname="" />}>
            <CurrentNavLinks />
          </Suspense>
        </nav>

        <div className="mt-auto border-t border-[var(--border)] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/stitch/profile.jpg"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-[var(--text)]">
                Elena Rostova
              </div>
              <div className="truncate text-[9px] text-[var(--muted)]">
                Series Curator
              </div>
            </div>
            <button
              type="button"
              aria-label="Sign out"
              className="rounded p-1.5 text-[var(--muted)] hover:bg-[var(--surface)]"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[var(--sidebar-width)]">
        <header className="sticky top-0 z-30 flex h-[var(--topbar-height)] items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 text-[10px]">
            <Link
              href="/dashboard"
              className="hidden shrink-0 font-semibold uppercase tracking-[0.08em] text-[#77716c] sm:inline"
            >
              Panel Series Studio
            </Link>
            <ChevronRight className="hidden h-3 w-3 shrink-0 text-[#a39c96] sm:block" />
            <span className="truncate font-medium text-[var(--text)]">
              Young Adult Discourse Cohort
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <span className="hidden items-center gap-1.5 text-[9px] font-medium text-[#5e625b] md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#28704f]" />
              Fall 2024 Season Active
            </span>
            <button
              type="button"
              aria-label="Open curator tools"
              className="hidden h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] bg-white text-[var(--primary)] sm:flex"
            >
              <NotebookTabs className="h-3.5 w-3.5" />
            </button>
            <Image
              src="/stitch/profile.jpg"
              alt="Elena Rostova"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-white"
            />
          </div>
        </header>

        <main className="min-h-[calc(100vh-var(--topbar-height))] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
          <div className="mx-auto max-w-[1480px]">{children}</div>
        </main>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--border)] bg-white px-1 py-1.5 lg:hidden"
      >
        <Suspense fallback={<NavLinks pathname="" mobile />}>
          <CurrentNavLinks mobile />
        </Suspense>
      </nav>
    </div>
  );
}
