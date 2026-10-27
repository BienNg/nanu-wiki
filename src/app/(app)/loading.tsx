import { Bone, SkeletonHeading, SkeletonPage, SkeletonTable, SkeletonTopbar } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-11 px-8 pb-20 pt-10">
        <section className="flex flex-col gap-4">
          <SkeletonHeading cap />
          <Bone className="h-[50px] w-full rounded-[10px]" />
        </section>
        <Bone className="h-[260px] w-full rounded-[10px]" />
        <section className="flex flex-col gap-3">
          <Bone className="h-7 w-40" />
          <SkeletonTable rows={4} />
        </section>
        <section className="flex flex-col gap-3">
          <Bone className="h-7 w-32" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2.5 rounded-lg bg-side p-2.5">
            {Array.from({ length: 6 }, (_, i) => (
              <Bone key={i} className="h-[104px] rounded-lg" />
            ))}
          </div>
        </section>
      </div>
    </SkeletonPage>
  );
}
