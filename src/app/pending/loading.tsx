import { Bone, SkeletonPage } from "@/components/Skeleton";

export default function PendingLoading() {
  return (
    <SkeletonPage className="flex min-h-screen items-center justify-center bg-peach px-4">
      <div className="flex w-full max-w-[460px] flex-col gap-3 rounded-[14px] border-[1.5px] border-ink bg-white p-8">
        <Bone className="h-10 w-10 rounded-full" />
        <Bone className="mt-2 h-7 w-3/4" />
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-2/3" />
      </div>
    </SkeletonPage>
  );
}
