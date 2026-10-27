-- NaNu Wiki – content moves into the app (src/content).
-- Areas, pages, onboarding weeks, checklist items and quizzes are hard-coded now; the database
-- keeps only people (profiles, area_editors) and what they did (checklist_progress, quiz_attempts, chat_responses).
-- Progress rows point at content keys from the code:
--   checklist_progress.item_id  "sales.w2.sop-erstkontakt-uber-messenger"
--   quiz_attempts.quiz_id       "sales-woche-2"
--   chat_responses.page_id      "sales/interview"  (+ area "sales" for the editor policy)
-- Existing progress was test data only and is cleared.

-- ---------------------------------------------------------------- progress tables → text keys
truncate public.checklist_progress, public.quiz_attempts, public.chat_responses;

drop policy chat_responses_insert on public.chat_responses;
drop policy chat_responses_read on public.chat_responses;

alter table public.checklist_progress
  drop constraint checklist_progress_item_id_fkey,
  alter column item_id type text using item_id::text;

alter table public.quiz_attempts
  drop constraint quiz_attempts_quiz_id_fkey,
  alter column quiz_id type text using quiz_id::text;
create index quiz_attempts_profile_idx on public.quiz_attempts (profile_id, quiz_id);

alter table public.chat_responses
  drop constraint chat_responses_page_id_fkey,
  alter column page_id type text using page_id::text,
  add column area text not null;

-- ---------------------------------------------------------------- profiles / area_editors → area slugs
alter table public.profiles add column candidate_area text, add column primary_area text;
update public.profiles p set candidate_area = a.slug from public.areas a where a.id = p.candidate_area_id;
update public.profiles p set primary_area = a.slug from public.areas a where a.id = p.primary_area_id;

-- Users may edit their own name/avatar but never their own role, area or buddy.
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.candidate_area := old.candidate_area;
    new.primary_area := old.primary_area;
    new.buddy_id := old.buddy_id;
    new.location := old.location;
    new.email := old.email;
  end if;
  return new;
end;
$$;

alter table public.profiles drop column candidate_area_id, drop column primary_area_id;

alter table public.area_editors add column area text;
update public.area_editors e set area = a.slug from public.areas a where a.id = e.area_id;
alter table public.area_editors drop column area_id; -- drops the old primary key with it
alter table public.area_editors alter column area set not null, add primary key (area, profile_id);

-- ---------------------------------------------------------------- drop the content tables
drop table public.quiz_questions, public.quizzes, public.checklist_items, public.onboarding_weeks, public.pages, public.areas cascade;

drop function public.submit_quiz(uuid, int[]);
drop function public.check_answer(uuid, int);
drop function public.pages_before_write();
drop function public.can_edit_area(uuid);
drop function public.my_candidate_area();
drop type public.knowledge_kind;
drop type public.page_section;

-- ---------------------------------------------------------------- access helpers and policies on area slugs
create or replace function public.can_edit_area(target text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin()
      or (public.my_role() = 'editor'
          and exists (select 1 from public.area_editors where area = target and profile_id = auth.uid()));
$$;

-- Approved users submit their own run; the server action checks that they may read the page.
create policy chat_responses_insert on public.chat_responses for insert with check (
  profile_id = auth.uid() and public.my_role() <> 'pending'
);

-- Own runs; editors of the page's area and admins see everyone's.
create policy chat_responses_read on public.chat_responses for select using (
  profile_id = auth.uid() or public.can_edit_area(area)
);

-- quiz_attempts still has no insert policy: attempts are graded and written by the server (service role),
-- so nobody can record a pass from the browser.
