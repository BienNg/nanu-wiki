import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { canUseAssistant } from "@/lib/assistant/access";
import { STAGE_INFO, STAGES } from "@/lib/assistant/schema";
import { Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ReplyAssistant } from "@/components/ReplyAssistant";

export const metadata = { title: "Antwort-Assistent" };
/** The first (uncached) request reads the whole background; give it time on the host. */
export const maxDuration = 60;

const NOTION_DB_URL = "https://app.notion.com/p/d7d719bb4610495f99d2c7f4dae11949";

/** Paste a real customer conversation → funnel stage, profile, suggested reply and why, based on the
 *  Notion examples and the Sales / Student Support / Visa pages. */
export default async function AssistantPage() {
  const session = await requireRole("staff");
  if (!canUseAssistant(session.profile)) redirect("/");

  return (
    <>
      <Topbar>
        <Icon name="spark" size={14} />
        <Label de="Antwort-Assistent" vi="Trợ lý trả lời" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-8 pb-16 pt-7 max-sm:px-3 max-sm:pt-4">
        <header className="flex flex-wrap items-end gap-x-6 gap-y-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="title-display m-0 text-[30px] leading-tight tracking-tight">
              <Label de="Antwort-Assistent" vi="Trợ lý trả lời" />
            </h1>
            <p className="m-0 max-w-[620px] text-[14px] leading-relaxed text-muted">
              <Label
                de="Echte Nachricht einfügen – die KI zeigt die Stufe im Trichter und schlägt die nächste Antwort vor, nur auf Basis unserer Beispiele und des Wikis. Immer prüfen, bevor du sendest."
                vi="Dán tin nhắn thật – AI cho biết khách đang ở bước nào và gợi ý câu trả lời tiếp theo, chỉ dựa trên ví dụ của mình và wiki. Luôn kiểm tra trước khi gửi."
              />
            </p>
          </div>
          <p className="m-0 ml-auto flex items-center gap-3 text-[12px] text-faint">
            <span>
              <Label de="Telefon & E-Mail werden entfernt" vi="SĐT & email được xóa" />
            </span>
            <a href={NOTION_DB_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-dark hover:underline">
              <Label de="Beispiele in Notion ↗" vi="Ví dụ trong Notion ↗" />
            </a>
          </p>
        </header>
        <ReplyAssistant stages={STAGES.map((s) => ({ id: s, ...STAGE_INFO[s] }))} />
      </main>
    </>
  );
}
