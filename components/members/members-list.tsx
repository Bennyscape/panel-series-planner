"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { changeMemberRole, type MemberRoleChange } from "@/app/(app)/members/actions";
import type { UserRole } from "@/lib/auth";

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailConfirmed: boolean;
  createdAt: string;
  lastSeenAt: string | null;
};

type ConfirmableChange = Exclude<MemberRoleChange, "approve">;

const groups: { role: UserRole; title: string }[] = [
  { role: "pending", title: "Pending" },
  { role: "member", title: "Members" },
  { role: "admin", title: "Admins" },
];

const roleLabels: Record<UserRole, string> = {
  pending: "Pending",
  member: "Member",
  admin: "Admin",
};

const confirmationDetails: Record<
  ConfirmableChange,
  { title: string; confirmLabel: string; describe: (name: string) => string }
> = {
  promote: {
    title: "Promote to admin?",
    confirmLabel: "Promote",
    describe: (name) => `Give ${name} admin access to manage the panel series and its members?`,
  },
  remove: {
    title: "Remove member access?",
    confirmLabel: "Remove access",
    describe: (name) => `Return ${name} to pending status? They will lose member access.`,
  },
  demote: {
    title: "Demote admin?",
    confirmLabel: "Demote",
    describe: (name) => `Change ${name}'s role to member and remove their admin access?`,
  },
};

function formatDate(value: string | null): string {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unavailable";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function displayName(name: string, email: string): string {
  return name.trim() || email;
}

export function MembersList({ members }: { members: MemberProfile[] }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState<{
    member: MemberProfile;
    change: ConfirmableChange;
  } | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  async function runChange(member: MemberProfile, change: MemberRoleChange) {
    setWorkingId(member.id);
    setFeedback(null);
    const result = await changeMemberRole(member.id, change);
    setWorkingId(null);
    setFeedback(result);
    if (result.ok) router.refresh();
  }

  return (
    <div className="space-y-5">
      {feedback ? (
        <p
          role={feedback.ok ? "status" : "alert"}
          className={`rounded-[var(--radius-card)] border p-3 text-sm ${
            feedback.ok
              ? "border-[var(--primary)]/20 bg-[var(--primary-soft)] text-[var(--primary)]"
              : "border-[var(--destructive)]/30 bg-[var(--destructive)]/5 text-[var(--destructive)]"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}

      {groups.map(({ role, title }) => {
        const groupMembers = members.filter((member) => member.role === role);

        return (
          <section
            key={role}
            aria-labelledby={`members-${role}-heading`}
            className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--card)]"
          >
            <header className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-4 sm:px-5">
              <h2
                id={`members-${role}-heading`}
                className="font-serif text-2xl text-[var(--text)]"
              >
                {title}
              </h2>
              <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
                {groupMembers.length}
              </span>
            </header>

            {groupMembers.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[var(--muted)] sm:px-5">
                {role === "pending"
                  ? "No one is waiting for approval."
                  : role === "member"
                    ? "There are no approved members yet."
                    : "There are no admins."}
              </p>
            ) : (
              <ul className="divide-y divide-[var(--border)]">
                {groupMembers.map((member) => {
                  const name = displayName(member.name, member.email);
                  const isWorking = workingId === member.id;

                  return (
                    <li key={member.id} className="px-4 py-4 sm:px-5">
                      <article className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate font-semibold text-[var(--text)]">{name}</h3>
                            <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]">
                              {roleLabels[member.role]}
                            </span>
                          </div>
                          <p className="mt-1 break-all text-sm text-[var(--muted)]">
                            {member.email}
                          </p>
                          <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 text-xs sm:grid-cols-4">
                            <div>
                              <dt className="text-[var(--muted)]">Email</dt>
                              <dd
                                className={
                                  member.emailConfirmed
                                    ? "mt-0.5 font-medium text-[var(--primary)]"
                                    : "mt-0.5 font-medium text-[var(--accent)]"
                                }
                              >
                                {member.emailConfirmed ? "Confirmed" : "Not confirmed"}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--muted)]">Joined</dt>
                              <dd className="mt-0.5 font-medium text-[var(--text)]">
                                {formatDate(member.createdAt)}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-[var(--muted)]">Last seen</dt>
                              <dd className="mt-0.5 font-medium text-[var(--text)]">
                                {formatDate(member.lastSeenAt)}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:max-w-[280px] xl:justify-end">
                          {role === "pending" ? (
                            <div className="flex flex-col items-start gap-1">
                              <button
                                type="button"
                                disabled={!member.emailConfirmed || isWorking || workingId !== null}
                                onClick={() => void runChange(member, "approve")}
                                className="rounded-[var(--radius-input)] bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                {isWorking ? "Approving…" : "Approve"}
                              </button>
                              {!member.emailConfirmed ? (
                                <span className="max-w-56 text-xs text-[var(--muted)]">
                                  Confirm email before approval.
                                </span>
                              ) : null}
                            </div>
                          ) : role === "member" ? (
                            <>
                              <button
                                type="button"
                                disabled={workingId !== null}
                                onClick={() => setConfirming({ member, change: "promote" })}
                                className="rounded-[var(--radius-input)] border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--card-alt)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Promote to admin
                              </button>
                              <button
                                type="button"
                                disabled={workingId !== null}
                                onClick={() => setConfirming({ member, change: "remove" })}
                                className="rounded-[var(--radius-input)] border border-[var(--destructive)]/30 px-3 py-2 text-sm font-medium text-[var(--destructive)] transition hover:bg-[var(--destructive)]/5 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Remove access
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              disabled={workingId !== null}
                              onClick={() => setConfirming({ member, change: "demote" })}
                              className="rounded-[var(--radius-input)] border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--card-alt)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Demote to member
                            </button>
                          )}
                        </div>
                      </article>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}

      {confirming ? (
        <ConfirmDialog
          open
          title={confirmationDetails[confirming.change].title}
          description={confirmationDetails[confirming.change].describe(
            displayName(confirming.member.name, confirming.member.email),
          )}
          confirmLabel={confirmationDetails[confirming.change].confirmLabel}
          cancelLabel="Cancel"
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            const { member, change } = confirming;
            setConfirming(null);
            void runChange(member, change);
          }}
        />
      ) : null}
    </div>
  );
}
