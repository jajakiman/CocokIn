import { Skeleton } from "@/src/design-system/skeleton";

export default function BusinessDashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Top Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-[#D8E1EE]">
        <div className="space-y-2">
          <Skeleton className="w-56 h-9" />
          <Skeleton className="w-80 h-4" />
        </div>
        <Skeleton className="w-40 h-11 rounded-xl" />
      </div>

      {/* 3 Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white border border-[#D8E1EE] rounded-2xl p-6 space-y-3">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-20 h-9" />
            <Skeleton className="w-44 h-3.5" />
          </div>
        ))}
      </div>

      {/* Projects Table / Cards Skeleton */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-[#D8E1EE]">
          <Skeleton className="w-44 h-6" />
          <Skeleton className="w-24 h-4" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border border-[#E2E8F0] rounded-xl flex justify-between items-center gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="w-1/3 h-5" />
                <Skeleton className="w-1/2 h-4" />
              </div>
              <Skeleton className="w-24 h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
