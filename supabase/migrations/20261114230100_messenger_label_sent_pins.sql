-- A hand correction of "Kurse geschickt" or "Preis geschickt" stays pinned.
-- The label cron may still fill those two when nobody has set them.
-- Status is never filled by the cron.

alter table public.messenger_labels
  drop constraint messenger_labels_pinned_check;

alter table public.messenger_labels
  add constraint messenger_labels_pinned_check
  check (pinned <@ array['stage', 'interest', 'level', 'place', 'outcome', 'loss_reason', 'resume_on', 'courses_sent', 'price_sent']::text[]);
