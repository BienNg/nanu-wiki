import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar, Crumb } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { KlassenDetail, KlassenList, type ProspectItem, type ProspectTone } from "@/components/admin/KlassenView";
import { type AssignableClass } from "@/lib/messenger/classes";
import { STEP_INFO, stepOf } from "@/lib/messenger/steps";
import { toActionLabel, LABEL_COLUMNS, type InboxLabel } from "@/lib/messenger/thread";
import { assignableClassById, assignableClasses } from "@/lib/notion";

export const metadata = { title: "Messenger-Klassen" };
export const dynamic = "force-dynamic";

const TZ = "Asia/Ho_Chi_Minh";
const dayFmt = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "2-digit" });

type ConversationRow = { id: string; customer_name: string | null; updated_time: string; channel: string | null };

/** Status next to the lead's name: the outcome if the chat is closed, else the funnel step. */
function stateChip(label: InboxLabel | null): { de: string; vi: string; tone: ProspectTone } {
  if (label?.outcome === "verloren") return { de: "Verloren", vi: "Đã mất", tone: "closed" };
  if (label?.outcome === "kein_lead") return { de: "Kein Lead", vi: "Không phải khách", tone: "closed" };
  if (label?.outcome === "weiter_auf_zalo") return { de: "Zalo", vi: "Zalo", tone: "zalo" };
  if (label?.outcome === "bestandskunde") return { de: "Schüler", vi: "Học viên", tone: "student" };
  const step = stepOf(label ? toActionLabel(label) : null);
  return step ? { de: STEP_INFO[step].short_de, vi: STEP_INFO[step].short_vi, tone: "open" } : { de: "Unklar", vi: "Chưa rõ", tone: "closed" };
}

/**
 * Upcoming classes and the Messenger chats assigned to them, for reaching out to every prospect of
 * a class. Classes come live from Notion (the assignable pool, i.e. not started or started at most a
 * week ago, plus assigned classes fetched by id
 * until their End date passes); the assignments live in Supabase. A chat opens as a read-only
 * preview; from there it opens in the inbox.
 */
export default async function MessengerKlassenPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: rows, error }, pool] = await Promise.all([
    supabase.from("messenger_class_assignments").select("conversation_id, class_id"),
    assignableClasses(),
  ]);
  if (error) throw new Error(error.message);

  const byClass = new Map<string, string[]>();
  for (const r of rows ?? []) {
    const list = byClass.get(r.class_id) ?? [];
    list.push(r.conversation_id);
    byClass.set(r.class_id, list);
  }
  const known = new Set(pool.map((c) => c.id));
  const extras = (await Promise.all([...byClass.keys()].filter((k) => !known.has(k)).map(assignableClassById))).filter((c): c is AssignableClass => !!c);
  const classes = [...pool, ...extras].sort((a, b) => {
    if (a.begin !== b.begin) {
      if (!a.begin) return 1;
      if (!b.begin) return -1;
      return a.begin < b.begin ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const selected = classes.find((c) => c.id === sp.k) ?? null;
  const withProspects = classes.filter((c) => (byClass.get(c.id)?.length ?? 0) > 0).length;
  let prospects: ProspectItem[] = [];
  if (selected) {
    const ids = byClass.get(selected.id) ?? [];
    if (ids.length) {
      const [{ data: convs, error: convErr }, { data: labels, error: labelErr }] = await Promise.all([
        supabase.from("messenger_conversations").select("id, customer_name, updated_time, channel").in("id", ids),
        supabase.from("messenger_labels").select(LABEL_COLUMNS).in("conversation_id", ids),
      ]);
      if (convErr || labelErr) throw new Error(convErr?.message ?? labelErr?.message);
      const labelById = new Map((labels ?? []).map((l) => [l.conversation_id, l as InboxLabel]));
      prospects = ((convs ?? []) as ConversationRow[])
        .sort((a, b) => (a.updated_time < b.updated_time ? 1 : -1))
        .map((conv) => {
          const chip = stateChip(labelById.get(conv.id) ?? null);
          return {
            id: conv.id,
            name: conv.customer_name ?? "Unbekannt",
            channel: conv.channel,
            chipDe: chip.de,
            chipVi: chip.vi,
            tone: chip.tone,
            time: dayFmt.format(new Date(conv.updated_time)),
          };
        });
    }
  }

  return (
    <>
      <Topbar
        actions={
          <Link href="/admin/messenger" className="rounded-full px-2.5 py-1 font-medium text-accent hover:bg-accent-soft">
            <Label de="Posteingang" vi="Hộp thư" />
          </Link>
        }
      >
        <Link href="/admin/messenger" className="text-body">
          <Icon name="chat" size={14} />
        </Link>
        <Crumb>
          <Label de="Klassen" vi="Lớp học" />
        </Crumb>
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-8 max-sm:px-4">
        <header>
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Klassen" vi="Lớp học" />
          </h1>
          <p className="m-0 mt-1 text-[13px] text-muted">
            <Label
              de="Kommende Kurse aus Notion und die Chats, die ihnen zugeordnet sind. Eine Klasse öffnen und jeden Interessenten anschreiben."
              vi="Các lớp sắp mở từ Notion và các cuộc trò chuyện đã gán. Mở một lớp để nhắn cho từng khách quan tâm."
            />
          </p>
          <p className="m-0 mt-3 flex flex-wrap gap-2 text-[12.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2F4] px-2.5 py-1 font-medium text-[#3A3F47]">
              <Icon name="cap" size={13} className="text-muted" />
              <Label de={`${classes.length} Klassen`} vi={`${classes.length} lớp`} />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F2F4] px-2.5 py-1 font-medium text-[#3A3F47]">
              <Icon name="users" size={13} className="text-muted" />
              <Label de={`${withProspects} mit Interessenten`} vi={`${withProspects} lớp có khách quan tâm`} />
            </span>
          </p>
        </header>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] items-start gap-6 max-md:grid-cols-1">
          <KlassenList items={classes.map((c) => ({ c, count: byClass.get(c.id)?.length ?? 0 }))} selectedId={selected?.id ?? null} />
          <section className="sticky top-4 max-md:static">
            <KlassenDetail key={selected?.id ?? "none"} c={selected} items={prospects} />
          </section>
        </div>
      </main>
    </>
  );
}
