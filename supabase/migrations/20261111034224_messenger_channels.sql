-- One inbox for Facebook Messenger, WhatsApp Business, and Zalo Official Accounts.
-- Channel tokens live in messenger_accounts. No read policy: only the service role can see them.

alter table public.messenger_conversations
  add column channel text not null default 'messenger',
  add column account_id text,
  add column account_name text;

alter table public.messenger_conversations
  add constraint messenger_conversations_channel_check
  check (channel in ('messenger', 'whatsapp', 'zalo'));

create index messenger_conversations_channel_updated_idx
  on public.messenger_conversations (channel, updated_time desc);

alter table public.messenger_messages
  add column channel text not null default 'messenger';

alter table public.messenger_messages
  add constraint messenger_messages_channel_check
  check (channel in ('messenger', 'whatsapp', 'zalo'));

create table public.messenger_accounts (
  id text primary key,                       -- zalo:<oa id>
  channel text not null check (channel in ('zalo', 'whatsapp')),
  external_id text not null,
  name text,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.messenger_accounts enable row level security;
revoke all on public.messenger_accounts from anon, authenticated;

-- Recreate so the new columns are part of the view definition (security_invoker stays on).
drop view public.messenger_inbox;
create view public.messenger_inbox with (security_invoker = true) as
select
  c.id,
  c.customer_name,
  c.customer_psid,
  c.updated_time,
  m.text as last_text,
  m.from_page as last_from_page,
  m.attachments is not null as last_has_attachment,
  m.created_time as last_time,
  c.channel,
  c.account_name
from public.messenger_conversations c
left join lateral (
  select text, from_page, attachments, created_time
  from public.messenger_messages
  where conversation_id = c.id
  order by created_time desc
  limit 1
) m on true;

drop view public.messenger_facts;
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
  ) as followup_sent,
  c.channel
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
