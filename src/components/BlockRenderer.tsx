import type { Block } from "@/lib/types";
import { Bi, Label } from "./Bi";
import { Icon } from "./Icon";
import { VideoEmbed } from "./VideoEmbed";
import { CopyButton } from "./CopyButton";
import { MessengerSim } from "./MessengerSim";
import { MessengerMockup } from "./MessengerMockup";
import { ConversationTabs } from "./ConversationTabs";
import { ChannelMockups } from "./ChannelMockups";
import { McqCards } from "./McqCards";
import { blockKey } from "@/lib/comments";

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CALLOUT = {
  info: { box: "bg-[#EEF4FB] text-[#21476E]", icon: "#2C6ECB", de: "Hinweis", vi: "Lưu ý" },
  tip: { box: "bg-ok-soft text-[#1C5E3A]", icon: "#23794A", de: "Tipp", vi: "Mẹo" },
  warning: { box: "bg-warn-soft text-[#5C4505]", icon: "#A87400", de: "Achtung", vi: "Cảnh báo" },
} as const;

/** `chat`: which page the blocks belong to and which simulations / multiple-choice rounds the viewer already submitted. */
export function BlockRenderer({ blocks, chat }: { blocks: Block[]; chat?: { pageId: string; done: string[] } }) {
  return (
    <div className="flex flex-col gap-5 text-[15px] leading-[1.7] text-ink">
      {blocks.map((b, i) => (
        // `data-block` is what comments point at (see CommentLayer).
        <div key={i} data-block={blockKey(b)} className="flex flex-col">
          {renderBlock(b, i, chat)}
        </div>
      ))}
    </div>
  );
}

function renderBlock(b: Block, i: number, chat?: { pageId: string; done: string[] }) {
  switch (b.type) {
    case "heading":
      return (
        <h2 key={i} id={slugify(b.de)} data-reveal className="font-display mt-3 scroll-mt-6 text-2xl font-bold leading-tight tracking-tight text-heading">
          <Bi de={b.de} vi={b.vi} />
        </h2>
      );
    case "paragraph":
      return (
        <p key={i} data-reveal className="m-0 whitespace-pre-line">
          <Bi de={b.de} vi={b.vi} />
        </p>
      );
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag key={i} data-reveal className={`m-0 flex flex-col gap-1 pl-6 ${b.ordered ? "list-decimal" : "list-disc"}`}>
          {b.items.map((it, j) => (
            <li key={j}>
              <Bi de={it.de} vi={it.vi} />
            </li>
          ))}
        </Tag>
      );
    }
    case "steps":
      return (
        <ol key={i} data-reveal className="m-0 flex list-decimal flex-col gap-4 pl-6 marker:font-semibold marker:text-muted">
          {b.items.map((it, j) => (
            <li key={j}>
              <h3 className="m-0 text-base font-semibold leading-snug">
                <Bi de={it.de} vi={it.vi} />
              </h3>
              {it.body_de ? (
                <p className="m-0 mt-0.5 text-body">
                  <Bi de={it.body_de} vi={it.body_vi} />
                </p>
              ) : null}
              {it.template ? (
                <div className="mt-2 overflow-hidden rounded-lg border border-line">
                  <div className="flex items-center justify-between gap-2.5 border-b border-line bg-side py-1.5 pl-3 pr-2">
                    <span className="cap">
                      <Label de={it.template.label_de} vi={it.template.label_vi} />
                    </span>
                    <CopyButton text={it.template.text} />
                  </div>
                  <p className="m-0 px-3.5 py-3 text-sm">{it.template.text}</p>
                  {it.template.translation_de ? <p className="de m-0 px-3.5 pb-3 text-[13px] text-muted">{it.template.translation_de}</p> : null}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      );
    case "callout": {
      const c = CALLOUT[b.tone];
      return (
        <aside key={i} data-reveal className={`flex gap-3 rounded-lg px-4 py-3 text-sm leading-relaxed ${c.box}`}>
          <Icon name={b.tone === "warning" ? "shield" : "spark"} size={16} color={c.icon} strokeWidth={2} className="mt-[3px] flex-none" />
          <div>
            <strong data-ui-text className="font-semibold">
              <Label de={c.de} vi={c.vi} />:
            </strong>{" "}
            <Bi de={b.de} vi={b.vi} />
          </div>
        </aside>
      );
    }
    case "funnel": {
      const n = b.stages.length;
      const TONE = { brand: "bg-[#6C66D3] text-white", dark: "bg-[#35798A] text-white", light: "bg-[#78C9F9] text-[#0F2233]" } as const;
      return (
        <div key={i} data-reveal className="flex flex-col items-center gap-2.5">
          {b.stages.map((s, j) => (
            <div
              key={j}
              className={`flex flex-col items-center rounded-full px-6 py-3 text-center leading-tight ${TONE[s.tone]}`}
              style={{ width: `${100 - (j * 50) / Math.max(n - 1, 1)}%` }}
            >
              <span className="font-display text-lg font-semibold"><Bi de={s.de} vi={s.vi} /></span>
              <span className="text-sm opacity-85">{s.sub}</span>
            </div>
          ))}
          {b.legend ? (
            <ul className="m-0 mt-2 flex list-none flex-wrap justify-center gap-x-5 gap-y-1.5 p-0 text-sm text-body">
              {b.legend.map((l, j) => (
                <li key={j} className="flex items-center gap-2">
                  <span className={`size-3 flex-none rounded-full ${TONE[l.tone]}`} />
                  <Bi de={l.de} vi={l.vi} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }
    case "template":
      return (
        <div key={i} data-reveal className="overflow-hidden rounded-lg border border-line">
          <div className="flex items-center justify-between gap-2.5 border-b border-line bg-side py-1.5 pl-3 pr-2">
            <span className="cap">
              <Label de={b.label_de} vi={b.label_vi} />
            </span>
            <CopyButton text={b.text} />
          </div>
          <p className="m-0 px-3.5 py-3 text-sm">{b.text}</p>
          {b.translation_de ? <p className="de m-0 px-3.5 pb-3 text-[13px] text-muted">{b.translation_de}</p> : null}
        </div>
      );
    case "video":
      return (
        <div key={i} data-reveal>
          <VideoEmbed url={b.url} captionDe={b.caption_de} captionVi={b.caption_vi} />
        </div>
      );
    case "link":
      return (
        <a
          key={i}
          data-reveal
          href={b.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-sm no-underline hover:bg-side"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">
              <Bi de={b.de} vi={b.vi} />
            </span>
            <span className="block truncate text-[13px] text-muted">{b.url}</span>
          </span>
          <span aria-hidden className="flex-none text-muted">↗</span>
        </a>
      );
    case "chat":
      return <MessengerSim key={i} block={b} pageId={chat?.pageId} done={chat?.done.includes(b.id)} />;
    case "conversation":
      return <MessengerMockup key={i} block={b} />;
    case "conversation_tabs":
      return <ConversationTabs key={i} block={b} />;
    case "channels":
      return <ChannelMockups key={i} block={b} />;
    case "mcq":
      return (
        <McqCards
          key={i}
          id={b.id}
          pageId={chat?.pageId}
          intro={b.intro_de ? { de: b.intro_de, vi: b.intro_vi ?? "" } : undefined}
          // Only question and options go to the browser, never `correct`.
          questions={b.questions.map((q) => ({ question_de: q.question_de, question_vi: q.question_vi, options: q.options }))}
          done={chat?.done.includes(b.id)}
        />
      );
    default:
      return null;
  }
}
