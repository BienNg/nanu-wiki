-- "Bezahlt": staff mark that the person paid for the course.
-- The app then moves a Sprachkurs chat to the Schüler step and sets the status to Schüler.
-- See src/lib/messenger/steps.ts. Existing rows stay unpaid.

alter table public.messenger_labels
  add column if not exists paid boolean not null default false;
