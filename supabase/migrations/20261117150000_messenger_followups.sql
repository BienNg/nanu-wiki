-- Manual follow-ups in the Messenger inbox: "write to this person again on <date>", with an optional note.
-- A chat has at most one open follow-up (done_at is null); closed ones stay as history. Set and closed by
-- hand only (src/lib/messenger/followups.ts). While one is open, the automatic 24h follow-up is off.
-- It works for every status (also Verloren, Kein Lead, Zalo) and does not change the status.
--
-- Replaces Status Verloren with reason "Später" + Datum: those chats become open again with a follow-up.

create table public.messenger_followups (
  id uuid primary key default gen_random_uuid(),
  conversation_id text not null references public.messenger_conversations(id) on delete cascade,
  due_on date not null,                    -- Vietnam date; due from the start of that day
  note text,
  created_by uuid references auth.users(id),
  created_by_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  done_at timestamptz,
  done_by uuid references auth.users(id),
  done_by_name text
);
create unique index messenger_followups_open on public.messenger_followups (conversation_id) where done_at is null;
create index messenger_followups_conv on public.messenger_followups (conversation_id, created_at desc);
create index messenger_followups_updated on public.messenger_followups (updated_at desc);

alter table public.messenger_followups enable row level security;
create policy messenger_followups_read on public.messenger_followups
  for select using (public.is_admin());
create policy messenger_followups_insert on public.messenger_followups
  for insert with check (public.is_admin());
create policy messenger_followups_update on public.messenger_followups
  for update using (public.is_admin()) with check (public.is_admin());

-- "Später" moves over: a follow-up on the stored date (today when none was set), and the chat is open again.
insert into public.messenger_followups (conversation_id, due_on, note, created_by_name)
select l.conversation_id,
       coalesce(l.resume_on::date, (now() at time zone 'Asia/Ho_Chi_Minh')::date),
       'Später (aus dem alten Status Verloren · Später)',
       'System'
from public.messenger_labels l
where l.outcome = 'verloren' and l.loss_reason = 'spaeter';

update public.messenger_labels
set outcome = 'wartet_auf_kunde',
    loss_reason = null,
    resume_on = null,
    pinned = array(select p from unnest(coalesce(pinned, '{}')) p where p not in ('outcome', 'loss_reason', 'resume_on')),
    updated_at = now()
where outcome = 'verloren' and loss_reason = 'spaeter';

-- A follow-up change is a change of the inbox and of that chat (see 20261114150000_messenger_inbox_version).
create or replace function public.messenger_inbox_version(p_conversation text default null) returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'inbox', concat_ws('|',
      (select max(updated_time) from public.messenger_conversations),
      (select max(synced_at) from public.messenger_conversations),
      (select max(updated_at) from public.messenger_labels),
      (select concat_ws(',', count(*), max(updated_at)) from public.messenger_followups)),
    'thread', case when p_conversation is null then null else concat_ws('|',
      (select concat_ws(',', count(*), max(created_time)) from public.messenger_messages where conversation_id = p_conversation),
      (select updated_at from public.messenger_labels where conversation_id = p_conversation),
      (select concat_ws(',', count(*), max(updated_at)) from public.messenger_outbox where conversation_id = p_conversation),
      (select concat_ws(',', count(*), max(updated_at)) from public.messenger_followups where conversation_id = p_conversation)) end,
    'sync', coalesce(
      (select jsonb_agg(jsonb_build_object('page_id', page_id, 'last_run_at', last_run_at, 'last_error', last_error))
       from public.messenger_sync_state),
      '[]'::jsonb)
  );
$$;

notify pgrst, 'reload schema';
