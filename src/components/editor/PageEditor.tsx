"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePage, savePage } from "@/app/actions";
import type { Block, KnowledgeKind, Page, PageSection } from "@/lib/types";
import { youtubeId } from "@/lib/youtube";
import { KIND } from "../Badges";
import { useNavigationLoader } from "../NavigationLoader";

const NEW_BLOCK: Record<Block["type"], () => Block> = {
  heading: () => ({ type: "heading", de: "", vi: "" }),
  paragraph: () => ({ type: "paragraph", de: "", vi: "" }),
  list: () => ({ type: "list", items: [{ de: "", vi: "" }] }),
  steps: () => ({ type: "steps", items: [{ de: "", vi: "", body_de: "", body_vi: "" }] }),
  callout: () => ({ type: "callout", tone: "info", de: "", vi: "" }),
  template: () => ({ type: "template", label_de: "Vorlage", label_vi: "Mẫu", text: "", translation_de: "" }),
  video: () => ({ type: "video", url: "", caption_de: "", caption_vi: "" }),
  chat: () => ({ type: "chat", id: Math.random().toString(36).slice(2, 10), customer: "", intro_de: "", intro_vi: "", messages: [{ text: "", translation_de: "" }] }),
};

const BLOCK_LABEL: Record<Block["type"], string> = {
  heading: "Überschrift · Tiêu đề",
  paragraph: "Absatz · Đoạn văn",
  list: "Liste · Danh sách",
  steps: "Schritte · Các bước",
  callout: "Hinweis · Ghi chú",
  template: "Vorlage · Mẫu tin nhắn",
  video: "YouTube-Video",
  chat: "Messenger-Simulation · Mô phỏng Messenger",
};

const input = "w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent-soft";

