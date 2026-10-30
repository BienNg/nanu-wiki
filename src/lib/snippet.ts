import type { Block, PageWithMeta } from "@/lib/types";
import { defaultSelection, resolveConversation } from "@/lib/dialogue";

/** Flattens German + Vietnamese text of all blocks (for snippets). */
function blockTexts(blocks: Block[]): { de: string; vi: string }[] {
  return blocks.flatMap((b): { de: string; vi: string }[] => {
    switch (b.type) {
      case "heading":
      case "paragraph":
      case "callout":
      case "link":
        return [{ de: b.de, vi: b.vi }];
      case "list":
      case "steps":
        return b.items.map((i) => ({ de: `${i.de} ${"body_de" in i ? (i.body_de ?? "") : ""}`, vi: i.vi }));
      case "template":
        return [{ de: b.translation_de ?? b.text, vi: b.text }];
      case "video":
        return [{ de: b.caption_de ?? "", vi: b.caption_vi ?? "" }];
      case "chat":
        return [{ de: b.intro_de ?? "", vi: b.intro_vi ?? "" }, { de: b.message.translation_de ?? b.message.text, vi: b.message.text }];
      case "conversation": {
        // Search the text as shown by default (bạn, default level and place), not the raw {tokens}.
        const c = resolveConversation(b, defaultSelection(b));
        return [...c.messages.map((m) => ({ de: m.translation_de ?? m.text, vi: m.text })), { de: c.note_de ?? "", vi: c.note_vi ?? "" }];
      }
      case "conversation_tabs":
        return b.tabs.map((t) => ({ ...t, ...resolveConversation(t, defaultSelection(t)) })).flatMap((t) => [
          ...t.messages.flatMap((m) => [{ de: m.translation_de ?? m.text, vi: m.text }, { de: m.note_de ?? "", vi: m.note_vi ?? "" }]),
          { de: t.note_de ?? "", vi: t.note_vi ?? "" },
          { de: t.goal_de ?? "", vi: t.goal_vi ?? "" },
        ]);
      case "channels":
        return [
          { de: b.reel.caption_de, vi: b.reel.caption_vi },
          { de: b.profile.bio_de, vi: b.profile.bio_vi },
          { de: b.note_de ?? "", vi: b.note_vi ?? "" },
        ];
      case "mcq":
        return b.questions.map((q) => ({ de: q.question_de, vi: q.question_vi }));
      default:
        // Blocks this build doesn't know yet (content can be newer than the deployed code).
        return [];
    }
  });
}

export function snippet(page: PageWithMeta, q: string) {
  const texts = blockTexts(page.body ?? []);
  const needle = q.toLowerCase();
  const hit = texts.find((t) => t.de.toLowerCase().includes(needle) || t.vi.toLowerCase().includes(needle)) ?? texts[0];
  if (!hit) return null;
  const src = hit.de.toLowerCase().includes(needle) || !q ? hit.de : hit.vi;
  const at = q ? src.toLowerCase().indexOf(needle) : -1;
  if (at < 0) return { pre: src.slice(0, 160), hit: "", post: src.length > 160 ? " …" : "", vi: hit.vi.slice(0, 140) };
  const start = Math.max(0, at - 60);
  return {
    pre: (start > 0 ? "… " : "") + src.slice(start, at),
    hit: src.slice(at, at + q.length),
    post: src.slice(at + q.length, at + q.length + 90) + " …",
    vi: hit.vi.slice(0, 140),
  };
}
