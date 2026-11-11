-- Lets a WhatsApp thread that started with a phone number keep the same row
-- when a later webhook only includes the business-scoped user id.
-- Scoped per business number: the same person can write to two of our numbers.

alter table public.messenger_conversations
  add column customer_user_id text;

create unique index messenger_conversations_wa_user_idx
  on public.messenger_conversations (account_id, customer_user_id)
  where customer_user_id is not null;
