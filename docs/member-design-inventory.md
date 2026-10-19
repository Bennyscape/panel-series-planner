# Member Design Inventory

## Stitch project audit

Project: **Panel Series Planner** (`10697152772659787722`). The complete
`list_screens` response contains nine screens: the four member designs below
and five existing admin designs. All four member screenshots are desktop
captures (2560 px wide); no member mobile-specific Stitch capture was listed.

Existing admin reference screens in the same Stitch project:

| Admin screen | Stitch screen ID | Route |
| --- | --- | --- |
| Dashboard — Series Overview | `5bdd6e9756e44379bfe78d684a985a19` | `/dashboard` |
| Interactive Planning Calendar | `233f713ce161418bba99bd86d800c90e` | `/calendar` |
| Topic Bank & New Topic Drawer | `d4dfee6aedbe49b5a0063f1c38a0c01b` | `/topics` |
| Session Detail & Editorial Brief | `d97c2f70fafe4c0f906b3f21ffe3907a` | `/sessions/[id]` |
| Sessions Directory | `15a65ac472af41cd987735bc7bf5e44b` | `/sessions` |

| Member screen | Stitch screen ID | Route | Reference files |
| --- | --- | --- | --- |
| Home | `ec560180b4d447cd932696baa36eb420` | `/home` | [HTML](../design/stitch/member/member-home.html) · [PNG](../design/stitch/member/member-home.png) |
| Calendar (view only) | `43ca7c923af24891943fe441315e621d` | `/calendar` | [HTML](../design/stitch/member/member-calendar.html) · [PNG](../design/stitch/member/member-calendar.png) |
| Topic bank (view only) | `cd0b0ceed0a24b139016cc8a59c55c0d` | `/topics` | [HTML](../design/stitch/member/member-topics.html) · [PNG](../design/stitch/member/member-topics.png) |
| Sessions list | `b44111da9f66407d88a84467e8fb9d3e` | `/sessions` | [HTML](../design/stitch/member/member-sessions.html) · [PNG](../design/stitch/member/member-sessions.png) |

| Requested screen | Route | Stitch finding |
| --- | --- | --- |
| Sign up | `/signup` | No screen found |
| Waiting for approval | `/waiting` | No screen found |
| Access restricted | `/restricted` | No screen found |
| Session detail (view only) | `/sessions/[id]` | No member-specific screen found. The project has the existing admin **Session Detail & Editorial Brief** (`d97c2f70fafe4c0f906b3f21ffe3907a`); it includes notes, editing, and admin-only context, so it is not a member design. |
| Members management | `/members` | **No Members management screen exists in the Stitch project.** |

## Member-side differences from the existing admin screens

- **Shared member identity:** a compact four-item Home / Calendar / Topics /
  Sessions navigation, member profile block and badge, and a persistent **View
  only** pill in the top bar. The member header identifies the Member Workspace.
- **Home:** a personalized welcome, cohort and read-only labels, a prominent
  next-session hero with date, time, venue, confirmed speakers, and countdown,
  plus **View session brief** and **Add to my calendar** actions. A chronological
  **Coming up** list surfaces later sessions and brief availability. A curated
  topic strip links to the repository; an unscheduled-explorations empty state
  is also shown.
- **Calendar:** the month grid is paired with **This Month’s Gatherings**.
  Selecting an event opens a read-only popover with its topic, theme, date,
  time, venue, panelists, and **View session brief** action. It has no
  unscheduled-topic drag source or scheduling controls.
- **Topic bank:** status and theme filters remain, but topic cards are
  read-only and show their scheduled date. **Inspect** opens a topic dossier
  drawer with the theme, framing question, session status, scheduled session
  details, reading note, recommended perspective, a read-only indicator, and a
  related-session link where applicable.
- **Sessions:** the member table has Date & Time, Topic Title, Theme, Venue,
  and Dossier/Brief availability. It omits admin Notes and Actions columns.
  Selecting an available dossier opens a read-only brief panel with a PDF
  download action; the page also includes a cohort-preparation protocol.
- **Session detail:** the admin Stitch screen is not a member-safe substitute.
  Per the supplied screen map/requirements, the member version must show only
  the brief in a centered document (maximum width 720 px), with a print action
  and a clear empty state when no brief is available—no Notes tab, speaker
  management, attendance, edit controls, or regeneration action.
- **Auth and access:** sign-up, approval waiting, and restricted-access
  screens are in the route map but have no designs in this Stitch project.
  Waiting should identify the signed-in email and offer sign-out per the
  supplied requirements.

## Existing components and reuse

| Existing surface | Reuse in member mode | Required change or limitation |
| --- | --- | --- |
| [AppShell](../components/app-shell.tsx) | Reuse the responsive shell, branding, profile placement, and mobile navigation structure. | It currently renders the admin identity and admin navigation. It needs role-aware navigation, a member badge, and the View only pill without changing the admin presentation. |
| [ThemeTag](../components/ui/theme-tag.tsx) and [StatusBadge](../components/ui/status-badge.tsx) | Reuse or adapt for shared theme and status labels on cards, calendar items, and session rows. | Confirm the member palette/status vocabulary against the reference; member brief availability uses “Brief available” / “Coming soon.” |
| [PageHeader](../components/ui/page-header.tsx) | Reuse the title/description/action layout where the member header needs it. | The member home hero and view-only header are unique compositions, not just the existing page header. |
| [EmptyState](../components/ui/empty-state.tsx) | Reuse for empty member topic/session results after checking its visual fit. | Home’s unscheduled-explorations state has its own compact cohort-specific treatment. |
| Existing Calendar, Topics, Sessions, and session-detail routes | Keep the same route and shared data model; add explicit role-safe read-only rendering rather than clone whole pages. | The current pages contain admin-only controls and state. Read-only behavior must be enforced by server authorization and data access, not only hidden controls. The member brief must not fetch `session_notes`. |
| [ConfirmDialog](../components/ui/confirm-dialog.tsx) and [Toaster](../components/ui/toaster.tsx) | Admin-only use for later member-management actions. | These are not part of the member browsing experience. |

