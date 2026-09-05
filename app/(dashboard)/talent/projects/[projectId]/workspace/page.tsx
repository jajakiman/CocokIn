import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, WarningCircle, Check } from "@phosphor-icons/react/dist/ssr";
import { MilestoneSubmissionForm } from "@/src/components/delivery/milestone-submission-form";
import { ResumeTimerButton } from "@/src/components/delivery/resume-timer-button";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  return { title: `Workspace Proyek | CocokIn` };
}

export default async function TalentWorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: {
      businessProfile: true,
      infrastructurePlan: true,
      milestones: {
        include: {
          criteria: true,
          submissions: {
            orderBy: { version: "desc" },
            take: 1,
            include: { review: true }
          }
        },
        orderBy: { deadline: "asc" }
      },
      applications: {
        where: { talentProfile: { userId: session.id }, status: "ACCEPTED" }
      }
    }
  });

  if (!project || project.applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-red-500">
        Anda tidak memiliki akses workspace ke proyek ini.
      </div>
    );
  }

  // Calculate overall progress
  const totalWeight = project.milestones.reduce((acc, m) => acc + m.weightBps, 0);
  const completedWeight = project.milestones.filter(m => ["APPROVED", "PAYOUT_DUE", "PAID"].includes(m.status)).reduce((acc, m) => acc + m.weightBps, 0);
  const progressPercent = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <Link href="/talent" className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-4">
          <ArrowLeft weight="bold" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-[#001040]">Workspace: {project.title}</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[#53647A]">
            Pemberi Kerja: <span className="font-semibold text-[#001040]">{project.businessProfile.businessName}</span>
          </p>
          <Link href={`/projects/${project.id}/chat`} className="bg-[#EAF5F8] text-[#0080FF] font-bold px-4 py-2 rounded-lg text-sm border border-[#0080FF]/20 hover:bg-[#D4EDF4] transition-colors">
            Buka Ruang Chat
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-[#D8E1EE] p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-bold text-[#001040]">Progress Keseluruhan</h3>
          <span className="font-bold text-[#006FE6]">{progressPercent.toFixed(0)}% Selesai</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-[#006FE6] h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
        
        {project.infrastructurePlan && (
          <div className="mt-4 pt-4 border-t border-[#D8E1EE] flex items-center gap-2 text-sm">
            <span className="text-[#53647A]">Infrastruktur yang dipilih UMKM:</span>
            <span className="font-bold text-[#001040] bg-[#F1F5F9] px-2 py-1 rounded">{project.infrastructurePlan.recommendation}</span>
          </div>
        )}
      </div>

      {/* Milestones List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-[#001040]">Daftar Milestone</h2>
        
        {project.milestones.map((milestone, index) => {
          const isPendingSubmission = ["PENDING", "IN_PROGRESS", "REVISION_REQUESTED"].includes(milestone.status);
          const isWaitingReview = milestone.status === "READY_FOR_REVIEW";
          const isApproved = ["APPROVED", "PAYOUT_DUE", "PAID"].includes(milestone.status);
          
          return (
            <div key={milestone.id} className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#F8FAFC] p-6 border-b border-[#D8E1EE] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-sm font-bold text-[#006FE6] mb-1">Milestone {index + 1} • {milestone.weightBps / 100}% Bobot Pembayaran</div>
                  <h3 className="text-xl font-bold text-[#001040]">{milestone.title}</h3>
                </div>
                
                {/* Status Badge */}
                <div>
                  {isApproved ? (
                    <div className="flex items-center gap-2 bg-[#ECFDF5] text-[#059669] px-4 py-2 rounded-full font-bold text-sm border border-[#059669]">
                      <CheckCircle weight="fill" size={20} /> Disetujui
                    </div>
                  ) : isWaitingReview ? (
                    <div className="flex items-center gap-2 bg-[#FFFBEB] text-[#B45309] px-4 py-2 rounded-full font-bold text-sm border border-[#FDE68A]">
                      <Clock weight="fill" size={20} /> Menunggu Review UMKM
                    </div>
                  ) : milestone.status === "REVISION_REQUESTED" ? (
                    <div className="flex items-center gap-2 bg-[#FFF1F2] text-[#E11D48] px-4 py-2 rounded-full font-bold text-sm border border-[#FECDD3]">
                      <WarningCircle weight="fill" size={20} /> Perlu Revisi
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-[#F1F5F9] text-[#64748B] px-4 py-2 rounded-full font-bold text-sm border border-[#CBD5E1]">
                      Dalam Pengerjaan
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-[#001040] mb-3">Acceptance Criteria</h4>
                  <ul className="space-y-2">
                    {milestone.criteria.map((c, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[#53647A]">
                        <Check size={16} className="text-[#059669] mt-0.5 shrink-0" />
                        {c.description}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 border-t border-dashed">
                    <p className="text-sm font-medium text-[#53647A]">
                      Batas Waktu Pengumpulan: <strong className="text-[#001040]">{milestone.deadline.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    </p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#D8E1EE]">
                  {isPendingSubmission ? (
                    <div>
                      <h4 className="font-bold text-[#001040] mb-4">Pengumpulan Hasil Kerja</h4>
                      {milestone.status === "REVISION_REQUESTED" && milestone.submissions[0]?.review && (
                        <div className="bg-[#FFF1F2] border border-[#FECDD3] p-4 rounded-lg mb-4 text-sm">
                          <strong className="text-[#E11D48] block mb-1">Catatan Revisi dari UMKM:</strong>
                          <p className="text-[#9F1239]">{milestone.submissions[0].review.feedback}</p>
                        </div>
                      )}
                      <MilestoneSubmissionForm projectMilestoneId={milestone.id} />
                    </div>
                  ) : (
                    <div>
                       <h4 className="font-bold text-[#001040] mb-4">Hasil Terkirim</h4>
                       {milestone.submissions.length > 0 && (
                         <div className="space-y-4 text-sm">
                           <div>
                             <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">Staging URL</span>
                             <a href={milestone.submissions[0].stagingUrl} target="_blank" rel="noreferrer" className="text-[#006FE6] font-medium break-all hover:underline">
                               {milestone.submissions[0].stagingUrl}
                             </a>
                           </div>
                           <div>
                             <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">Ringkasan</span>
                             <p className="text-[#001040] bg-white p-3 rounded-lg border">{milestone.submissions[0].summary}</p>
                           </div>
                           <div>
                            <span className="text-[#53647A] block text-xs uppercase tracking-wider mb-1">Versi</span>
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">V{milestone.submissions[0].version}</span>
                           </div>
                         </div>
                       )}
                       
                       {milestone.submissions[0]?.timerPausedAt && (
                         <ResumeTimerButton milestoneSubmissionId={milestone.submissions[0].id} />
                       )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
