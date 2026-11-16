---
name: ui-section-redesign
description: Redesign one section of the NaNu Wiki admin UI (a panel, list, card, toolbar, empty state, modal …) so it looks modern and is understood at a glance, using the Gestalt laws (Nähe, Ähnlichkeit, Kontinuität, Figur-Grund) and Shneiderman's 8 Golden Rules, while keeping exactly the same functionality. Use whenever the user shares a screenshot of part of the app and asks to "redesign", "modernisieren", "übersichtlicher machen", "make it look modern / intuitive", "make X more visible", "make this bigger so it's clear", remove a label or badge, or says "like the Kurse panel", even if they don't name the skill.
---

# UI section redesign

The goal: a staff member sees what matters in this section within a second, and knows what to do next. Change only the look and layout; behaviour stays the same.

## 1. Find and understand the section

- Find the component through text that's visible in the screenshot: `grep -rln "<visible text>" src`. Admin UI lives in `src/components/admin/`.
- Read the whole component and the types and helpers it uses (e.g. `src/lib/messenger/*`, `src/lib/classes.ts`). List the data each item has. Fields that exist but aren't shown yet (dates, counts, links) are often what "make the info more visible" means.
- Write down every behaviour before you change anything: clicks, add/remove, optimistic updates and rollback, caching, collapse state in localStorage, view transitions, search filtering, error/retry, loading. All of them must still work afterwards.

## 2. Decide what the section is for

Answer these in one or two lines each:
- What is the main information? Make it the biggest and darkest text.
- What does the user do here (the primary action)? Make it obvious and easy to hit (at least 28 px).
- What is the most important state (empty, missing, error, full)? It must stand out. A missing state the user has to fix gets a large, coloured, centred card with an icon, a bold heading and a hint that shows the action ("Unten mit (+) zuordnen").

If the user asks to remove a label or badge, keep the meaning in a better form. Example: the "Passt" badge became grouped sections with a heading that says *what* matches ("Für A1 · Online DE").

## 3. Apply the principles

**Gesetz der Nähe (proximity)**
- One item = one card. Keep the spacing between items even (`gap-2`) and larger than the spacing inside a card.
- Group related items into sections with a heading and a count badge. If the list scrolls, make the headings sticky (`sticky top-0`).

**Gesetz der Ähnlichkeit (similarity)**
- Same kind of information = same look on every card: chips for categories, an icon plus text for facts.
- Give each category value (place, mode, status) its own soft colour (soft background with dark text in the same hue). Keep red only for problems (full, error, delete on hover). Keep accent blue for actions and "selected/assigned".

**Kontinuität (continuity)**
- Each card reads in the same fixed order, top to bottom: identifier, then category chips, then facts (when, time, count), then warnings.
- Put the action button in the same spot on every card (top right, `absolute`).

**Figur–Grund (figure–ground)**
- Panel background `#F6F7F9`, cards white with `border-line` and `rounded-xl`, a subtle shadow on hover.
- Selected/assigned items get a tinted background (`bg-accent-soft/40 border-accent/40`) so they read as a different layer.
- The panel header and search area are white with a bottom border, which separates them from the scrolling content.

**Shneiderman's 8 Golden Rules**
1. Consistency: reuse the existing tokens, icons and the chip and card patterns from the rest of the app.
2. Shortcuts for frequent users: keep search, keyboard focus and existing shortcuts working.
3. Informative feedback: skeleton placeholders while loading (`animate-pulse` cards, not "…"), a faded card while saving, clear hover states.
4. Dialogs that close: after an action the item visibly moves (view transitions) or changes state.
5. Prevent errors: disable buttons while busy, and show a hint when needed input is missing (e.g. "Niveau und Ort setzen").
6. Easy reversal: remove/undo stays one click away.
7. User in control: no automatic actions the user didn't trigger.
8. Less memory load: show derived info so nobody has to calculate it (weekday plus "in 3 Tagen", "läuft seit 11 T.", student count), and use short codes as titles with the full name in a `title` tooltip.

## 4. Project conventions

- Every UI string is bilingual through `<Label de="…" vi="…" />` from `@/components/Bi` (it shows one language; the DE+VI / DE / VI toggle switches). Use "học viên" for Schüler.
- Tokens in `src/app/globals.css`: `text-ink`, `text-muted`, `text-faint`, `border-line`, `bg-hover`, `text-accent`, `bg-accent-soft`. Use arbitrary hex values only for the soft category colours.
- Icons: `<Icon name="…" />` from `@/components/Icon` (stroke paths on a 24×24 grid). If an icon is missing, add a path to `PATHS` and its name to the key type.
- Keep `max-lg:hidden` and similar responsive rules that the section already had.

## 5. Verify

- Run `npx tsc --noEmit -p .`.
- The dev server runs on port 3000 only. If it's already running, `navigate` to `http://localhost:3000/...` instead of starting another one. Never fall back to another port.
- Panels hidden below `lg` need a wide viewport: `resize_window` to 1440×900, then open a real item that shows the section and take a screenshot. Check the empty, loading and filled states and the console for errors. Reset the viewport to `desktop` when done.
- Don't click actions that write real data (assign, send, delete) just to test them, unless the user asks. Say in the reply that they weren't clicked.

## 6. Report

Tell the user, grouped by principle, what changed and why, in short bullets. Name what wasn't tested. Don't commit unless asked.
