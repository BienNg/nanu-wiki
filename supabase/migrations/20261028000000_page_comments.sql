-- NaNu Wiki – comments on handbook pages (phase 1).
-- A comment points at a page ("<area>/<slug>", like chat_responses.page_id) and optionally at a block and a
-- text quote inside it. The quote (exact + prefix/suffix) is kept so a comment stays readable after the
-- page text changes in code; `page_version` is the page's updated_at when the comment was written.
--   anchor = null                                                    → whole page
--   anchor = { block, field? }                                       → one block (field = "de" | "vi")
--   anchor = { block, field?, exact, prefix, suffix, context }       → a word or phrase in that block

create table public.page_comments (
  id uuid primary key default gen_random_uuid(),
  page_id text not null,
  area text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  anchor jsonb,
  tag text check (tag in ('unklar', 'fehler', 'veraltet', 'idee', 'hilfreich')),
  body text not null default '' check (char_length(body) <= 2000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'declined')),
  resolution_note text check (char_length(resolution_note) <= 2000),
  page_version text,
  resolved_by uuid references public.profiles (id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  check (tag is not null or char_length(body) > 0)
);
create index page_comments_page_idx on public.page_comments (page_id, created_at);
create index page_comments_status_idx on public.page_comments (area, status, created_at desc);

alter table public.page_comments enable row level security;

-- Staff+ comment as themselves; every comment starts open.
create policy page_comments_insert on public.page_comments for insert with check (
  author_id = auth.uid() and public.is_staff() and status = 'open' and resolved_by is null
);

-- Comments are visible to all staff (so people can see what was already asked).
create policy page_comments_read on public.page_comments for select using (
  author_id = auth.uid() or public.is_staff()
);

-- Editors of the page's area and admins work through them.
create policy page_comments_update on public.page_comments for update
  using (public.can_edit_area(area)) with check (public.can_edit_area(area));

-- Authors can take back their own open comment; admins can delete any.
create policy page_comments_delete on public.page_comments for delete using (
  (author_id = auth.uid() and status = 'open') or public.is_admin()
);

-- Updates only move the workflow: what was written, by whom and where stays as it was.
create or replace function public.page_comments_before_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.page_id := old.page_id;
  new.area := old.area;
  new.author_id := old.author_id;
  new.anchor := old.anchor;
  new.tag := old.tag;
  new.body := old.body;
  new.page_version := old.page_version;
  new.created_at := old.created_at;
  if new.status in ('resolved', 'declined') then
    if old.status is distinct from new.status then
      new.resolved_by := auth.uid();
      new.resolved_at := now();
    else
      new.resolved_by := old.resolved_by;
      new.resolved_at := old.resolved_at;
    end if;
  else
    new.resolved_by := null;
    new.resolved_at := null;
  end if;
  return new;
end;
$$;

create trigger page_comments_protect before update on public.page_comments
  for each row execute function public.page_comments_before_update();
