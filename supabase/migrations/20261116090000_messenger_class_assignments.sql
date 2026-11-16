-- Which classes from the Notion "Klassen Datenbank" a Messenger lead is a prospect for.
-- class_id is the Notion page id; name, level, dates are read live from Notion, nothing is
-- written back. A chat can sit on several classes. Rows are only removed by hand; views stop
-- showing a class once its End date has passed. See src/lib/messenger/classes.ts.

create table public.messenger_class_assignments (
  conversation_id text not null references public.messenger_conversations(id),
  class_id uuid not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (conversation_id, class_id)
);
create index messenger_class_assignments_class on public.messenger_class_assignments(class_id);

alter table public.messenger_class_assignments enable row level security;
create policy messenger_class_assignments_read on public.messenger_class_assignments
  for select using (public.is_admin());
create policy messenger_class_assignments_insert on public.messenger_class_assignments
  for insert with check (public.is_admin());
create policy messenger_class_assignments_delete on public.messenger_class_assignments
  for delete using (public.is_admin());
