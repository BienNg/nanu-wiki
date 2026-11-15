-- Status Zalo leaves every Sprachkurs step. The chat continues on Zalo.
-- Groups carry `status` so a step count can leave those chats out.

create or replace function public.messenger_inbox_index(
  p_channel text default null,
  p_name text default null,
  p_interest text default null,
  p_stage text default null,
  p_not_stages text[] default null,
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
      case
        when l.outcome = 'bestandskunde' then 'Sprachkurs'
        when l.interest is null or l.interest in ('unklar', 'keins') then 'ohne'
        else l.interest
      end as interest,
      case when l.outcome = 'bestandskunde' then 'schueler' else l.stage end as stage,
      l.outcome is null or l.outcome not in ('kein_lead', 'bestandskunde', 'weiter_auf_zalo') as open,
      case
        when l.outcome = 'bestandskunde' then 'schueler'
        when l.outcome = 'weiter_auf_zalo' then 'zalo'
        when l.outcome = 'kein_lead' then 'kein_lead'
        when l.outcome = 'verloren' then 'verloren'
        else 'auto'
      end as status
    from public.messenger_conversations c
    left join public.messenger_labels l on l.conversation_id = c.id
    where (p_channel is null or c.channel = p_channel)
      and (p_name is null or c.customer_name ilike p_name)
  ),
  hit as (
    select id, updated_time
    from base
    where (p_interest is null
           or (p_interest = 'qualifizieren' and interest = 'ohne' and open)
           or (p_interest in ('auto', 'kein_lead', 'zalo', 'verloren') and status = p_interest)
           or (p_interest not in ('qualifizieren', 'auto', 'kein_lead', 'zalo', 'verloren') and interest = p_interest))
      and (p_stage is null or stage = p_stage)
      and (p_not_stages is null or stage is null or stage <> all (p_not_stages))
      and ((p_stage is null and p_not_stages is null) or status <> 'zalo')
  ),
  page as (
    select id, updated_time
    from hit
    order by updated_time desc, id
    limit greatest(0, least(coalesce(p_limit, 200), 500))
  )
  select jsonb_build_object(
    'groups', coalesce(
      (select jsonb_agg(jsonb_build_object('interest', g.interest, 'stage', g.stage, 'open', g.open, 'status', g.status, 'n', g.n))
       from (select interest, stage, open, status, count(*) as n from base group by interest, stage, open, status) g),
      '[]'::jsonb),
    'statuses', coalesce(
      (select jsonb_object_agg(s.status, s.n) from (select status, count(*) as n from base group by status) s),
      '{}'::jsonb),
    'total', (select count(*) from hit),
    'ids', coalesce((select jsonb_agg(id order by updated_time desc, id) from page), '[]'::jsonb)
  );
$$;

notify pgrst, 'reload schema';
