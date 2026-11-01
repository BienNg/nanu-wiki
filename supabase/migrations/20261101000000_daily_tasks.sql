-- NaNu Wiki – daily task checklists (Sales, Customer Success).
-- The tasks themselves are in code (src/content/daily); this table keeps who ticked what on which day,
-- so the list starts empty every day and admins can look back week by week.
-- `day` is the calendar day in Vietnam time. A row exists while a task is done or has a note.

create table public.daily_task_log (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  area text not null,
  task_id text not null,
  day date not null,
  done boolean not null default false,
  note text check (char_length(note) <= 1000),
  done_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (profile_id, task_id, day)
);
create index daily_task_log_area_day_idx on public.daily_task_log (area, day);

alter table public.daily_task_log enable row level security;

create or replace function public.vn_today()
returns date language sql stable set search_path = public as $$
  select (now() at time zone 'Asia/Ho_Chi_Minh')::date;
$$;

-- Staff+ tick their own list, and only today's: past days stay as they were.
create policy daily_task_log_insert on public.daily_task_log for insert with check (
  profile_id = auth.uid() and public.is_staff() and day = public.vn_today()
);
create policy daily_task_log_update on public.daily_task_log for update
  using (profile_id = auth.uid() and day = public.vn_today())
  with check (profile_id = auth.uid() and public.is_staff() and day = public.vn_today());
create policy daily_task_log_delete on public.daily_task_log for delete using (
  profile_id = auth.uid() and day = public.vn_today()
);

-- Own rows; admins read everyone's for the weekly overview.
create policy daily_task_log_read on public.daily_task_log for select using (
  profile_id = auth.uid() or public.is_admin()
);
