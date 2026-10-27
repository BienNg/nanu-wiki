import { Bone, SkeletonPage, SkeletonTopbar } from "@/components/Skeleton";

export default function SearchLoading() {
  return (
    <SkeletonPage className="flex flex-1 flex-col bg-[#ECEEF1]">
      <SkeletonTopbar />
      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-2.5 px-6 pb-20 pt-3">
        <div className="flex min-h-[52px] items-center rounded-[10px] bg-white px-4 shadow-[0_8px_28px_rgba(16,24,40,.12)]">
          <Bone className="h-4 w-2/3" />
        </div>
        <div className="flex flex-col gap-3 rounded-[10px] bg-white p-4">
          <Bone className="h-2.5 w-24" />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex flex-col gap-1.5 py-1.5">
              <Bone className={`h-4 ${["w-1/2", "w-2/5", "w-3/5"][i % 3]}`} />
              <Bone className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
