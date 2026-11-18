-- Follow-ups ("Nachfassen") and whether the person answered, worked out in the database so the
-- Statistik page gets a few hundred rows instead of every message. Same rule as findFollowups in
-- src/lib/messenger/followupReplies.ts (keep both in step; tests/messenger-followup-replies.test.cjs):
--
-- A message of ours starts a follow-up when
--   * the person last wrote at least 24h before it,
--   * we had already written after that message of theirs, and
--   * our previous message was 24h+ before it, or within the person's first 24h of silence.
-- Counted 1, 2, 3… until the person writes again. That message answers the newest follow-up; the
-- ones before it were "superseded". `zalo`: one of the follow-up's messages mentions Zalo.
--
-- p_from / p_to: follow-ups that started in [p_from, p_to). p_conversation: one chat only (chat pane).
-- Until this is applied the app works the same out of the messages itself (followupStats.ts).

create index if not exists messenger_messages_page_time_idx
  on public.messenger_messages (created_time) where from_page;

create or replace function public.messenger_followup_events(
  p_from timestamptz,
  p_to timestamptz,
  p_conversation text default null
) returns table (
  conversation_id text,
  channel text,
  customer_name text,
  at timestamptz,
  nth int,
  answered_at timestamptz,
  answer_seconds int,
  superseded boolean,
  zalo boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  with chats as (
    -- Chats where we wrote in the window; their whole history is read below.
    select distinct m.conversation_id
    from public.messenger_messages m
    where m.from_page and m.created_time >= p_from and m.created_time < p_to
      and (p_conversation is null or m.conversation_id = p_conversation)
  ),
  msgs as (
    -- run: how many messages of the person came up to here. Run 0 is before they ever wrote.
    select m.conversation_id, m.id, m.from_page, m.created_time,
           coalesce(m.text, '') ilike '%zalo%' as mentions_zalo,
           count(*) filter (where not m.from_page) over (
             partition by m.conversation_id order by m.created_time, m.id rows unbounded preceding
           ) as run
    from public.messenger_messages m
    join chats c on c.conversation_id = m.conversation_id
  ),
  runs as (
    -- When the person's message that opens each run was sent.
    select conversation_id, run, min(created_time) as customer_at
    from msgs
    where not from_page and run > 0
    group by conversation_id, run
  ),
  ours as (
    select p.*, r.customer_at,
           lag(p.created_time) over (partition by p.conversation_id, p.run order by p.created_time, p.id) as prev_at
    from msgs p
    join runs r on r.conversation_id = p.conversation_id and r.run = p.run
    where p.from_page
  ),
  marked as (
    select o.*,
           (o.prev_at is not null
            and o.created_time - o.customer_at >= interval '24 hours'
            and (o.created_time - o.prev_at >= interval '24 hours'
                 or o.prev_at - o.customer_at < interval '24 hours')) as starts
    from ours o
  ),
  grouped as (
    select g.*,
           (count(*) filter (where g.starts) over (
             partition by g.conversation_id, g.run order by g.created_time, g.id rows unbounded preceding
           ))::int as k
    from marked g
  ),
  events as (
    select conversation_id, run, k as nth, min(created_time) as at, bool_or(mentions_zalo) as zalo
    from grouped
    where k > 0
    group by conversation_id, run, k
  ),
  last_k as (
    select conversation_id, run, max(nth) as max_nth from events group by conversation_id, run
  )
  select e.conversation_id,
         c.channel,
         c.customer_name,
         e.at,
         e.nth,
         case when e.nth = l.max_nth then nx.customer_at end as answered_at,
         case when e.nth = l.max_nth and nx.customer_at is not null
              then greatest(0, round(extract(epoch from (nx.customer_at - e.at))))::int end as answer_seconds,
         e.nth < l.max_nth as superseded,
         e.zalo
  from events e
  join last_k l on l.conversation_id = e.conversation_id and l.run = e.run
  left join runs nx on nx.conversation_id = e.conversation_id and nx.run = e.run + 1
  join public.messenger_conversations c on c.id = e.conversation_id
  where e.at >= p_from and e.at < p_to
  order by e.at, e.conversation_id;
$$;

grant execute on function public.messenger_followup_events(timestamptz, timestamptz, text) to authenticated, service_role;
