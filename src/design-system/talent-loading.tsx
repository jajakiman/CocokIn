import { Skeleton } from "./skeleton";

function LoadingFrame({ children, maxWidth = "max-w-6xl" }: { children: React.ReactNode; maxWidth?: string }) {
  return <div aria-label="Memuat konten" className={`mx-auto w-full ${maxWidth} space-y-8 p-4 md:p-8`} role="status">{children}</div>;
}

function HeaderSkeleton({ action = false }: { action?: boolean }) {
  return <div className="flex items-start justify-between gap-4"><div className="w-full max-w-xl space-y-3"><Skeleton className="h-3 w-24" /><Skeleton className="h-9 w-64 max-w-full" /><Skeleton className="h-4 w-full" /></div>{action ? <Skeleton className="hidden h-11 w-40 sm:block" /> : null}</div>;
}

export function MarketplaceLoadingSkeleton() {
  return <LoadingFrame><HeaderSkeleton /><div className="grid grid-cols-1 gap-6 lg:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div className="overflow-hidden rounded-xl border border-[#D8E1EE] bg-white" data-testid="skeleton-project-card" key={index}><div className="space-y-4 p-6"><div className="flex justify-between gap-4"><div className="space-y-2"><Skeleton className="h-6 w-48 max-w-full" /><Skeleton className="h-4 w-28" /></div><Skeleton className="h-9 w-24" /></div><Skeleton className="h-12 w-full" /><div className="flex gap-2"><Skeleton className="h-6 w-16" /><Skeleton className="h-6 w-20" /></div><div className="flex gap-4"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-24" /></div></div><div className="flex items-center justify-between bg-[#F8FAFC] p-6" data-testid="skeleton-project-price"><Skeleton className="h-6 w-32" /><Skeleton className="h-10 w-28" /></div></div>)}</div></LoadingFrame>;
}

export function ProjectDetailLoadingSkeleton() {
  return <LoadingFrame maxWidth="max-w-5xl"><Skeleton className="h-5 w-36" /><div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]"><div className="space-y-5 rounded-xl border border-[#D8E1EE] bg-white p-6" data-testid="skeleton-project-detail"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-40" /><Skeleton className="h-32 w-full" /><Skeleton className="h-20 w-full" /></div><div className="space-y-4 rounded-xl border border-[#D8E1EE] bg-white p-6"><Skeleton className="h-24 w-full" /><Skeleton className="h-11 w-full" /></div></div></LoadingFrame>;
}

export function WorkspaceLoadingSkeleton() {
  return <LoadingFrame><Skeleton className="h-5 w-40" /><HeaderSkeleton /><div className="rounded-xl border border-[#D8E1EE] bg-white p-6"><Skeleton className="h-3 w-full" /></div><div className="space-y-4">{Array.from({ length: 3 }, (_, index) => <div className="grid grid-cols-1 gap-6 rounded-xl border border-[#D8E1EE] bg-white p-6 md:grid-cols-2" data-testid="skeleton-milestone" key={index}><div className="space-y-3"><Skeleton className="h-6 w-52" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div><Skeleton className="h-36 w-full" /></div>)}</div></LoadingFrame>;
}

export function PassportLoadingSkeleton() {
  return <LoadingFrame><HeaderSkeleton action /><div className="grid grid-cols-1 gap-8 lg:grid-cols-3"><div className="space-y-3 lg:col-span-2">{Array.from({ length: 4 }, (_, index) => <div className="flex items-center justify-between rounded-xl border border-[#D8E1EE] bg-white p-5" data-testid="skeleton-skill-row" key={index}><div className="space-y-2"><Skeleton className="h-5 w-36" /><Skeleton className="h-4 w-24" /></div><Skeleton className="h-7 w-24 rounded-full" /></div>)}</div><div className="space-y-4 rounded-xl border border-[#D8E1EE] bg-white p-6"><Skeleton className="h-6 w-36" />{Array.from({ length: 4 }, (_, index) => <Skeleton className="h-10 w-full" key={index} />)}</div></div></LoadingFrame>;
}

export function PortfolioLoadingSkeleton() {
  return <LoadingFrame><HeaderSkeleton /><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="skeleton-portfolio-grid">{Array.from({ length: 3 }, (_, index) => <div className="overflow-hidden rounded-xl border border-[#D8E1EE] bg-white" data-testid="skeleton-portfolio-card" key={index}><div className="space-y-4 bg-[#F8FAFC] p-6"><Skeleton className="h-7 w-36" /><Skeleton className="h-6 w-4/5" /></div><div className="space-y-3 p-6"><Skeleton className="h-16 w-full" /><Skeleton className="h-4 w-2/3" /></div></div>)}</div></LoadingFrame>;
}

export function AssessmentLoadingSkeleton() {
  return <LoadingFrame><HeaderSkeleton action /><div className="rounded-xl border border-[#D8E1EE] bg-white p-6"><div className="mb-6 flex gap-3"><Skeleton className="h-10 w-10" /><div className="space-y-2"><Skeleton className="h-6 w-52" /><Skeleton className="h-4 w-36" /></div></div><div className="grid grid-cols-1 gap-6 md:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <div className="space-y-3 rounded-xl bg-[#F8FAFC] p-6 text-center" data-testid="skeleton-score-tile" key={index}><Skeleton className="mx-auto h-4 w-28" /><Skeleton className="mx-auto h-12 w-20" /></div>)}</div></div></LoadingFrame>;
}

export function ProfileLoadingSkeleton() {
  return <LoadingFrame maxWidth="max-w-4xl"><HeaderSkeleton />{[5, 2, 3].map((rows, index) => <div className="space-y-5 rounded-xl border border-[#D8E1EE] bg-white p-6" data-testid="skeleton-profile-section" key={index}><Skeleton className="h-7 w-52" />{Array.from({ length: rows }, (_, row) => <Skeleton className="h-11 w-full" key={row} />)}</div>)}<div className="flex justify-end"><Skeleton className="h-12 w-48" /></div></LoadingFrame>;
}

export function WorkspaceOverviewLoadingSkeleton() {
  return <LoadingFrame><HeaderSkeleton /><div className="space-y-10">{Array.from({ length: 2 }, (_, section) => <section className="space-y-5" key={section}><Skeleton className="h-7 w-56" /><div className="grid grid-cols-1 gap-6 md:grid-cols-2">{Array.from({ length: 2 }, (_, index) => <div className="space-y-4 rounded-xl border border-[#D8E1EE] bg-white p-6" data-testid="skeleton-workspace-card" key={index}><div className="flex justify-between gap-4"><div className="space-y-2"><Skeleton className="h-6 w-44" /><Skeleton className="h-4 w-28" /></div><Skeleton className="h-7 w-24" /></div><Skeleton className="h-20 w-full" /><Skeleton className="h-11 w-full" /></div>)}</div></section>)}</div></LoadingFrame>;
}

export function SkillManagerLoading() {
  return <div aria-hidden="true" className="min-h-44 space-y-3"><div className="flex justify-end"><Skeleton className="h-11 w-44" /></div><Skeleton className="h-24 w-full" /></div>;
}