New focused UI will be needed for the Home hero / coming-up / topic strip,
calendar event popover and This Month list, topic dossier drawer, member dossier
availability panel, view-only session brief and missing-brief state, and
sign-up / waiting / restricted-access screens. An `.ics` download helper is
needed for the Home hero and calendar event popover.

## Visual tokens and responsive considerations

- The member HTML carries the same core theme as the admin references: warm
  surface `#fef8f4`, white cards `#ffffff`, deep teal primary `#005c55`, dark
  surface text `#1d1b19`, and muted outline `#bdc9c6`.
- The member palette uses terracotta / orange accents for themes and emphasis
  (including secondary `#ac3400`, secondary container `#fd6b36`, and warm
  secondary fixed `#ffdbd0`), alongside pale teal/green availability states.
- The editorial serif and Plus Jakarta Sans pairing is consistent with the
  existing app direction. Member screens are visually lighter and more
  information-focused than admin screens: fewer actions, reduced navigation,
  calm status chips, and larger dedicated session/topic reading surfaces.
- Reference screen canvases: Home 2560×3180; Calendar 2560×2048; Topics
  2560×2048; Sessions 2560×2096. These are desktop-only captures. Phase 10
  still needs responsive checks at desktop and mobile widths; do not interpret
  the absence of mobile Stitch captures as proof of mobile fidelity.

## Phase 9–11 implementation plan

### Phase 9 — Roles, shared workspace, and permissions

- [ ] Before schema changes, use a Supabase backup/development branch; inspect
  existing migrations and policies. This checkout currently has no
  `supabase/migrations` directory or Supabase client dependency/configuration.
- [ ] Confirm the email for the first admin before assigning the initial
  administrator in the database.
- [ ] Add `profiles`, auth-user profile creation/backfill, shared-workspace
  seed, `current_user_role()` with fixed `search_path`, and admin-count
  protection in a migration.
- [ ] Replace per-user policies with the supplied role matrix; ensure members
  cannot select `session_notes` or mutate any shared content.
- [ ] Add role lookup, minimum-role checks, action authorization, route
  middleware, role-based post-login redirects, and rate-limited `last_seen_at`
  updates. Require admin access for `/api/brief`.
- [ ] Add integration tests for pending, member, and admin database access,
  including self-role escalation and the last-admin guard.
- [ ] Verify direct URL, API, and server-action access for each role. Commit on
  `phase-9-roles-permissions` and stop for approval.

### Phase 10 — Member screens

- [ ] Re-fetch each member Stitch screen immediately before implementation.
  Re-read FR12 and the requested DF1–DF6 criteria; those DF criteria were not
  included in the supplied PRD addendum and must be provided before this phase.
- [ ] Add `/signup`, `/waiting`, `/restricted`, and `/home`; implement the
  Next-session hero, countdown, `.ics` download, Coming up list, topic strip,
  and required empty/loading/error states.
- [ ] Make the shared shell role-aware while preserving the admin rendering;
  give members only Home, Calendar, Topics, and Sessions, with the member
  identity and View only treatment.
- [ ] Add read-only calendar event details and This Month list; remove
  scheduling and drag/drop from member access.
- [ ] Add read-only topic cards and topic dossier drawer; remove topic
  creation, edit/menu, and scheduling controls from member access.
- [ ] Add the role-specific sessions list and brief availability; omit notes
  and attendance data entirely from member requests.
- [ ] Add the member-only session brief, missing-brief state, and print route;
  do not query `session_notes` for a member request.
- [ ] Compare each screen at desktop and mobile widths, test keyboard and
  contrast, and verify as both member and admin. Commit on
  `phase-10-member-ui` and stop for approval.

### Phase 11 — Members management, metrics, and final audit

- [ ] Recheck Stitch for Members management. It is absent from the current
  project; do not represent the page as Stitch-designed. If implementation is
  approved, record the design deviation.
- [ ] Add the admin-only Members page, pending request actions, search and role
  filter, member actions, destructive-action confirms, and the five requested
  usage metrics.
- [ ] Protect every management operation with an admin-checked server action;
  provide clear handling for attempts to demote or remove the final admin.
- [ ] Add a pending-count Members navigation item without changing the member
  navigation.
- [ ] Complete role-based, responsive, accessibility, and security checks;
  update README and PRD, run lint/type-check/tests/build, and fix issues found.
  Commit on `phase-11-members-admin` and stop for approval.

## Current repository prerequisites / notes

The current app has the admin routes and UI components listed above, but this
checkout contains no `supabase/migrations` directory, Supabase client
dependency, or `docs/PRD.md` before this inventory. Phase 9 therefore begins by
confirming the intended Supabase project/environment and reviewing its actual
schema/policies in a safe branch; do not assume a production schema from this
UI-only checkout. This inventory records the supplied PRD addendum in
[PRD.md](./PRD.md); design criteria DF1–DF6 were not part of the provided text.
