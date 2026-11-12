-- Facebook threads synced before account_id existed belong to the single configured Page.
update public.messenger_conversations set account_id = '100573835262458'
where channel = 'messenger' and account_id is null;
