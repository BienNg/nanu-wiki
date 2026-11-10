-- Label changed Messenger threads every 15 minutes.
-- Same Vault secret as messenger-sync (`messenger_cron_secret` = CRON_SECRET).

select cron.unschedule(jobid) from cron.job where jobname = 'messenger-label';

select cron.schedule(
  'messenger-label',
  '*/15 * * * *',
  $job$
  select net.http_get(
    url := 'https://nanu-wiki.vercel.app/api/cron/messenger-label',
    headers := jsonb_build_object(
      'Authorization',
      'Bearer ' || coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'messenger_cron_secret'), '')
    ),
    timeout_milliseconds := 60000
  );
  $job$
);
