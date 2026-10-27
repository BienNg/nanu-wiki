-- NaNu Wiki – Messenger simulation
-- A "chat" block in pages.body plays messages from an imaginary customer; the user types the replies.
-- Each finished run is stored here; editors of the area and admins read the transcripts.

create table public.chat_responses (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  sim_id text not null,                                   -- the "id" of the chat block inside pages.body
  profile_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  turns jsonb not null                                    -- [{ "customer": "...", "reply": "...", "seconds": 42 }, ...]
    check (jsonb_typeof(turns) = 'array' and jsonb_array_length(turns) between 1 and 30),
  created_at timestamptz not null default now(),
  unique (page_id, sim_id, profile_id)                    -- one attempt per person and simulation
);
create index chat_responses_page_idx on public.chat_responses (page_id);

alter table public.chat_responses enable row level security;

-- Anyone approved may submit their own run, but only for a page they can read (the subquery runs under pages RLS).
create policy chat_responses_insert on public.chat_responses for insert with check (
  profile_id = auth.uid()
  and public.my_role() <> 'pending'
  and exists (select 1 from public.pages p where p.id = page_id)
);

-- Own runs; editors of the page's area and admins see everyone's.
create policy chat_responses_read on public.chat_responses for select using (
  profile_id = auth.uid()
  or public.can_edit_area((select p.area_id from public.pages p where p.id = page_id))
);

create policy chat_responses_admin_delete on public.chat_responses for delete using (public.is_admin());

-- Existing databases: add the sample simulation to the Sales interview page from seed.sql
-- (no-op on a fresh database, where the seed already contains it).
update public.pages
set body = body || '[
  {"type":"heading","de":"Messenger-Simulation","vi":"Mô phỏng Messenger"},
  {"type":"chat","id":"sales-test","customer":"Linh",
   "intro_de":"Linh schreibt der NaNu-NaNa-Seite auf Messenger. Antworte so, wie du es im Job tun würdest – auf Vietnamesisch. Die Zeit läuft ab jeder neuen Nachricht.",
   "intro_vi":"Linh nhắn tin cho trang NaNu NaNa trên Messenger. Hãy trả lời như khi bạn đang làm việc – bằng tiếng Việt. Thời gian được tính từ mỗi tin nhắn mới.",
   "messages":[
     {"text":"Chào ad\n\nCho mình hỏi học phí khoá A1 bao nhiêu vậy ạ?","translation_de":"„Hallo Admin! Darf ich fragen, wie viel der A1-Kurs kostet?“"},
     {"text":"Mình đang học lớp 12, muốn sang Đức học nghề điều dưỡng. Giờ mới bắt đầu học tiếng Đức thì có kịp không ạ?","translation_de":"„Ich bin in der 12. Klasse und möchte in Deutschland eine Pflege-Ausbildung machen. Schaffe ich das, wenn ich jetzt erst mit Deutsch anfange?“"},
     {"text":"Trung tâm kia rẻ hơn bên mình 2 triệu lận\n\nBên mình có giảm giá gì không ad?","translation_de":"„Bei der anderen Schule ist es ganze 2 Millionen günstiger. Gibt es bei euch irgendeinen Rabatt?“"}
   ]}
]'::jsonb
where id = '00000000-0000-0000-0000-0000000b0005'
  and not body @> '[{"type":"chat"}]'::jsonb;
