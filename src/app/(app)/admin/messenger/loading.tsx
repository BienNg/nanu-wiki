import { Bone, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";
import { ListSkeleton, ThreadSkeleton } from "@/components/admin/MessengerSkeleton";

export default function MessengerLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="flex h-[calc(100dvh-48px)] w-full flex-col border-t border-line max-md:h-[calc(100dvh-96px)]">
        <div className="flex flex-none flex-col gap-3 border-b border-line px-4 pb-3 pt-3">
          <div className="flex items-center gap-3">
            <Bone className="h-6 w-36" />
            <Bone className="ml-auto h-8 w-60 rounded-full max-md:hidden" />
            <Bone className="h-8 w-24 rounded-full" />
            <Bone className="h-8 w-20 rounded-full" />
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => (
              <Bone key={i} className="h-[46px] min-w-[92px] flex-1 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-1">
          <div className="w-[340px] flex-none overflow-hidden border-r border-line max-md:w-full">
            <ListSkeleton />
          </div>
          <div className="flex min-w-0 flex-1 flex-col max-md:hidden">
            <ThreadSkeleton />
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
