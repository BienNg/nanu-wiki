import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { MessengerCrumb } from "@/components/admin/MessengerTabs";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { KlassenDetail, KlassenList, type ProspectItem, type ProspectTone } from "@/components/admin/KlassenView";
import { isOfferState, type AssignableClass, type OfferState } from "@/lib/messenger/classes";
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
 * a class. Right before a class starts everyone assigned gets a special offer; each chat is marked
 * Offen / Geschickt / Übersprungen for that class, so the class works as a to-do list. Classes come live from Notion (the assignable pool, i.e. not started or started at most a
 * week ago, plus assigned classes fetched by id
 * until their End date passes); the assignments live in Supabase. A chat opens as a read-only
 * preview; from there it opens in the inbox.
 */
export default async function MessengerKlassenPage({ searchParams }: { searchParams: Promise<{ k?: string }> }) {
  await requireRole("admin");
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: rows, error }, pool] = await Promise.all([
    supabase.from("messenger_class_assignments").select("conversation_id, class_id, offer_status, offer_set_at"),
    assignableClasses(),
  ]);
  if (error) throw new Error(error.message);

  type Assignment = { id: string; offer: OfferState; offerAt: string | null };
  const byClass = new Map<string, Assignment[]>();
  for (const r of rows ?? []) {
    const list = byClass.get(r.class_id) ?? [];
    list.push({ id: r.conversation_id, offer: isOfferState(r.offer_status) ? r.offer_status : "offen", offerAt: r.offer_set_at });
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
    const assignments = new Map((byClass.get(selected.id) ?? []).map((a) => [a.id, a]));
    const ids = [...assignments.keys()];
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
          const a = assignments.get(conv.id);
          return {
            id: conv.id,
            name: conv.customer_name ?? "Unbekannt",
            channel: conv.channel,
            chipDe: chip.de,
            chipVi: chip.vi,
            tone: chip.tone,
            time: dayFmt.format(new Date(conv.updated_time)),
            offer: a?.offer ?? "offen",
            offerAt: a?.offerAt ? dayFmt.format(new Date(a.offerAt)) : null,
          };
        });
    }
  }

  return (
    <>
      <Topbar>
        <MessengerCrumb current="klassen" />
      </Topbar>
      <main className="flex w-full flex-col gap-6 px-8 pb-20 pt-8 max-sm:px-4">
        <header>
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Label de="Klassen" vi="Lớp học" />
          </h1>
          <p className="m-0 mt-1 text-[13px] text-muted">
            <Label
              de="Kommende Kurse aus Notion und die Chats, die ihnen zugeordnet sind. Vor dem Start bekommt jeder Interessent ein Sonderangebot: Klasse öffnen, anschreiben und als geschickt markieren."
              vi="Các lớp sắp mở từ Notion và các cuộc trò chuyện đã gán. Trước khi khai giảng, mỗi khách quan tâm nhận một ưu đãi: mở lớp, nhắn tin và đánh dấu đã gửi."
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
        <div className="grid grid-cols-[400px_minmax(0,1fr)] items-start gap-6 max-lg:grid-cols-[340px_minmax(0,1fr)] max-md:grid-cols-1">
          <KlassenList
            items={classes.map((c) => {
              const list = byClass.get(c.id) ?? [];
              return { c, count: list.length, open: list.filter((a) => a.offer === "offen").length };
            })}
            selectedId={selected?.id ?? null}
          />
          <section className="sticky top-4 max-md:static">
            <KlassenDetail key={selected?.id ?? "none"} c={selected} items={prospects} />
          </section>
        </div>
      </main>
    </>
  );
}
