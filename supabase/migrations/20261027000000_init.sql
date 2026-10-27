-- NaNu Wiki – initial schema, role-based access and Row Level Security
-- Access levels: pending → candidate → staff → editor → admin

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- enums
create type public.app_role as enum ('pending', 'candidate', 'staff', 'editor', 'admin');
create type public.knowledge_kind as enum ('reference', 'process', 'decision', 'living');
create type public.page_section as enum ('general', 'interview', 'onboarding', 'handbook');

-- ---------------------------------------------------------------- tables
create table public.areas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_de text not null,
  name_vi text not null,
  description_de text,
  description_vi text,
  icon text not null default 'users',
  color text not null default '#0B7793',
  is_shared boolean not null default false, -- true = "Für alle"
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role public.app_role not null default 'pending',
  location text check (location in ('hcm', 'hanoi', 'stuttgart', 'online')),
  candidate_area_id uuid references public.areas (id) on delete set null, -- candidates: the one role they applied for
  primary_area_id uuid references public.areas (id) on delete set null,   -- staff: their own role (for "Mein Onboarding")
  buddy_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Which areas an editor may write in (admins may write everywhere)
create table public.area_editors (
  area_id uuid not null references public.areas (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  primary key (area_id, profile_id)
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas (id) on delete cascade,
  slug text not null,
  title_de text not null,
  title_vi text not null default '',
  kind public.knowledge_kind not null default 'reference',
  section public.page_section not null default 'handbook',
  body jsonb not null default '[]'::jsonb,          -- list of bilingual blocks (incl. YouTube video blocks)
  search_text text not null default '',             -- plain text for search, filled by trigger
  owner_id uuid references public.profiles (id) on delete set null,
  verified_until date,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null,
  unique (area_id, slug)
);
create index pages_area_idx on public.pages (area_id, section);
create index pages_search_idx on public.pages using gin (to_tsvector('simple', search_text));

create table public.onboarding_weeks (
  id uuid primary key default gen_random_uuid(),
  area_id uuid not null references public.areas (id) on delete cascade,
  week int not null check (week between 1 and 12),
  title_de text not null,
  title_vi text not null default '',
  unique (area_id, week)
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.onboarding_weeks (id) on delete cascade,
  sort int not null default 0,
  label_de text not null,
  label_vi text not null default '',
  page_id uuid references public.pages (id) on delete set null
);

create table public.checklist_progress (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  item_id uuid not null references public.checklist_items (id) on delete cascade,
  done_at timestamptz not null default now(),
  primary key (profile_id, item_id)
);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null unique references public.onboarding_weeks (id) on delete cascade,
  pass_percent int not null default 75 check (pass_percent between 1 and 100)
);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  sort int not null default 0,
  question_de text not null,
  question_vi text not null default '',
  options jsonb not null,            -- [{ "de": "...", "vi": "..." }, ...]
  correct_index int not null,        -- hidden from users, see column grants below
  explanation_de text,
  explanation_vi text
);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  answers int[] not null,
  score int not null,
  total int not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------- helper functions
-- SECURITY DEFINER so policies can read the caller's role without recursion.
create or replace function public.my_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'pending'::public.app_role);
$$;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() in ('staff', 'editor', 'admin');
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin';
$$;

create or replace function public.my_candidate_area()
returns uuid language sql stable security definer set search_path = public as $$
  select candidate_area_id from public.profiles where id = auth.uid() and role = 'candidate';
$$;

create or replace function public.can_edit_area(target uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
      or (public.my_role() = 'editor'
          and exists (select 1 from public.area_editors where area_id = target and profile_id = auth.uid()));
$$;

-- ---------------------------------------------------------------- triggers
-- New Google sign-up → profile in "pending" until an admin approves.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users may edit their own name/avatar but never their own role, area or buddy.
-- (auth.uid() is null in the SQL editor / service role – trusted contexts may change everything.)
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.candidate_area_id := old.candidate_area_id;
    new.primary_area_id := old.primary_area_id;
    new.buddy_id := old.buddy_id;
    new.location := old.location;
    new.email := old.email;
  end if;
  return new;
end;
$$;

create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- Keep search_text and updated_at in sync with the block content.
create or replace function public.pages_before_write()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.uid(), new.updated_by);
  new.search_text := concat_ws(' ', new.title_de, new.title_vi,
    (select string_agg(value::text, ' ') from jsonb_array_elements(new.body) as value));
  return new;
end;
$$;

create trigger pages_before_write before insert or update on public.pages
  for each row execute function public.pages_before_write();

-- ---------------------------------------------------------------- RLS
alter table public.areas enable row level security;
alter table public.profiles enable row level security;
alter table public.area_editors enable row level security;
alter table public.pages enable row level security;
alter table public.onboarding_weeks enable row level security;
alter table public.checklist_items enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

-- areas: staff+ see all; candidates only "their" role area
create policy areas_read on public.areas for select
  using (public.is_staff() or id = public.my_candidate_area());
create policy areas_admin_write on public.areas for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles: everyone sees their own; staff+ see colleagues (owners, buddies); admins manage
create policy profiles_read on public.profiles for select
  using (id = auth.uid() or public.is_staff());
