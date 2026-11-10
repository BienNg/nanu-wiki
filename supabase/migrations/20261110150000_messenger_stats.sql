-- Sales stats for the Messenger inbox.
-- messenger_facts is derived from messages (security_invoker: admin RLS still applies).
-- messenger_labels is one row per conversation, written by /api/cron/messenger-label.
-- The monthly token counters enforce the labeling budget. Admins read, the service role writes.

create table public.messenger_labels (
  conversation_id text primary key references public.messenger_conversations (id) on delete cascade,
  stage text not null,
  interest text,
  level text,
  place text,
  outcome text not null,
  loss_reason text,
  evidence text,
  labeled_through timestamptz not null,
  source text not null check (source in ('rule', 'model')),
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  updated_at timestamptz not null default now()
);

create table public.messenger_label_budget (
  month text primary key,
  input_tokens int not null default 0,
  output_tokens int not null default 0
);

create table public.messenger_label_state (
  id int primary key check (id = 1),
  running_until timestamptz,
  last_run_at timestamptz,
  last_error text
);

insert into public.messenger_label_state (id) values (1);

alter table public.messenger_labels enable row level security;
alter table public.messenger_label_budget enable row level security;
alter table public.messenger_label_state enable row level security;

create policy messenger_labels_read on public.messenger_labels for select using (public.is_admin());
create policy messenger_label_budget_read on public.messenger_label_budget for select using (public.is_admin());
create policy messenger_label_state_read on public.messenger_label_state for select using (public.is_admin());

create view public.messenger_facts with (security_invoker = true) as
select
  c.id,
  c.customer_name,
  c.customer_psid,
  c.updated_time,
  a.first_customer_at,
  r.first_reply_at,
  a.last_customer_at,
  a.last_page_at,
  coalesce(a.customer_msgs, 0) as customer_msgs,
  coalesce(a.page_msgs, 0) as page_msgs,
  coalesce(a.zalo_offered, false) as zalo_offered,
  coalesce(lp.last_page_has_zalo, false) as last_page_has_zalo,
  case
    when a.first_customer_at is not null and r.first_reply_at is not null
    then extract(epoch from (r.first_reply_at - a.first_customer_at))::int
  end as reply_seconds,
  case
    when coalesce(a.customer_msgs, 0) = 0 then null::boolean
    when a.last_customer_at is null then true
    when a.last_page_at is null then false
    else a.last_page_at >= a.last_customer_at
  end as last_from_page,
  coalesce(
    a.last_customer_at is not null
    and a.last_page_at is not null
    and a.last_page_at >= a.last_customer_at + interval '24 hours',
    false
  ) as followup_sent
from public.messenger_conversations c
cross join lateral (
  select
    min(created_time) filter (where not from_page) as first_customer_at,
    max(created_time) filter (where not from_page) as last_customer_at,
    max(created_time) filter (where from_page) as last_page_at,
    count(*) filter (where not from_page)::int as customer_msgs,
    count(*) filter (where from_page)::int as page_msgs,
    bool_or(from_page and coalesce(text, '') ilike '%zalo%') as zalo_offered
  from public.messenger_messages
  where conversation_id = c.id
) a
left join lateral (
  select min(m.created_time) as first_reply_at
  from public.messenger_messages m
  where m.conversation_id = c.id
    and m.from_page
    and a.first_customer_at is not null
    and m.created_time >= a.first_customer_at
) r on true
left join lateral (
  select position('zalo' in lower(coalesce(text, ''))) > 0 as last_page_has_zalo
  from public.messenger_messages
  where conversation_id = c.id and from_page
  order by created_time desc
  limit 1
) lp on true;
