-- Fields a person corrected stay pinned. The label cron may refill the rest.
-- resume_on is the date for loss_reason spaeter.
-- Admins can insert and update labels; the cron still uses the service role.

alter table public.messenger_labels
  add column pinned text[] not null default '{}',
  add column resume_on date;

alter table public.messenger_labels
  drop constraint messenger_labels_source_check;

alter table public.messenger_labels
  add constraint messenger_labels_source_check
  check (source in ('rule', 'model', 'human'));

alter table public.messenger_labels
  add constraint messenger_labels_pinned_check
  check (pinned <@ array['stage', 'interest', 'level', 'place', 'outcome', 'loss_reason', 'resume_on']::text[]);

create policy messenger_labels_insert on public.messenger_labels
  for insert with check (public.is_admin());

create policy messenger_labels_update on public.messenger_labels
  for update using (public.is_admin()) with check (public.is_admin());
