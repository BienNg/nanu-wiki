-- NaNu Wiki – Facebook Page Messenger inbox (read-only copy).
-- /api/cron/messenger-sync polls the Graph API every minute and upserts here with the service role.
-- Includes messages customers send and replies the Page sends (e.g. from Meta Business Suite).
-- Holds customer data: no insert/update policies (only the service role writes), admins read.

create table public.messenger_conversations (
  id text primary key,                    -- Meta conversation id (t_…)
  customer_psid text,                     -- page-scoped id of the customer
  customer_name text,
  message_count int,
  updated_time timestamptz not null,      -- last activity according to Meta
  messages_synced_through timestamptz,    -- updated_time whose messages are fully copied (skip if unchanged)
  synced_at timestamptz not null default now()
);
create index messenger_conversations_updated_idx on public.messenger_conversations (updated_time desc);

create table public.messenger_messages (
  id text primary key,                    -- Meta message id (m_…)
  conversation_id text not null references public.messenger_conversations (id) on delete cascade,
  from_id text,
  from_name text,
  from_page boolean not null,             -- true = sent by the Page (Business Suite, inbox, automation)
  text text,                              -- null for pure attachments / stickers
  attachments jsonb,
  created_time timestamptz not null,
  synced_at timestamptz not null default now()
);
create index messenger_messages_conv_time_idx on public.messenger_messages (conversation_id, created_time desc);

-- One row per Page: how far the poller got.
create table public.messenger_sync_state (
  page_id text primary key,
  high_water timestamptz,                 -- newest conversation updated_time fully synced
  last_run_at timestamptz,
  last_error text
);

alter table public.messenger_conversations enable row level security;
alter table public.messenger_messages enable row level security;
alter table public.messenger_sync_state enable row level security;

create policy messenger_conversations_read on public.messenger_conversations for select using (public.is_admin());
create policy messenger_messages_read on public.messenger_messages for select using (public.is_admin());
create policy messenger_sync_state_read on public.messenger_sync_state for select using (public.is_admin());
