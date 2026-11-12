-- Durable outgoing attempts; credentials and writes remain server-only.
create table public.messenger_outbox (
 id uuid primary key,
 conversation_id text not null references public.messenger_conversations(id),
 sent_by uuid not null references auth.users(id),
 sender_name text not null,
 payload jsonb not null,
 payload_hash text not null,
 status text not null default 'sending' check (status in ('sending','sent','delivered','read','failed','unknown')),
 provider_message_id text unique,
 error text,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index messenger_outbox_conversation on public.messenger_outbox(conversation_id, created_at);
alter table public.messenger_outbox enable row level security;
create policy messenger_outbox_read on public.messenger_outbox for select using (public.is_admin());
create table public.messenger_webhook_events (
 id text primary key,
 channel text not null,
 payload jsonb not null,
 processed_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.messenger_webhook_events enable row level security;
revoke all on public.messenger_webhook_events from anon, authenticated;
create table public.messenger_uploads (
 id uuid primary key,
 owner_id uuid not null references auth.users(id),
 path text not null,
 name text not null,
 mime text not null,
 created_at timestamptz not null default now()
);
alter table public.messenger_uploads enable row level security;
revoke all on public.messenger_uploads from anon, authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('messenger-attachments','messenger-attachments',false,4194304,array['image/jpeg','image/png','application/pdf']) on conflict(id) do nothing;
-- Atomic monotonic status transitions tolerate duplicate and out-of-order callbacks.
create function public.messenger_delivery(mid text, new_status text) returns void language sql security definer set search_path=public as $$
 update messenger_outbox set status=new_status, updated_at=now()
 where provider_message_id=mid and (
 (new_status='read') or
 (new_status='delivered' and status <> 'read') or
 (new_status='sent' and status in ('sending','unknown')) or
 (new_status='failed' and status in ('sending','unknown','sent'))
 );
$$;
revoke all on function public.messenger_delivery(text,text) from public,anon,authenticated;
grant execute on function public.messenger_delivery(text,text) to service_role;
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  alter publication supabase_realtime add table public.messenger_outbox;
 end if;
end $$;
