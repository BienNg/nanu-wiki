-- Drop the editor role. People who had it become staff.
-- Drafts, the comment inbox, and other people's answers stay admin-only.
-- Postgres cannot remove an enum value, so app_role is recreated without 'editor'.

update public.profiles set role = 'staff' where role::text = 'editor';

-- Stop calling my_role() so that function can be dropped with the old enum.
create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role::text from public.profiles where id = auth.uid()), 'pending') in ('staff', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role::text from public.profiles where id = auth.uid()), 'pending') = 'admin';
$$;

-- Admins only. The area argument stays so existing policies keep calling can_edit_area(area).
create or replace function public.can_edit_area(target text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin();
$$;

do $$
begin
  if exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'area_editors'
  ) then
    execute 'alter publication supabase_realtime drop table public.area_editors';
  end if;
end $$;

drop table public.area_editors;

-- This policy calls my_role() and reads profiles.role, so it has to be gone while the column type changes.
drop policy chat_responses_insert on public.chat_responses;

drop function public.my_role();

alter table public.profiles alter column role drop default;
alter table public.profiles alter column role type text using role::text;

drop type public.app_role;
create type public.app_role as enum ('pending', 'candidate', 'staff', 'admin');

alter table public.profiles
  alter column role type public.app_role using role::public.app_role,
  alter column role set default 'pending';

create or replace function public.my_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'pending');
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() in ('staff', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin';
$$;

create or replace function public.can_edit_area(target text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin();
$$;

create policy chat_responses_insert on public.chat_responses for insert with check (
  profile_id = auth.uid() and public.my_role() <> 'pending'
);
