---
name: einfach-formulieren
description: Rewrite NaNu Wiki handbook text (German + Vietnamese, in src/content/pages/**) so a young person who has never worked can understand it on first read — clear and direct, but not childish. Use whenever the user says a passage is hard to read, asks to "vereinfachen", "verständlicher", "leichter lesbar", "einfacher formulieren", "so dass ein Jugendlicher es versteht", "wie oben", or points at a block on a wiki page and asks for simpler wording.
---

# Einfach formulieren

Target reader: a young adult in their first job. They are smart but know no office jargon and none of our internal habits. Write so they can act on the text without asking anyone. Do not write for a child: no "wir machen jetzt…", no over-explaining obvious words, no cute tone.

## Before you rewrite

- Read the whole page in `src/content/pages/<area>/<slug>.ts`, not only the selected block. The new text must fit what comes before and after.
- Never change facts while simplifying. If a fact looks wrong or unclear, ask. Only change facts the user corrects, and say in your reply what you removed or changed.
- Rewrite the Vietnamese (`vi`, `body_vi`, …) to match the new German. Use the same structure and the same level of simplicity. Use "học viên" for Schüler.

## Rules

1. **One idea per sentence.** Split long sentences joined with ":", "–", ";" or "dazu".
2. **Enumerations become a list.** If a sentence names 3 or more things (what to write down, what to check, what a report contains), write one short lead-in sentence ending in ":", then add a `list` block. Each item is a short phrase continuing that sentence, ending in "," with the last one starting with "und" and ending in ".". Example (page `lehrkraefte-begleiten`):
   - "Nach jeder Stunde trägt die Lehrkraft dort zu jedem Schüler ein:" → "ob der Schüler im Unterricht aktiv mitgemacht hat," … "und ein kurzes Feedback, wie es mit dem Schüler insgesamt läuft."
   - Block types live in `src/lib/types.ts`. Lists cannot be nested, so split one long bullet into paragraph + list + paragraph instead of packing it into a single item.
3. **Address the reader as "du" and say who does what.** "Jeden Tag prüfst du …", "Die Lehrkraft trägt … ein". Avoid passive voice when a person acts ("wird geprüft" → "du prüfst").
4. **Everyday words over office words.** "festhalten" → "aufschreiben", "Nachweis" is fine but "Betrag" → "wie viel Geld", "Rückmeldung" → "sagen, wo er steht". Keep fixed names of our tools and things (Backoffice, Tagesbericht, Excel-Liste, Mini-Test, Zalo, Slack) but explain them once if the page has not yet.
5. **Concrete times and numbers.** "jeden Tag", "nach jeder Stunde", "am Monatsende" — not "regelmäßig" or "zeitnah".
6. **Give the reason in one short sentence** when a rule could look pointless ("Sonst weiß am Monatsende niemand mehr, wer gut unterrichtet hat."). Do not add reasons the original did not have.
7. **Shorter, not longer.** The result should have about as many words as the original or fewer. Cut filler ("dabei", "entsprechend", "grundsätzlich").
8. Follow the existing handbook rules: departments/roles instead of employee names, "Schüler" not "Teilnehmende".

## After the rewrite

- Run `npx tsc --noEmit -p .`.
- Open the page on the dev server (port 3000) and read the changed section with `get_page_text` or a screenshot.
- Show the user the new German text in your reply.
