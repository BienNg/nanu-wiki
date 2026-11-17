import Link from "next/link";
import { Label } from "@/components/Bi";
import { Icon, type AnyIcon } from "@/components/Icon";

const TABS: { id: "inbox" | "klassen" | "statistik"; href: string; icon: AnyIcon; de: string; vi: string }[] = [
  { id: "inbox", href: "/admin/messenger", icon: "chat", de: "Posteingang", vi: "Hộp thư" },
  { id: "klassen", href: "/admin/messenger/klassen", icon: "cap", de: "Klassen", vi: "Lớp học" },
  { id: "statistik", href: "/admin/messenger/statistik", icon: "chart", de: "Statistik", vi: "Thống kê" },
];

/** The three Messenger pages as one segmented control in the top bar; the current one is white and raised. */
export function MessengerTabs({ current }: { current: (typeof TABS)[number]["id"] }) {
  return (
    <div className="flex items-center gap-0.5 rounded-[9px] bg-chip p-0.5">
      {TABS.map((t) => {
        const on = t.id === current;
        return (
          <Link
            key={t.id}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={`flex h-7 items-center gap-1.5 rounded-[7px] px-2.5 text-[12.5px] font-medium transition-colors duration-150 ${
              on ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]" : "text-muted hover:bg-white/60 hover:text-ink"
            }`}
          >
            <Icon name={t.icon} size={13} className={on ? "text-accent" : undefined} />
            <Label de={t.de} vi={t.vi} />
          </Link>
        );
      })}
    </div>
  );
}

/** "Messenger" plus the page tabs: the left side of the top bar on every Messenger page. */
export function MessengerCrumb({ current }: { current: (typeof TABS)[number]["id"] }) {
  return (
    <>
      <span className="mr-1.5 flex items-center gap-1.5 font-medium text-ink max-sm:hidden">
        <Icon name="chat" size={14} className="text-muted" />
        Messenger
      </span>
      <MessengerTabs current={current} />
    </>
  );
}
