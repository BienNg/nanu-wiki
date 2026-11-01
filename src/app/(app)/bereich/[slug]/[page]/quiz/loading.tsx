import { Bone, SkeletonPage } from "@/components/Skeleton";

export default function QuizLoading() {
  return (
    <SkeletonPage className="flex min-h-full flex-1 flex-col bg-peach">
      <div className="flex items-center gap-3 px-6 py-3.5">
        <Bone className="h-3 w-40" />
        <Bone className="ml-auto h-3 w-20" />
      </div>
      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-wrap items-start gap-12 px-8 pb-16 pt-8">
        <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-4 pt-10">
          <Bone className="h-2.5 w-24" />
          <Bone className="h-9 w-4/5" />
          <Bone className="h-9 w-3/5" />
          <Bone className="h-1 w-[320px] max-w-full rounded-full" />
        </div>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-2 rounded-[14px] border-[1.5px] border-ink bg-white p-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Bone key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
