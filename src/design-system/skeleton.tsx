import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[#E2E8F0] motion-reduce:animate-none ${className}`}
      {...props}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="w-24 h-3.5" />
              <Skeleton className="w-32 h-4 rounded-md" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-lg" />
        </div>

        <Skeleton className="w-3/4 h-5" />
        <Skeleton className="w-1/2 h-6" />

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8E1EE]">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex gap-2">
          <Skeleton className="w-16 h-6 rounded-md" />
          <Skeleton className="w-20 h-6 rounded-md" />
          <Skeleton className="w-14 h-6 rounded-md" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-28 h-9 rounded-xl" />
          <Skeleton className="flex-1 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
