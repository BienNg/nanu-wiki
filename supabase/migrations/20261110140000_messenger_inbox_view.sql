-- Conversation list for /admin/messenger: each conversation with its newest message.
-- security_invoker: the RLS of the underlying tables applies (admins only).

create view public.messenger_inbox with (security_invoker = true) as
select
  c.id,
  c.customer_name,
  c.customer_psid,
  c.updated_time,
  m.text as last_text,
  m.from_page as last_from_page,
  m.attachments is not null as last_has_attachment,
  m.created_time as last_time
from public.messenger_conversations c
left join lateral (
  select text, from_page, attachments, created_time
  from public.messenger_messages
  where conversation_id = c.id
  order by created_time desc
  limit 1
) m on true;
