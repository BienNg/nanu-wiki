import { Bone, SkeletonHeading, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

export default function UsersLoading() {
  return (
    <SkeletonPage>
      <SkeletonTopbar />
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-9">
        <SkeletonHeading title="h-9 w-64" lines={1} />
        <div className="overflow-hidden rounded-[10px] border border-line">
          <div className="h-9 bg-side" />
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 border-t border-line-soft px-3 py-2.5">
              <Bone className="h-7 w-7 flex-none rounded-full" />
              <Bone className="h-3.5 w-40" />
              <Bone className="ml-auto h-8 w-28" />
              <Bone className="h-8 w-28" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
