import { Bone, SkeletonHeading, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

export default function UsersLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-9 max-sm:px-4">
        <SkeletonHeading title="h-9 w-64" lines={1} />
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-xl border border-line bg-[#F6F7F9] px-3 py-2.5">
              <Bone className="h-5 w-20" />
              <Bone className="h-3 w-4/5" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Bone className="h-4 w-48" />
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-xl border border-line bg-white p-4">
              <div className="flex items-start gap-3">
                <Bone className="h-10 w-10 flex-none rounded-full" />
                <div className="flex flex-1 flex-col gap-1.5">
                  <Bone className="h-4 w-44" />
                  <Bone className="h-3 w-56" />
                </div>
                <Bone className="h-9 w-28 rounded-lg" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[280px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
                {Array.from({ length: 4 }, (_, j) => (
                  <Bone key={j} className="h-9 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
