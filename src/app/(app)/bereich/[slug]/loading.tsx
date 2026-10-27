import { Bone, SkeletonHeading, SkeletonPage, SkeletonTable, SkeletonTopbar } from "@/components/Skeleton";

export default function AreaLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-8 pb-20 pt-9">
        <SkeletonHeading title="h-10 w-1/2" />
        <Bone className="h-9 w-[320px] rounded-lg" />
        <SkeletonTable rows={6} />
      </div>
    </SkeletonPage>
  );
}
