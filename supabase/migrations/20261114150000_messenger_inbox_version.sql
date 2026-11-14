-- "Has anything changed?" for /admin/messenger.
--
-- Every open inbox tab asks this every few seconds (api/messenger/version) and only loads the list
-- or the open chat again when the answer differs from what it shows. One small request instead of
-- rendering the whole page on a timer.
--
--   inbox   changes when any chat gets a message or any label is saved
--   thread  changes when the chat p_conversation gets a message, a label change or a send status
--   sync    the poller's state rows, for the "Sync vor … Min." badge
--
-- security invoker: the RLS of the tables applies, so only admins get values.

create index if not exists messenger_conversations_synced_idx on public.messenger_conversations (synced_at desc);
create index if not exists messenger_labels_updated_idx on public.messenger_labels (updated_at desc);

create function public.messenger_inbox_version(p_conversation text default null) returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'inbox', concat_ws('|',
      (select max(updated_time) from public.messenger_conversations),
      (select max(synced_at) from public.messenger_conversations),
      (select max(updated_at) from public.messenger_labels)),
    'thread', case when p_conversation is null then null else concat_ws('|',
      (select concat_ws(',', count(*), max(created_time)) from public.messenger_messages where conversation_id = p_conversation),
      (select updated_at from public.messenger_labels where conversation_id = p_conversation),
      (select concat_ws(',', count(*), max(updated_at)) from public.messenger_outbox where conversation_id = p_conversation)) end,
    'sync', coalesce(
      (select jsonb_agg(jsonb_build_object('page_id', page_id, 'last_run_at', last_run_at, 'last_error', last_error))
       from public.messenger_sync_state),
      '[]'::jsonb)
  );
$$;

revoke all on function public.messenger_inbox_version(text) from public, anon;
grant execute on function public.messenger_inbox_version(text) to authenticated;

-- Let the API see the new function at once.
notify pgrst, 'reload schema';
