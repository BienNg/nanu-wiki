import { Bone } from "@/components/Skeleton";

/** Placeholder rows with the shape of the inbox list. */
export function ListSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col p-1.5">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-2.5 px-2.5 py-2">
          <Bone className="h-10 w-10 flex-none rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Bone className={`h-3.5 ${["w-28", "w-36", "w-24", "w-32"][i % 4]}`} />
              <Bone className="ml-auto h-2.5 w-8" />
            </div>
            <Bone className={`h-3 ${["w-4/5", "w-3/5", "w-2/3"][i % 3]}`} />
            <Bone className="h-[18px] w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder with the shape of an open chat: header, label fields, bubbles, composer. */
export function ThreadSkeleton() {
  const bubbles = ["w-56 self-start", "w-72 self-end", "w-40 self-end", "w-64 self-start", "w-80 self-end", "w-48 self-start"];
  return (
    <div role="status" aria-busy="true" className="flex min-h-0 flex-1 flex-col">
      <span className="sr-only">Wird geladen · Đang tải …</span>
      <div aria-hidden="true" className="contents">
        <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
          <Bone className="h-9 w-9 flex-none rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Bone className="h-3.5 w-32" />
            <Bone className="h-2.5 w-44" />
          </div>
          <Bone className="ml-auto h-5 w-28 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-1.5 border-b border-line bg-[#FAFBFC] px-3 py-2">
          {["w-32", "w-24", "w-28", "w-36", "w-40"].map((w, i) => (
            <Bone key={i} className={`h-7 rounded-lg ${w}`} />
          ))}
        </div>
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden px-4 py-4">
          {bubbles.map((c, i) => (
            <Bone key={i} className={`max-w-[78%] rounded-[18px] ${i % 3 === 1 ? "h-16" : "h-9"} ${c}`} />
          ))}
        </div>
        <div className="border-t border-line p-3">
          <Bone className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