create policy profiles_update_self on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_update on public.profiles for update
  using (public.is_admin()) with check (public.is_admin());
create policy profiles_admin_delete on public.profiles for delete
  using (public.is_admin());

-- area_editors
create policy area_editors_read on public.area_editors for select using (public.is_staff());
create policy area_editors_admin on public.area_editors for all
  using (public.is_admin()) with check (public.is_admin());

-- pages:
--   staff read published pages; editors/admins also see drafts in areas they can edit
--   candidates read only published interview pages of their role
create policy pages_read on public.pages for select using (
  (published and public.is_staff())
  or public.can_edit_area(area_id)
  or (published and section = 'interview' and area_id = public.my_candidate_area())
);
create policy pages_insert on public.pages for insert with check (public.can_edit_area(area_id));
create policy pages_update on public.pages for update
  using (public.can_edit_area(area_id)) with check (public.can_edit_area(area_id));
create policy pages_delete on public.pages for delete using (public.can_edit_area(area_id));

-- onboarding structure: staff read, editors of the area write
create policy weeks_read on public.onboarding_weeks for select using (public.is_staff());
create policy weeks_write on public.onboarding_weeks for all
  using (public.can_edit_area(area_id)) with check (public.can_edit_area(area_id));

create policy items_read on public.checklist_items for select using (public.is_staff());
create policy items_write on public.checklist_items for all
  using (public.can_edit_area((select area_id from public.onboarding_weeks w where w.id = week_id)))
  with check (public.can_edit_area((select area_id from public.onboarding_weeks w where w.id = week_id)));

-- progress: own rows; buddy and admins can read
create policy progress_read on public.checklist_progress for select using (
  profile_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.profiles p where p.id = profile_id and p.buddy_id = auth.uid())
);
create policy progress_insert on public.checklist_progress for insert
  with check (profile_id = auth.uid() and public.is_staff());
create policy progress_delete on public.checklist_progress for delete
  using (profile_id = auth.uid());

-- quizzes
create policy quizzes_read on public.quizzes for select using (public.is_staff());
create policy quizzes_write on public.quizzes for all
  using (public.can_edit_area((select area_id from public.onboarding_weeks w where w.id = week_id)))
  with check (public.can_edit_area((select area_id from public.onboarding_weeks w where w.id = week_id)));

create policy questions_read on public.quiz_questions for select using (public.is_staff());
create policy questions_write on public.quiz_questions for all
  using (public.can_edit_area((select w.area_id from public.quizzes q join public.onboarding_weeks w on w.id = q.week_id where q.id = quiz_id)))
  with check (public.can_edit_area((select w.area_id from public.quizzes q join public.onboarding_weeks w on w.id = q.week_id where q.id = quiz_id)));

-- Hide the correct answer from normal users: column-level grant without correct_index.
revoke select on public.quiz_questions from anon, authenticated;
grant select (id, quiz_id, sort, question_de, question_vi, options, explanation_de, explanation_vi)
  on public.quiz_questions to authenticated;

-- attempts are only written by submit_quiz(); own, buddy and admin can read
create policy attempts_read on public.quiz_attempts for select using (
  profile_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.profiles p where p.id = profile_id and p.buddy_id = auth.uid())
);

-- ---------------------------------------------------------------- RPC: grade a quiz on the server
create or replace function public.submit_quiz(p_quiz_id uuid, p_answers int[])
returns table (score int, total int, passed boolean, correct int[])
language plpgsql security definer set search_path = public as $$
declare
  v_correct int[];
  v_score int := 0;
  v_total int;
  v_pass int;
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  select array_agg(q.correct_index order by q.sort, q.id) into v_correct
  from public.quiz_questions q where q.quiz_id = p_quiz_id;

  v_total := coalesce(array_length(v_correct, 1), 0);
  if v_total = 0 then
    raise exception 'quiz has no questions';
  end if;

  for i in 1..v_total loop
    if p_answers[i] = v_correct[i] then
      v_score := v_score + 1;
    end if;
  end loop;

  select pass_percent into v_pass from public.quizzes where id = p_quiz_id;

  insert into public.quiz_attempts (quiz_id, profile_id, answers, score, total, passed)
  values (p_quiz_id, auth.uid(), p_answers, v_score, v_total, v_score * 100 >= v_pass * v_total);

  return query select v_score, v_total, v_score * 100 >= v_pass * v_total, v_correct;
end;
$$;

grant execute on function public.submit_quiz(uuid, int[]) to authenticated;

-- ---------------------------------------------------------------- RPC: instant feedback for one question
-- Returns whether the chosen answer is right (and which one is) without recording anything.
create or replace function public.check_answer(p_question_id uuid, p_answer int)
returns table (is_correct boolean, correct_index int)
language sql stable security definer set search_path = public as $$
  select q.correct_index = p_answer, q.correct_index
  from public.quiz_questions q
  where q.id = p_question_id and public.is_staff();
$$;

grant execute on function public.check_answer(uuid, int) to authenticated;
