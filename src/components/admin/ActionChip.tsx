import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import type { NextAction } from "@/lib/messenger/nextAction";

/** The wait chip shows a clock instead of "Warten · dann"; this is what follows it ("Interesse fragen"), or null. */
function waitRest(de: string, vi: string): { de: string; vi: string } | null {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const restDe = de.replace(/^Warten(\s*·\s*(dann\s+)?)?/, "");
  const restVi = vi.replace(/^Chờ(\s*·\s*(sau đó\s+)?)?/, "");
  return restDe ? { de: cap(restDe), vi: cap(restVi) } : null;
}

/** The next step for a chat: blue when we act today, grey with a clock while we wait. */
export function ActionChip({ action, title }: { action: NextAction; title?: string }) {
  const rest = action.id === "wait" ? waitRest(action.de, action.vi) : null;
  return (
    <span
      title={title}
      className={`flex min-w-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-colors duration-150 group-aria-[current=page]:bg-white ${
        action.today ? "bg-accent-soft text-accent-dark" : "bg-chip text-muted"
      }`}
    >
      {action.id === "wait" ? (
        <>
          <span className="flex-none" title="Warten">
            <Icon name="clock" size={12} />
          </span>
          {rest && (
            <span className="truncate">
              <Label {...rest} />
            </span>
          )}
        </>
      ) : (
        <span className="truncate">
          <Label de={action.de} vi={action.vi} />
        </span>
      )}
    </span>
  );
}
