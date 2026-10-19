import { LogOut, ShieldAlert } from "lucide-react";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import { getRoleRedirectPath, isUserRole } from "@/lib/auth";
import { AccountSetupIncomplete } from "@/components/account-setup-incomplete";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default function WaitingPage() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-[var(--background)]"
          aria-busy="true"
        />
      }
    >
      <AuthenticatedWaitingPage />
    </Suspense>
  );
}

async function AuthenticatedWaitingPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=config");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: role, error: roleError } =
    await supabase.rpc("get_my_role");
  if (roleError || !isUserRole(role)) {
    throw new Error(`Unable to determine the signed-in user's role: ${roleError?.message ?? "invalid role"}`);
  }

  if (role !== "pending") {
    redirect(getRoleRedirectPath(role));
  }

  const { error: lastSeenError } = await supabase.rpc("touch_last_seen");
  if (lastSeenError) {
    throw new Error(`Unable to update last-seen time: ${lastSeenError.message}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name,email")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Unable to load the signed-in user's profile:",
      profileError.code,
      profileError.message,
    );
    throw new Error(
      `Unable to load the signed-in user's profile: ${profileError.code} ${profileError.message}`,
    );
  }

  if (!profile) {
    console.error(
      "Account setup incomplete: no profile row for signed-in user",
      user.id,
    );
    return <AccountSetupIncomplete />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
      <div className="w-full max-w-lg rounded-[var(--radius-card)] border border-[var(--border)] bg-white p-6 shadow-[0_16px_40px_rgba(29,27,25,0.06)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fef0cf] text-[#9a691a]">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Access pending</div>
            <div className="font-serif text-2xl text-[var(--text)]">Waiting for approval</div>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-[var(--muted)]">
          Your email is confirmed and your request is in review. We’ll notify you when an admin approves your workspace access.
        </p>

        <div className="mt-6 rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text)]">
          Signed in as <span className="font-semibold">{profile.name}</span>
          <div className="mt-1 text-[var(--muted)]">{profile.email}</div>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}
