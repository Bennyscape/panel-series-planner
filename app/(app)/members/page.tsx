import { redirect } from "next/navigation";
import { MembersList, type MemberProfile } from "@/components/members/members-list";
import { createClient } from "@/lib/supabase/server";

export default async function MembersPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Unable to verify access to the Members page:", userError.message);
    throw new Error(`Unable to verify access to the Members page: ${userError.message}`);
  }

  if (!user) {
    redirect("/login");
  }

  const { data: role, error: roleError } = await supabase.rpc("get_my_role");
  if (roleError) {
    console.error("Unable to verify the Members page role:", roleError.message);
    throw new Error(`Unable to verify the Members page role: ${roleError.message}`);
  }

  if (role !== "admin") {
    redirect("/home");
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id,name,email,role,created_at,last_seen_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Unable to load member profiles:", profilesError);
    throw new Error(`Unable to load member profiles: ${profilesError.message}`);
  }

  const { data: emailStatuses, error: emailStatusesError } = await supabase.rpc(
    "get_member_email_confirmation",
  );

  if (emailStatusesError) {
    console.error("Unable to load member email confirmation status:", emailStatusesError);
    throw new Error(
      `Unable to load member email confirmation status: ${emailStatusesError.message}`,
    );
  }

  const confirmedById = new Map<string, boolean>();
  for (const status of emailStatuses ?? []) {
    if (
      typeof status.user_id !== "string" ||
      typeof status.email_confirmed !== "boolean"
    ) {
      throw new Error("The email confirmation function returned an invalid result.");
    }
    confirmedById.set(status.user_id, status.email_confirmed);
  }

  const members: MemberProfile[] = (profiles ?? []).map((profile) => {
    const emailConfirmed = confirmedById.get(profile.id);
    if (emailConfirmed === undefined) {
      throw new Error(`Email confirmation status is missing for profile ${profile.id}.`);
    }

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      emailConfirmed,
      createdAt: profile.created_at,
      lastSeenAt: profile.last_seen_at,
    };
  });

  return (
    <div className="space-y-5">
      <header className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
        <div className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
          Admin workspace
        </div>
        <h1 className="mt-1 font-serif text-[32px] text-[var(--text)]">Members</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
          Review access requests and manage everyone in the panel series.
        </p>
      </header>

      <MembersList members={members} />
    </div>
  );
}
