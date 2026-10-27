/** Placeholder shapes shown by the route `loading.tsx` files while a page's data loads. */

export function Bone({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`skeleton block rounded-md ${className}`} />;
}

/** Announces the loading state once; everything inside is hidden from screen readers. */
export function SkeletonPage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">Wird geladen · Đang tải …</span>
      <div aria-hidden="true" className="contents">
        {children}
      </div>
    </div>
  );
}

/** Same height as <Topbar>, so the content does not jump when the page arrives. */
export function SkeletonTopbar({ crumbs = 1 }: { crumbs?: number }) {
  return (
    <div className="flex min-h-12 items-center gap-2 px-4">
      <Bone className="h-3.5 w-3.5 rounded" />
      {Array.from({ length: crumbs }, (_, i) => (
        <Bone key={i} className={`h-3 ${i === 0 ? "w-24" : "w-36"}`} />
      ))}
      <Bone className="ml-auto h-7 w-[104px]" />
    </div>
  );
}

/** Matches the rows of <PageTable>. */
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col">
      <div className="flex min-h-8 items-center gap-6 px-2.5">
        <Bone className="h-2.5 w-16" />
        <Bone className="ml-auto h-2.5 w-12" />
        <Bone className="h-2.5 w-12" />
        <Bone className="h-2.5 w-14" />
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex min-h-11 items-center gap-6 px-2.5 py-1.5">
          <Bone className="h-[15px] w-[15px] flex-none rounded" />
          <Bone className={`h-3.5 ${["w-2/5", "w-1/3", "w-1/2", "w-1/4"][i % 4]}`} />
          <Bone className="ml-auto h-5 w-16 rounded-full" />
          <Bone className="h-3 w-20" />
          <Bone className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

/** A heading block: optional caption, big title, one or two lines of intro text. */
export function SkeletonHeading({ cap = false, lines = 2, title = "h-10 w-3/5" }: { cap?: boolean; lines?: number; title?: string }) {
  return (
    <div className="flex flex-col gap-3">
      {cap && <Bone className="h-2.5 w-40" />}
      <Bone className={title} />
      {Array.from({ length: lines }, (_, i) => (
        <Bone key={i} className={`h-3.5 ${i === lines - 1 ? "w-2/5" : "w-4/5 max-w-[640px]"}`} />
      ))}
    </div>
  );
}
