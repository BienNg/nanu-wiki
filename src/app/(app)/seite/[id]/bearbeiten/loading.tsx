import { Bone, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

export default function EditorLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar crumbs={2} />
      <div className="mx-auto flex w-full max-w-[880px] flex-col gap-6 px-8 pb-24 pt-6">
        <div className="grid gap-3 rounded-[10px] border border-line p-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Bone className="h-2.5 w-20" />
              <Bone className="h-9 w-full" />
            </div>
          ))}
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <Bone key={i} className="h-[120px] w-full rounded-[10px]" />
        ))}
      </div>
    </SkeletonPage>
  );
}
