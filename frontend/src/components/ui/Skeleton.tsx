import clsx from "clsx";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={clsx("animate-pulse bg-mist", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full max-w-32" />
        </td>
      ))}
    </tr>
  );
}
