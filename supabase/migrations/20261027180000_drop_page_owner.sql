-- Pages no longer have an owner.
alter table public.pages drop column owner_id;
