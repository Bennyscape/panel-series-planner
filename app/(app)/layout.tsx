import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AccountSetupIncomplete } from "@/components/account-setup-incomplete";
import { isUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--background)]" aria-busy="true" />
      }
    >
      <AuthorizedAppLayout>{children}</AuthorizedAppLayout>
    </Suspense>
  );
}

async function AuthorizedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  if (role === "pending") {
    redirect("/waiting");
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
    <AppShell
      userName={profile.name}
      userEmail={profile.email}
      role={role}
    >
      {children}
    </AppShell>
  );
}