export function PageEditor({ page, areaSlug }: { page: Page; areaSlug: string }) {
  const router = useRouter();
  const showLoader = useNavigationLoader();
  const go = (href: string) => {
    showLoader(href);
    router.push(href);
  };
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [meta, setMeta] = useState({
    title_de: page.title_de,
    title_vi: page.title_vi,
    kind: page.kind,
    section: page.section,
    verified_until: page.verified_until ?? "",
    published: page.published,
  });
  const [blocks, setBlocks] = useState<Block[]>(page.body ?? []);

  const update = (i: number, next: Block) => setBlocks((bs) => bs.map((b, j) => (j === i ? next : b)));
  const move = (i: number, dir: -1 | 1) =>
    setBlocks((bs) => {
      const j = i + dir;
      if (j < 0 || j >= bs.length) return bs;
      const copy = [...bs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await savePage(page.id, { ...meta, verified_until: meta.verified_until || null, body: blocks });
      if (res.ok) go(`/seite/${page.id}`);
      else setMessage(res.message);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-8 pb-24 pt-6">
      <section className="grid gap-3 rounded-[10px] border border-line p-4 sm:grid-cols-2">
        <Field label="Titel (Deutsch)">
          <input className={input} value={meta.title_de} onChange={(e) => setMeta({ ...meta, title_de: e.target.value })} />
        </Field>
        <Field label="Tiêu đề (Tiếng Việt)">
          <input className={input} value={meta.title_vi} onChange={(e) => setMeta({ ...meta, title_vi: e.target.value })} />
        </Field>
        <Field label="Wissenstyp · Loại kiến thức">
          <select className={input} value={meta.kind} onChange={(e) => setMeta({ ...meta, kind: e.target.value as KnowledgeKind })}>
            {(Object.keys(KIND) as KnowledgeKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND[k].de} · {KIND[k].vi}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Bereich · Mục">
          <select className={input} value={meta.section} onChange={(e) => setMeta({ ...meta, section: e.target.value as PageSection })}>
            <option value="general">Allgemein · Chung</option>
            <option value="interview">Interview · Phỏng vấn</option>
            <option value="onboarding">Onboarding · Hội nhập</option>
            <option value="handbook">Handbuch · Sổ tay</option>
          </select>
        </Field>
        <Field label="Geprüft bis · Đã duyệt đến">
          <input type="date" className={input} value={meta.verified_until} onChange={(e) => setMeta({ ...meta, verified_until: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink">
          <input type="checkbox" className="h-4 w-4 accent-accent" checked={meta.published} onChange={(e) => setMeta({ ...meta, published: e.target.checked })} />
          Veröffentlicht · Đã xuất bản
        </label>
      </section>

      <div className="flex flex-col gap-3">
        {blocks.map((b, i) => (
          <section key={i} className="rounded-[10px] border border-line bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-line-soft bg-side px-3 py-1.5">
              <span className="cap">{BLOCK_LABEL[b.type]}</span>
              <span className="flex gap-1">
                <SmallBtn onClick={() => move(i, -1)} label="Nach oben">↑</SmallBtn>
                <SmallBtn onClick={() => move(i, 1)} label="Nach unten">↓</SmallBtn>
                <SmallBtn onClick={() => setBlocks((bs) => bs.filter((_, j) => j !== i))} label="Block löschen">✕</SmallBtn>
              </span>
            </div>
            <div className="p-3">
              <BlockFields block={b} onChange={(nb) => update(i, nb)} />
            </div>
          </section>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-[10px] border border-dashed border-line p-3">
        <span className="cap mr-2 self-center">+ Block</span>
        {(Object.keys(NEW_BLOCK) as Block["type"][]).map((t) => (
          <button key={t} type="button" onClick={() => setBlocks((bs) => [...bs, NEW_BLOCK[t]()])} className="h-8 rounded-md bg-chip px-2.5 text-xs font-medium text-ink hover:bg-line">
            {BLOCK_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-2 self-center rounded-lg border border-line bg-white p-1.5 shadow-[0_6px_20px_rgba(16,24,40,.12)]">
        {message && <span role="alert" className="px-2 text-[13px] text-bad">{message}</span>}
        <button
          type="button"
          onClick={() => {
            if (confirm("Seite wirklich löschen? · Xóa trang này?")) {
              showLoader(`/bereich/${areaSlug}`);
              startTransition(() => deletePage(page.id, areaSlug));
            }
          }}
          className="h-9 rounded-md px-3 text-[13px] font-medium text-bad hover:bg-bad-soft"
        >
          Löschen
        </button>
        <button type="button" onClick={() => go(`/seite/${page.id}`)} className="h-9 rounded-md bg-chip px-3 text-[13px] font-medium text-ink hover:bg-line">
          Abbrechen · Hủy
        </button>
        <button type="button" disabled={pending} onClick={save} className="h-9 rounded-md bg-accent px-4 text-[13px] font-medium text-white hover:bg-[#1F5DB5] disabled:opacity-60">
          {pending ? "Speichert …" : "Speichern · Lưu"}
        </button>
      </div>
    </div>
  );
}

function BlockFields({ block: b, onChange }: { block: Block; onChange: (b: Block) => void }) {
  switch (b.type) {
    case "heading":
    case "paragraph": {
      const Tag = b.type === "heading" ? "input" : "textarea";
      return (
        <Pair
          de={<Tag className={input} rows={3} value={b.de} onChange={(e) => onChange({ ...b, de: e.target.value })} />}
          vi={<Tag className={input} rows={3} value={b.vi} onChange={(e) => onChange({ ...b, vi: e.target.value })} />}
        />
      );
    }
    case "callout":
      return (
        <div className="flex flex-col gap-2">
          <select className={`${input} max-w-[220px]`} value={b.tone} onChange={(e) => onChange({ ...b, tone: e.target.value as typeof b.tone })}>
            <option value="info">Hinweis · Lưu ý</option>
            <option value="tip">Tipp · Mẹo</option>
            <option value="warning">Achtung · Cảnh báo</option>
          </select>
          <Pair
            de={<textarea className={input} rows={2} value={b.de} onChange={(e) => onChange({ ...b, de: e.target.value })} />}
            vi={<textarea className={input} rows={2} value={b.vi} onChange={(e) => onChange({ ...b, vi: e.target.value })} />}
          />
        </div>
      );
    case "list":
    case "steps": {
      const items = b.items as { de: string; vi: string; body_de?: string; body_vi?: string }[];
      const set = (next: typeof items) => onChange({ ...b, items: next } as Block);
      return (
        <div className="flex flex-col gap-2">
          {b.type === "list" && (
            <label className="flex items-center gap-2 text-[13px]">
              <input type="checkbox" checked={!!b.ordered} onChange={(e) => onChange({ ...b, ordered: e.target.checked })} /> Nummeriert · Đánh số
            </label>
          )}
          {items.map((it, j) => (
            <div key={j} className="flex gap-2">
              <span className="w-5 pt-2 text-xs text-muted">{j + 1}.</span>
              <div className="flex flex-1 flex-col gap-1.5">
                <Pair
                  de={<input className={input} value={it.de} onChange={(e) => set(items.map((x, k) => (k === j ? { ...x, de: e.target.value } : x)))} />}
                  vi={<input className={input} value={it.vi} onChange={(e) => set(items.map((x, k) => (k === j ? { ...x, vi: e.target.value } : x)))} />}
                />
                {b.type === "steps" && (
                  <Pair
                    de={<textarea className={input} rows={2} placeholder="Erklärung" value={it.body_de ?? ""} onChange={(e) => set(items.map((x, k) => (k === j ? { ...x, body_de: e.target.value } : x)))} />}
                    vi={<textarea className={input} rows={2} placeholder="Giải thích" value={it.body_vi ?? ""} onChange={(e) => set(items.map((x, k) => (k === j ? { ...x, body_vi: e.target.value } : x)))} />}
                  />
                )}
              </div>
              <SmallBtn onClick={() => set(items.filter((_, k) => k !== j))} label="Eintrag löschen">✕</SmallBtn>
            </div>
          ))}
          <button type="button" onClick={() => set([...items, { de: "", vi: "" }])} className="self-start text-[13px] font-medium text-accent">
            + Eintrag · Thêm mục
          </button>
        </div>
      );
    }
    case "template":
      return (
        <div className="flex flex-col gap-2">
          <Pair
            de={<input className={input} value={b.label_de} onChange={(e) => onChange({ ...b, label_de: e.target.value })} />}
            vi={<input className={input} value={b.label_vi} onChange={(e) => onChange({ ...b, label_vi: e.target.value })} />}
          />
          <textarea className={input} rows={3} placeholder="Nachrichtentext (meist Vietnamesisch) · Nội dung tin nhắn" value={b.text} onChange={(e) => onChange({ ...b, text: e.target.value })} />
          <textarea className={input} rows={2} placeholder="Deutsche Übersetzung (optional)" value={b.translation_de ?? ""} onChange={(e) => onChange({ ...b, translation_de: e.target.value })} />
        </div>
      );
    case "chat": {
      const set = (messages: typeof b.messages) => onChange({ ...b, messages });
      return (
        <div className="flex flex-col gap-2">
          <Field label="Name der Kundin / des Kunden (erfunden) · Tên khách hàng (giả định)">
            <input className={`${input} max-w-[280px]`} placeholder="z. B. Linh" value={b.customer} onChange={(e) => onChange({ ...b, customer: e.target.value })} />
          </Field>
          <Pair
            de={<textarea className={input} rows={2} placeholder="Aufgabe für die Person, die antwortet" value={b.intro_de ?? ""} onChange={(e) => onChange({ ...b, intro_de: e.target.value })} />}
            vi={<textarea className={input} rows={2} placeholder="Đề bài cho người trả lời" value={b.intro_vi ?? ""} onChange={(e) => onChange({ ...b, intro_vi: e.target.value })} />}
          />
          <span className="text-xs text-muted">
            Nach jeder Kundennachricht muss geantwortet werden. Leerzeile = mehrere Nachrichten hintereinander · Sau mỗi tin nhắn phải trả lời. Dòng trống = gửi nhiều tin liên tiếp.
          </span>
          {b.messages.map((m, j) => (
            <div key={j} className="flex gap-2">
              <span className="w-5 pt-2 text-xs text-muted">{j + 1}.</span>
              <div className="flex flex-1 flex-col gap-1.5">
                <textarea className={input} rows={2} placeholder="Nachricht der Kundin (Vietnamesisch) · Tin nhắn của khách" value={m.text} onChange={(e) => set(b.messages.map((x, k) => (k === j ? { ...x, text: e.target.value } : x)))} />
                <input className={input} placeholder="Deutsche Übersetzung (optional)" value={m.translation_de ?? ""} onChange={(e) => set(b.messages.map((x, k) => (k === j ? { ...x, translation_de: e.target.value } : x)))} />
              </div>
              <SmallBtn onClick={() => set(b.messages.filter((_, k) => k !== j))} label="Nachricht löschen">✕</SmallBtn>
            </div>
          ))}
          <button type="button" onClick={() => set([...b.messages, { text: "", translation_de: "" }])} className="self-start text-[13px] font-medium text-accent">
            + Nachricht · Thêm tin nhắn
          </button>
        </div>
      );
    }
    case "video": {
      const valid = b.url === "" || youtubeId(b.url) !== null;
      return (
        <div className="flex flex-col gap-2">
          <input className={input} placeholder="https://www.youtube.com/watch?v=…" value={b.url} onChange={(e) => onChange({ ...b, url: e.target.value })} />
          {!valid && <span className="text-xs text-bad">Keine gültige YouTube-URL · Link YouTube không hợp lệ</span>}
          <Pair
            de={<input className={input} placeholder="Bildunterschrift" value={b.caption_de ?? ""} onChange={(e) => onChange({ ...b, caption_de: e.target.value })} />}
            vi={<input className={input} placeholder="Chú thích" value={b.caption_vi ?? ""} onChange={(e) => onChange({ ...b, caption_vi: e.target.value })} />}
          />
        </div>
      );
    }
  }
}

function Pair({ de, vi }: { de: React.ReactNode; vi: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-muted">DE</span>
        {de}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-muted">VI</span>
        {vi}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function SmallBtn({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-muted hover:bg-hover hover:text-ink">
      {children}
    </button>
  );
}
