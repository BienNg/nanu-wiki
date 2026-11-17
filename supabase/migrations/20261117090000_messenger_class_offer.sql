-- Special-offer outreach per class: right before a class starts, every chat assigned to it gets a
-- message with a special offer. offer_status tracks that per chat and class, set by hand only:
-- 'offen' (still to write), 'geschickt' (offer sent), 'uebersprungen' (deliberately not written).
-- See src/lib/messenger/classes.ts (OFFER_STATES).

alter table public.messenger_class_assignments
  add column offer_status text not null default 'offen' check (offer_status in ('offen', 'geschickt', 'uebersprungen')),
  add column offer_set_at timestamptz,
  add column offer_set_by uuid references auth.users(id);

-- Until now assignments were only inserted and deleted; the offer status needs updates.
create policy messenger_class_assignments_update on public.messenger_class_assignments
  for update using (public.is_admin()) with check (public.is_admin());
