create type public.app_role as enum ('pending', 'member', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  email text not null unique,
  avatar_url text,
  role public.app_role not null default 'pending',
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  last_seen_at timestamptz
);

create function public.get_my_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.role from public.profiles as p where p.id = auth.uid()),
    'pending'::public.app_role
  );
$$;

revoke all on function public.get_my_role() from public, anon;
grant execute on function public.get_my_role() to authenticated;

create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Member'
    ),
    lower(new.email)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

create function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set email = lower(new.email)
  where id = new.id;

  return new;
end;
$$;

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row
when (old.email is distinct from new.email)
execute function public.sync_profile_email();
revoke all on function public.sync_profile_email() from public, anon, authenticated;

create function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'pending'::public.app_role
     and new.role in ('member'::public.app_role, 'admin'::public.app_role)
     and not exists (
       select 1
       from auth.users as u
       where u.id = old.id
         and u.email_confirmed_at is not null
     ) then
    raise exception 'The user must confirm their email before approval'
      using errcode = '23514';
  end if;

  if new.role is distinct from old.role
     and auth.uid() is not null
     and public.get_my_role() is distinct from 'admin'::public.app_role then
    raise exception 'Only admins can change profile roles'
      using errcode = '42501';
  end if;

  if old.role = 'pending'::public.app_role
     and new.role in ('member'::public.app_role, 'admin'::public.app_role) then
    new.approved_at := coalesce(new.approved_at, now());
  end if;

  return new;
end;
$$;

create trigger guard_profile_role_change
before update on public.profiles
for each row execute function public.guard_profile_role_change();
revoke all on function public.guard_profile_role_change() from public, anon, authenticated;

create function public.protect_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  admin_count bigint;
begin
  if old.role = 'admin'::public.app_role
     and (tg_op = 'DELETE' or new.role is distinct from 'admin'::public.app_role) then
    perform p.id
    from public.profiles as p
    where p.role = 'admin'::public.app_role
    order by p.id
    for update;

    select count(*)
    into admin_count
    from public.profiles as p
    where p.role = 'admin'::public.app_role;

    if admin_count <= 1 then
      raise exception 'The last admin cannot be demoted or removed'
        using errcode = '23514';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

create trigger protect_last_admin_on_update
before update of role on public.profiles
for each row execute function public.protect_last_admin();

create trigger protect_last_admin_on_delete
before delete on public.profiles
for each row execute function public.protect_last_admin();
revoke all on function public.protect_last_admin() from public, anon, authenticated;

create function public.touch_last_seen()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set last_seen_at = now()
  where id = auth.uid()
    and (
      last_seen_at is null
      or last_seen_at < (
        date_trunc('day', now() at time zone 'UTC') at time zone 'UTC'
      )
    );
end;
$$;

revoke all on function public.touch_last_seen() from public, anon;
grant execute on function public.touch_last_seen() to authenticated;

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  color text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid references public.themes(id) on delete set null,
  title text not null,
  framing_question text,
  intended_audience text,
  format text,
  status text not null default 'idea'
    check (status in ('idea', 'scheduled', 'done')),
  reading_note text,
  recommended_perspective text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.topics(id) on delete set null,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index sessions_starts_at_idx on public.sessions (starts_at);
create index topics_theme_id_idx on public.topics (theme_id);

create table public.session_panelists (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  name text not null,
  role_title text,
  organization text,
  is_confirmed boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index session_panelists_session_id_idx
  on public.session_panelists (session_id, sort_order);

create table public.session_briefs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.sessions(id) on delete cascade,
  body_markdown text not null default '',
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.session_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index session_notes_session_id_idx on public.session_notes (session_id);

create table public.session_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  is_present boolean not null default false,
  recorded_by uuid references public.profiles(id) on delete set null,
  recorded_at timestamptz not null default now(),
  unique (session_id, profile_id)
);

create index session_attendance_profile_id_idx
  on public.session_attendance (profile_id);

alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.topics enable row level security;
alter table public.sessions enable row level security;
alter table public.session_panelists enable row level security;
alter table public.session_briefs enable row level security;
alter table public.session_notes enable row level security;
alter table public.session_attendance enable row level security;

create policy profiles_select_self_or_admin
on public.profiles for select to authenticated
using (
  (auth.uid() = id and public.get_my_role() in (
    'pending'::public.app_role,
    'member'::public.app_role,
    'admin'::public.app_role
  ))
  or public.get_my_role() = 'admin'::public.app_role
);

create policy profiles_update_self_or_admin
on public.profiles for update to authenticated
using (
  auth.uid() = id
  or public.get_my_role() = 'admin'::public.app_role
)
with check (
  auth.uid() = id
  or public.get_my_role() = 'admin'::public.app_role
);

create policy themes_member_read
on public.themes for select to authenticated
using (public.get_my_role() in ('member'::public.app_role, 'admin'::public.app_role));
create policy themes_admin_write
on public.themes for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy topics_member_read
on public.topics for select to authenticated
using (public.get_my_role() in ('member'::public.app_role, 'admin'::public.app_role));
create policy topics_admin_write
on public.topics for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy sessions_member_read
on public.sessions for select to authenticated
using (public.get_my_role() in ('member'::public.app_role, 'admin'::public.app_role));
create policy sessions_admin_write
on public.sessions for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy session_panelists_member_read
on public.session_panelists for select to authenticated
using (public.get_my_role() in ('member'::public.app_role, 'admin'::public.app_role));
create policy session_panelists_admin_write
on public.session_panelists for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy session_briefs_member_read_published
on public.session_briefs for select to authenticated
using (
  public.get_my_role() = 'admin'::public.app_role
  or (
    public.get_my_role() = 'member'::public.app_role
    and published_at is not null
  )
);
create policy session_briefs_admin_write
on public.session_briefs for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy session_notes_admin_only
on public.session_notes for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

create policy session_attendance_admin_only
on public.session_attendance for all to authenticated
using (public.get_my_role() = 'admin'::public.app_role)
with check (public.get_my_role() = 'admin'::public.app_role);

revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (name, avatar_url, role) on public.profiles to authenticated;
grant select, insert, update, delete
  on public.themes, public.topics, public.sessions, public.session_panelists,
     public.session_briefs, public.session_notes, public.session_attendance
  to authenticated;

revoke all on public.profiles, public.themes, public.topics, public.sessions,
  public.session_panelists, public.session_briefs, public.session_notes,
  public.session_attendance from anon;
