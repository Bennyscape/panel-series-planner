# Panel Series Planner — PRD Addendum

## Roles and access

### FR10 — Roles and sign-up

The application has three roles: `pending`, `member`, and `admin`. Anyone can
sign up with a name, email, and password. New users start as `pending` and can
only see the approval waiting screen. An admin can approve a pending user as a
member, promote a member to admin, or demote an admin to member. The first admin
is configured directly in the database. The last remaining admin cannot be
demoted or removed.

### FR11 — Shared workspace and permissions

All users work in one shared workspace; content is not partitioned by creator.
The database enforces access with row level security (RLS). `user_id` columns
remain as created-by metadata, not as access-control boundaries.

| Area | Pending | Member | Admin |
| --- | --- | --- | --- |
| Calendar and schedule | None | View | View and edit |
| Topic bank and themes | None | View | Full |
| Session briefs | None | View | Full, generate, and edit |
| Session notes and attendance | None | None | Full |
| Dashboard | None | None | View |
| Members page | None | None | Full |

### FR12 — Member experience

Members have a lighter, view-only Home, Calendar, Topics, and Sessions
experience. They can see dates, times, venues, topics, and session briefs. They
cannot see the admin dashboard, notes, attendance, or edit controls.

### FR13 — Members management

An admin-only Members page provides pending requests, a member list, and
approval, decline, promotion, demotion, and removal actions.

### FR14 — Usage metrics

Each profile stores its creation, approval, and last-seen timestamps. The
Members page reports total sign-ups, pending users, members, admins, and members
active in the previous seven days.

## Route map

| Screen | Route | Access |
| --- | --- | --- |
| Login | `/login` | Public |
| Sign up | `/signup` | Public |
| Waiting for approval | `/waiting` | Pending |
| Home | `/home` | Members |
| Calendar | `/calendar` | Members (view only), admins (editable) |
| Topic bank | `/topics` | Members (view only), admins (full access) |
| Sessions list | `/sessions` | Members and admins; role-specific fields |
| Session detail | `/sessions/[id]` | Members (brief only), admins (brief and notes) |
| Access restricted | `/restricted` | Users blocked from a route |
| Members management | `/members` | Admins |

## Security requirement

Permissions must be enforced in the database with row level security and again
in every server action. Hiding a button is never enough.

## Source notes

This addendum records FR10–FR14 and the route and permission tables supplied
with the member-access request. The request refers to design-fidelity criteria
DF1–DF6, but does not include their text; they remain to be supplied before
Phase 10 implementation.
