import { Skeleton, ProjectCardSkeleton } from "@/src/design-system/skeleton";

export default function TalentDashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      {/* Top Greeting Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#D8E1EE]">
        <div className="space-y-2">
          <Skeleton className="w-48 h-9" />
          <Skeleton className="w-80 h-4" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-40 h-11 rounded-xl" />
          <Skeleton className="w-28 h-11 rounded-xl" />
        </div>
      </div>

      {/* Hero Welcome Bento Card Skeleton */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="lg:col-span-1 space-y-4 pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-[#D8E1EE] pb-6 lg:pb-0">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-36 h-7" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-28 h-4 mt-4" />
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="w-full h-8" />
                </div>
                <Skeleton className="w-full h-9 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Projects Grid Skeleton */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <Skeleton className="w-64 h-7" />
            <Skeleton className="w-72 h-3.5" />
          </div>
          <Skeleton className="w-32 h-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
