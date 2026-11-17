import { Bone, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

/** Same shape as the Statistik page: header, KPI cards, charts on the left, the to-do panel on the right. */
export default function StatistikLoading() {
  const card = "rounded-xl border border-line bg-white";
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="min-h-[calc(100dvh-48px)] border-t border-line bg-[#F6F7F9]">
        <div className="border-b border-line bg-white">
          <div className="mx-auto flex w-full max-w-[1360px] items-end gap-4 px-6 pb-4 pt-5 max-sm:px-4">
            <div className="flex-1">
              <Bone className="h-8 w-40" />
              <Bone className="mt-2 h-3.5 w-full max-w-[520px]" />
            </div>
            <Bone className="h-8 w-28 rounded-full max-md:hidden" />
            <Bone className="h-8 w-24 rounded-full max-md:hidden" />
            <Bone className="h-8 w-56 rounded-full" />
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-[1360px] items-start gap-4 px-6 pt-5 max-sm:px-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={`${card} flex flex-col gap-2.5 px-4 py-3.5`}>
                  <Bone className="h-4 w-32" />
                  <Bone className="h-8 w-20" />
                  <Bone className="h-3 w-40" />
                </div>
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
              <div className={`${card} flex items-end gap-2 px-4 pb-4 pt-14`}>
                {[70, 30, 50, 90, 40, 20, 60].map((h, i) => (
                  <div key={i} className="flex-1" style={{ height: `${h * 1.4}px` }}>
                    <Bone className="h-full w-full rounded-lg" />
                  </div>
                ))}
              </div>
              <div className={`${card} flex flex-col gap-3 p-4`}>
                <Bone className="h-4 w-32" />
                <Bone className="h-8 w-24" />
                <Bone className="h-3 w-full rounded-full" />
                <Bone className="h-24 w-full" />
              </div>
            </div>
            <div className={`${card} flex flex-col gap-2.5 p-4`}>
              <Bone className="h-4 w-48" />
              {Array.from({ length: 6 }, (_, i) => (
                <Bone key={i} className="h-2.5 w-full rounded-full" />
              ))}
            </div>
          </div>
          <div className={`${card} flex flex-col gap-2 p-4`}>
            <Bone className="h-4 w-36" />
            <Bone className="h-14 w-full rounded-[10px]" />
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <Bone className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Bone className="h-3.5 w-32" />
                  <Bone className="mt-1.5 h-3 w-44" />
                </div>
                <Bone className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
