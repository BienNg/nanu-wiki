import { Bone, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

export default function PageLoading() {
  return (
    <SkeletonPage className="flex flex-1 flex-col">
      <SkeletonTopbar crumbs={2} />
      <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5 px-8 pb-20 pt-2">
        <Bone className="h-[150px] w-full rounded-xl" />
        <div className="flex gap-2.5">
          <Bone className="h-5 w-24 rounded-full" />
          <Bone className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex flex-col gap-2.5">
          <Bone className="h-10 w-3/4" />
          <Bone className="h-4 w-1/2" />
        </div>
        <div className="flex flex-col gap-2.5 pt-2">
          {["w-full", "w-11/12", "w-full", "w-2/3", "", "w-1/3", "w-full", "w-5/6"].map((w, i) =>
            w ? <Bone key={i} className={`h-3.5 ${w}`} /> : <span key={i} className="h-3" />,
          )}
        </div>
      </div>
    </SkeletonPage>
  );
}
