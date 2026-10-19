create or replace function public.get_member_email_confirmation()
returns table (user_id uuid, email_confirmed boolean)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
     or public.get_my_role() is distinct from 'admin'::public.app_role then
    raise exception 'Only admins can view member email confirmation status'
      using errcode = '42501';
  end if;

  return query
  select u.id, u.email_confirmed_at is not null
  from auth.users as u;
end;
$$;

revoke all on function public.get_member_email_confirmation() from public, anon;
grant execute on function public.get_member_email_confirmation() to authenticated;
