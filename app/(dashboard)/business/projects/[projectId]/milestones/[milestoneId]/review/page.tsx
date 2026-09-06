import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, MagnifyingGlassPlus } from "@phosphor-icons/react/dist/ssr";
import { MilestoneReviewPanel } from "@/src/components/delivery/milestone-review-panel";

export async function generateMetadata() {
  return { title: `Review Milestone | CocokIn` };
}

export default async function MilestoneReviewPage({ 
  params 
}: { 
  params: Promise<{ projectId: string, milestoneId: string }> 
}) {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const milestone = await prisma.projectMilestone.findUnique({
    where: { id: resolvedParams.milestoneId },
    include: {
      project: { include: { businessProfile: true } },
      criteria: true,
      submissions: {
        orderBy: { version: "desc" },
        take: 1,
        include: { review: true }
      }
    }
  });

  if (!milestone || milestone.project.businessProfile.userId !== session.id || milestone.projectId !== resolvedParams.projectId) {
    return <div className="p-8 text-center text-red-500">Akses ditolak atau milestone tidak ditemukan.</div>;
  }

  const submission = milestone.submissions[0];

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-[#001040] mb-4">Belum Ada Pengumpulan</h1>
        <p className="text-[#53647A] mb-8">Talent belum mengumpulkan hasil kerja untuk milestone ini.</p>
        <Link href={`/business/projects/${milestone.projectId}`} className="bg-[#001040] text-white px-6 py-3 rounded-xl font-bold">Kembali ke Proyek</Link>
      </div>
    );
  }

  const isReviewed = milestone.status === "APPROVED" || milestone.status === "PAID" || milestone.status === "PAYOUT_DUE";

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#D8E1EE] p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link href={`/business/projects/${milestone.projectId}`} className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-1 text-sm">
              <ArrowLeft weight="bold" /> Kembali ke Proyek
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-[#001040]">Review: {milestone.title}</h1>
          </div>
          <div className="bg-[#EAF3FF] text-[#006FE6] font-bold px-4 py-2 rounded-lg border border-[#BAE6FD] flex items-center justify-center gap-2">
            Bobot: {milestone.weightBps / 100}%
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout on Desktop, Stacked on Mobile */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* LEFT COLUMN (or Top on Mobile): Evidence / Staging */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px] lg:h-[700px]">
            <div className="bg-[#001040] p-3 flex justify-between items-center text-white shrink-0">
              <span className="font-bold text-sm flex items-center gap-2">
                <MagnifyingGlassPlus weight="bold" /> Staging Preview
              </span>
              <a 
                href={submission.stagingUrl} 
                target="_blank" 
                rel="noreferrer"
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors"
              >
                Buka di Tab Baru &nearr;
              </a>
            </div>
            {/* Minimalist iframe wrapper. If the URL doesn't allow iframe (e.g., X-Frame-Options), it will show empty/error, but standard for many staging sites */}
            <iframe 
              src={submission.stagingUrl} 
              className="flex-1 w-full bg-gray-50"
              title="Staging Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>

          <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-[#001040] mb-4">Catatan dari Talent (V{submission.version})</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-[#53647A] uppercase tracking-wider block mb-1">Ringkasan Pekerjaan</span>
                <p className="text-[#001040] bg-[#F8FAFC] p-4 rounded-xl border border-[#D8E1EE]">
                  {submission.summary}
                </p>
              </div>
              
              {submission.instructions && (
                <div>
                  <span className="text-xs font-bold text-[#53647A] uppercase tracking-wider block mb-1">Instruksi Tambahan</span>
                  <p className="text-[#001040] bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A] whitespace-pre-line">
                    {submission.instructions}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (or Bottom on Mobile): Criteria & Decision */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto pb-32 lg:pb-0">
          
          {/* Acceptance Criteria */}
          <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm shrink-0">
            <h3 className="font-bold text-lg text-[#001040] mb-4">Kriteria Persetujuan</h3>
            <ul className="space-y-3">
              {milestone.criteria.map((c, i) => (
                <li key={i} className="flex gap-3 items-start p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="bg-white border border-[#CBD5E1] rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-transparent" /> {/* Just visual empty box for UMKM to mentally tick */}
                  </div>
                  <span className="text-sm text-[#001040]">{c.description}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Panel / Decision */}
          <div className="flex-1 min-h-0">
            {isReviewed ? (
              <div className="bg-[#ECFDF5] border border-[#059669] rounded-xl p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
                <Check size={48} className="text-[#059669] mb-4" weight="bold" />
                <h3 className="font-bold text-xl text-[#065F46] mb-2">Milestone Telah Disetujui</h3>
                <p className="text-[#065F46] text-sm">
                  Dana akan diteruskan ke Talent sesuai jadwal pencairan.
                </p>
              </div>
            ) : milestone.status !== "READY_FOR_REVIEW" ? (
              <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm h-full text-center flex flex-col justify-center text-[#53647A]">
                Status saat ini: <strong>{milestone.status}</strong>. Tidak dapat direview.
              </div>
            ) : (
              // Mobile Sticky Container for Action Panel
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#D8E1EE] lg:static lg:p-0 lg:bg-transparent lg:border-none z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none">
                <MilestoneReviewPanel milestoneSubmissionId={submission.id} projectId={milestone.projectId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
