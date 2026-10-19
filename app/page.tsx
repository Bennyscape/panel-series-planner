import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getRoleRedirectPath, isUserRole } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export default function Home() {
  return (
    <Suspense
      fallback={
        <main
          className="min-h-screen bg-[var(--background)]"
          aria-busy="true"
        />
      }
    >
      <RedirectByRole />
    </Suspense>
  );
}

async function RedirectByRole(): Promise<never> {
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

  const { data: role, error } = await supabase.rpc("get_my_role");
  if (error || !isUserRole(role)) {
    throw new Error(`Unable to determine the signed-in user's role: ${error?.message ?? "invalid role"}`);
  }

  redirect(getRoleRedirectPath(role));
}
