begin;

do $$
declare
  bootstrap_user_id uuid;
  admin_count bigint;
begin
  lock table public.profiles in share row exclusive mode;

  select u.id
  into bootstrap_user_id
  from auth.users as u
  where lower(u.email) = 'miracleben51@gmail.com'
    and u.email_confirmed_at is not null;

  if bootstrap_user_id is null then
    raise exception
      'No confirmed Auth account found for miracleben51@gmail.com; sign up and confirm the email first';
  end if;

  if not exists (
    select 1 from public.profiles as p where p.id = bootstrap_user_id
  ) then
    raise exception
      'The profile row for miracleben51@gmail.com is missing; apply the Phase 9 migration first';
  end if;

  perform p.id
  from public.profiles as p
  where p.role = 'admin'::public.app_role
  order by p.id
  for update;

  select count(*)
  into admin_count
  from public.profiles as p
  where p.role = 'admin'::public.app_role;

  if admin_count <> 0 then
    raise exception
      'An admin already exists; bootstrap_first_admin.sql only works before the first admin is configured';
  end if;

  update public.profiles
  set name = 'Ben Kanu',
      role = 'admin'::public.app_role,
      approved_at = coalesce(approved_at, now())
  where id = bootstrap_user_id;
end;
$$;

commit;
