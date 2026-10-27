# NaNu Wiki

Internal knowledge base + onboarding portal for NaNu NaNa (HCM · Hà Nội · Stuttgart).
German main text, Vietnamese underneath, with a DE+VI / DE / VI toggle.

**Stack:** Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · Supabase (Postgres, Auth, RLS) · Google sign-in · Slack · GSAP · Vercel · GitHub

---

## What's inside

| Area | Where |
| --- | --- |
| Home ("Neuigkeiten"), "Start hier", Für alle table, role cards | `src/app/(app)/page.tsx` |
| Role page with tabs Interview / Onboarding / Handbuch | `src/app/(app)/bereich/[slug]/page.tsx` |
| Page view (SOPs etc.), table of contents, YouTube blocks | `src/app/(app)/bereich/[slug]/[page]/page.tsx` |
| Weekly quiz (graded on the server) | `src/app/(app)/quiz/[id]`, `src/components/QuizRunner.tsx` |
| Search with filters by type, role, "nur geprüfte" | `src/app/(app)/suche/page.tsx` |
| Admin: approve sign-ups, set roles, buddy, editor areas | `src/app/(app)/admin/benutzer` |
| Slack: buddy notifications | `src/lib/slack.ts`, `src/app/actions.ts` |
| **All content**: areas, pages, onboarding weeks, quizzes | `src/content/` |
| Database schema + RLS (people and progress only) | `supabase/migrations/` (latest: `20261027230000_content_in_code.sql`) |

### Content lives in code
Everything people read is hard-coded in `src/content` and ships with each deploy; the database only stores
profiles/roles and progress (`checklist_progress`, `quiz_attempts`, `chat_responses`).

- **New page:** add `src/content/pages/<area>/<slug>.ts` (a `PageContent` with bilingual blocks) and list it in
  `src/content/pages/index.ts`. URL: `/bereich/<area>/<slug>`. Bump `updated_at` when you change a page.
- **Onboarding & quiz:** `src/content/onboarding/<area>.ts`. Checklist item `id`s and quiz `id`s are what progress
  rows point at – keep them stable, otherwise people lose their ticks/attempts for that item.
- **Areas:** `src/content/areas.ts`. The slug is stored on profiles (`primary_area`, `candidate_area`) and `area_editors`.
- Old `/seite/<uuid>` links redirect to the new URLs (`next.config.ts`).

### Access levels (checked in `src/content/index.ts` for content, RLS in Postgres for progress)

| Level | Can see / do |
| --- | --- |
| `pending` | Nothing – waits on `/pending` until an admin approves (every new Google sign-up starts here) |
| `candidate` | Only the **Interview** tab of the one role they applied for |
| `staff` | Read all published pages, own onboarding checklist, quizzes, search |
| `editor` | Staff + sees drafts and candidates' chat answers in the areas an admin assigns |
| `admin` | Everything, including user management |

Security notes: users can never change their own role (DB trigger), quiz answers never reach the browser
(`src/content` is server-only; grading happens in server actions), and the service-role key is used only to
write quiz attempts, so nobody can record a pass from the browser.

### Explainer videos
Add a `video` block anywhere in a page's `body` (in `src/content/pages`) with any YouTube URL (watch, youtu.be, shorts, embed).
The player loads only on click, via `youtube-nocookie.com`.

---

## Setup (about 30 minutes)

### 1. Install and run locally
```bash
cd ~/nanu-wiki
npm install
cp .env.example .env.local   # fill in values from the steps below
npm run dev                  # http://localhost:3000
```

### 2. Supabase
1. Create a project at <https://supabase.com> (region: Singapore is closest to Vietnam).
2. Apply the migrations: `supabase link --project-ref <ref>` → `supabase db push`
   (or run every file in `supabase/migrations/` in order in the **SQL Editor**). There is no seed – content is in code.
3. **Project Settings → API** → copy URL, `anon` key and `service_role` key into `.env.local`.

### 3. Google sign-in
1. Google Cloud Console → APIs & Services → **Credentials** → *Create OAuth client ID* → *Web application*.
2. Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
3. Supabase → **Authentication → Providers → Google** → enable, paste Client ID + Secret.
4. Supabase → **Authentication → URL Configuration**: Site URL = your Vercel URL;
   add redirect URLs `http://localhost:3000/auth/callback` and `https://<your-domain>/auth/callback`.

### 4. Make yourself admin
Sign in once with Google, then in the Supabase SQL editor:
```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```
From then on, approve everyone else under **Benutzer & Rollen** in the app.

### 5. Slack
1. <https://api.slack.com/apps> → *Create New App* → *From scratch*.
2. **OAuth & Permissions** → Bot Token Scopes: `chat:write`, `im:write`, `users:read`, `users:read.email`.
3. Install to your workspace and copy the **Bot User OAuth Token** (`xoxb-…`) to `SLACK_BOT_TOKEN`.

What it sends (people are matched by their Google e-mail = Slack e-mail):
- **To the buddy** when a new hire finishes an onboarding week or takes a weekly quiz.

### 6. GitHub
```bash
cd ~/nanu-wiki
git init && git add . && git commit -m "NaNu Wiki: initial project"
gh repo create nanunana/nanu-wiki --private --source=. --push   # or create the repo on github.com and push
```

### 7. Vercel
1. <https://vercel.com/new> → import the GitHub repo (framework: Next.js, defaults are fine).
2. Add all variables from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to the Vercel URL).
3. Deploy.

---

## Not in v1 (good next steps)
- Rich-text formatting inside paragraphs (bold/links).
- Location-based visibility for Operations pages.
- Generated Supabase types (`supabase gen types typescript`) for stricter typing.
