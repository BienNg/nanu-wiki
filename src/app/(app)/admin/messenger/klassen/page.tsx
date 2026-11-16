import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar, Crumb } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ClassInfoButton, KlassenList, ProspectList, type ProspectItem } from "@/components/admin/KlassenView";
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
function stateChip(label: InboxLabel | null) {
  if (label?.outcome === "verloren") return { de: "Verloren", vi: "Đã mất" };
  if (label?.outcome === "kein_lead") return { de: "Kein Lead", vi: "Không phải khách" };
  if (label?.outcome === "weiter_auf_zalo") return { de: "Zalo", vi: "Zalo" };
  if (label?.outcome === "bestandskunde") return { de: "Schüler", vi: "Học viên" };
  const step = stepOf(label ? toActionLabel(label) : null);
  return step ? { de: STEP_INFO[step].short_de, vi: STEP_INFO[step].short_vi } : { de: "Unklar", vi: "Chưa rõ" };
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
        </header>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 max-md:grid-cols-1">
          <KlassenList items={classes.map((c) => ({ c, count: byClass.get(c.id)?.length ?? 0 }))} selectedId={selected?.id ?? null} />
          <section>
            {!selected ? (
              <p className="m-0 rounded-xl border border-dashed border-line px-4 py-8 text-center text-[13px] text-muted">
                <Label de="Links eine Klasse wählen." vi="Chọn một lớp bên trái." />
              </p>
            ) : (
              <div className="rounded-xl border border-line bg-white">
                <header className="flex items-start gap-3 border-b border-line px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="m-0 text-[15px] font-semibold">{selected.name}</h2>
                    <p className="m-0 mt-0.5 text-[12px] text-muted">
                      {prospects.length === 1 ? (
                        <Label de="1 Interessent" vi="1 khách quan tâm" />
                      ) : (
                        <Label de={`${prospects.length} Interessenten`} vi={`${prospects.length} khách quan tâm`} />
                      )}
                    </p>
                  </div>
                  <ClassInfoButton c={selected} />
                </header>
                {prospects.length === 0 ? (
                  <p className="m-0 px-4 py-6 text-[13px] text-muted">
                    <Label de="Diesem Kurs ist noch kein Chat zugeordnet." vi="Chưa có cuộc trò chuyện nào được gán cho lớp này." />
                  </p>
                ) : (
                  <ProspectList items={prospects} />
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
