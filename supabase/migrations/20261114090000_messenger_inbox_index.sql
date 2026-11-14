-- Inbox list for /admin/messenger: count and pick the chats inside the database.
--
-- Before, the page read every conversation and every label and counted them in the app.
-- This function does it in one request and returns only what the page needs:
--   groups  how many chats per Interesse and Stufe (for the Interesse menu and the step funnel),
--           counted over all chats that match Kanal + Name
--   total   how many chats also match the Interesse/Stufe filter
--   ids     the newest p_limit of those, newest first
-- The page then loads the full rows (newest message, label, facts) for these ids only.
--
-- security invoker: the RLS of the tables applies, so only admins get rows.

create function public.messenger_inbox_index(
  p_channel text default null,       -- 'messenger' | 'whatsapp'
  p_name text default null,          -- ILIKE pattern for the customer name, already escaped
  p_interest text default null,      -- an Interesse, or 'ohne' for chats without one
  p_stage text default null,         -- exactly this Stufe
  p_not_stages text[] default null,  -- or: none of these Stufen (the "Unklar" step)
  p_limit int default 200
) returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with base as materialized (
    select
      c.id,
      c.updated_time,
      case when l.interest is null or l.interest in ('unklar', 'keins') then 'ohne' else l.interest end as interest,
      l.stage
    from public.messenger_conversations c
    left join public.messenger_labels l on l.conversation_id = c.id
    where (p_channel is null or c.channel = p_channel)
      and (p_name is null or c.customer_name ilike p_name)
  ),
  hit as (
    select id, updated_time
    from base
    where (p_interest is null or interest = p_interest)
      and (p_stage is null or stage = p_stage)
      and (p_not_stages is null or stage is null or stage <> all (p_not_stages))
  ),
  page as (
    select id, updated_time
    from hit
    order by updated_time desc, id
    limit greatest(0, least(coalesce(p_limit, 200), 500))
  )
  select jsonb_build_object(
    'groups', coalesce(
      (select jsonb_agg(jsonb_build_object('interest', g.interest, 'stage', g.stage, 'n', g.n))
       from (select interest, stage, count(*) as n from base group by interest, stage) g),
      '[]'::jsonb),
    'total', (select count(*) from hit),
    'ids', coalesce((select jsonb_agg(id order by updated_time desc, id) from page), '[]'::jsonb)
  );
$$;

revoke all on function public.messenger_inbox_index(text, text, text, text, text[], int) from public, anon;
grant execute on function public.messenger_inbox_index(text, text, text, text, text[], int) to authenticated;

-- Let the API see the new function at once.
notify pgrst, 'reload schema';
