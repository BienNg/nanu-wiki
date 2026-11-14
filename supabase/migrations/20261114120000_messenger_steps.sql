-- Messenger labels: new steps, fixed Ort values, no A0, and the two "geschickt" fields.
--
-- Steps (stage) are now: qualifizieren, bedarf, kurse, preis, anmeldung, or 'unklar' for chats
-- without a step (another Interesse, existing students, not a lead). See src/lib/messenger/steps.ts.
-- Before, the column held the reply assistant's stage names ('🟡 1. First Contact' …).
--
-- Run once. Rows that already hold a new step are left alone.

-- 1. A0 no longer exists: a beginner is A1.
update public.messenger_labels set level = 'A1' where level = 'A0';

-- 2. Ort was free text; it is now Saigon, Hanoi, Online VN, Online DE or unklar (same rules as placeOf in types.ts).
update public.messenger_labels
set place = case
  when lower(place) = 'saigon' then 'Saigon'
  when lower(place) = 'hanoi' then 'Hanoi'
  when lower(place) = 'online vn' then 'Online VN'
  when lower(place) = 'online de' then 'Online DE'
  when place ~* 'h[aà]\s*n[oộ]i' then 'Hanoi'
  when place ~* 's[aà]i\s*g[oò]n|hcm|h[oồ] ch[ií] minh' then 'Saigon'
  when place ~* '(^|[^[:alpha:]])(đức|duc|deutschland|germany)($|[^[:alpha:]])' then 'Online DE'
  else 'unklar'
end
where place is not null and place not in ('Saigon', 'Hanoi', 'Online VN', 'Online DE', 'unklar');

-- 3. Old "During Class" becomes Status Schüler, unless the chat is already closed another way.
update public.messenger_labels
set outcome = 'bestandskunde', loss_reason = null
where stage = '🟢 5. During Class' and outcome not in ('kein_lead', 'verloren', 'bestandskunde');

-- 4. "Kurse geschickt" and "Preis geschickt": two fields only staff set (and can take back).
--    Old Beratung counts as courses sent, old Enrollment as courses and price sent.
alter table public.messenger_labels
  add column courses_sent boolean not null default false,
  add column price_sent boolean not null default false;

update public.messenger_labels
set courses_sent = true, price_sent = (stage = '🟢 4. Enrollment')
where stage in ('🔵 3. Consultation', '🟢 4. Enrollment');

-- 5. The step follows from the fields: the first thing that is still open.
--    Old hand-picked stages are no longer pinned, so the step can follow the fields from now on.
update public.messenger_labels
set
  stage = case
    when outcome in ('kein_lead', 'bestandskunde') then 'unklar'
    when interest is null or interest in ('unklar', 'keins') then 'qualifizieren'
    when interest <> 'Sprachkurs' then 'unklar'
    when level is null or level = 'unklar' or place is null or place = 'unklar' then 'bedarf'
    when not courses_sent then 'kurse'
    when not price_sent then 'preis'
    else 'anmeldung'
  end,
  pinned = array_remove(pinned, 'stage')
where stage not in ('qualifizieren', 'bedarf', 'kurse', 'preis', 'anmeldung');
