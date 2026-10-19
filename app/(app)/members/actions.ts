"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/auth";

export type MemberRoleChange = "approve" | "promote" | "remove" | "demote";

type ActionResult = {
  ok: boolean;
  message: string;
};

const roleChanges: Record<
  MemberRoleChange,
  { currentRole: UserRole; nextRole: UserRole; successMessage: string }
> = {
  approve: {
    currentRole: "pending",
    nextRole: "member",
    successMessage: "Member approved.",
  },
  promote: {
    currentRole: "member",
    nextRole: "admin",
    successMessage: "Member promoted to admin.",
  },
  remove: {
    currentRole: "member",
    nextRole: "pending",
    successMessage: "Member access removed.",
  },
  demote: {
    currentRole: "admin",
    nextRole: "member",
    successMessage: "Admin demoted to member.",
  },
};

export async function changeMemberRole(
  profileId: string,
  change: MemberRoleChange,
): Promise<ActionResult> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(profileId)) {
    return { ok: false, message: "Unable to identify this account. Refresh and try again." };
  }

  if (!Object.hasOwn(roleChanges, change)) {
    return { ok: false, message: "This access change is not supported." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Unable to verify member-management action user:", userError.message);
    return { ok: false, message: "Unable to verify your access. Please try again." };
  }

  if (!user) {
    return { ok: false, message: "Please sign in again to manage member access." };
  }

  const { data: role, error: roleError } = await supabase.rpc("get_my_role");
  if (roleError) {
    console.error("Unable to verify member-management action role:", roleError.message);
    return { ok: false, message: "Unable to verify your admin access. Please try again." };
  }

  if (role !== "admin") {
    return { ok: false, message: "Only admins can manage member access." };
  }

  const { currentRole, nextRole, successMessage } = roleChanges[change];
  const { data, error } = await supabase
    .from("profiles")
    .update({ role: nextRole })
    .eq("id", profileId)
    .eq("role", currentRole)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Database rejected a member role change:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    if (error.message.toLowerCase().includes("last admin")) {
      return { ok: false, message: "The last admin cannot be demoted." };
    }
    if (error.message.toLowerCase().includes("confirm their email")) {
      return { ok: false, message: "This person must confirm their email before approval." };
    }
    if (error.code === "42501") {
      return { ok: false, message: "Your admin access changed. Refresh and try again." };
    }

    return {
      ok: false,
      message: "The database could not update this person's access. Please try again.",
    };
  }

  if (!data) {
    return {
      ok: false,
      message: "This person's access has changed. Refresh the page and try again.",
    };
  }

  revalidatePath("/members");
  return { ok: true, message: successMessage };
}
