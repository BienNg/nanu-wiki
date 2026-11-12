-- Zalo Official Accounts are no longer an inbox channel. Delete their chats and tokens,
-- then narrow the channel checks to Messenger and WhatsApp.
-- "weiter_auf_zalo" (the Page sent a Zalo number in Messenger) is unrelated and stays.

delete from public.messenger_outbox
where conversation_id in (select id from public.messenger_conversations where channel = 'zalo');

delete from public.messenger_messages where channel = 'zalo';
delete from public.messenger_conversations where channel = 'zalo';  -- labels cascade
delete from public.messenger_accounts where channel = 'zalo';
delete from public.messenger_sync_state where page_id = 'zalo' or page_id like 'zalo:%';

alter table public.messenger_conversations drop constraint messenger_conversations_channel_check;
alter table public.messenger_conversations add constraint messenger_conversations_channel_check
  check (channel in ('messenger', 'whatsapp'));

alter table public.messenger_messages drop constraint messenger_messages_channel_check;
alter table public.messenger_messages add constraint messenger_messages_channel_check
  check (channel in ('messenger', 'whatsapp'));

alter table public.messenger_accounts drop constraint messenger_accounts_channel_check;
alter table public.messenger_accounts add constraint messenger_accounts_channel_check
  check (channel = 'whatsapp');
