-- Run the Messenger sync every minute from Supabase (Vercel Hobby cron only runs daily).
-- The bearer secret is NOT in this file: add it once in the Supabase dashboard →
-- Project Settings → Vault → "Add new secret", name `messenger_cron_secret`, value = CRON_SECRET from Vercel.
-- Until it exists, the calls get 401 and nothing happens.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'messenger-sync',
  '* * * * *',
  $job$
  select net.http_get(
    url := 'https://nanu-wiki.vercel.app/api/cron/messenger-sync',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'messenger_cron_secret'), '')
    ),
    timeout_milliseconds := 60000
  );
  $job$
);
