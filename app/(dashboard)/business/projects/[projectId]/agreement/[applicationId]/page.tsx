import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, WarningCircle, Handshake } from "@phosphor-icons/react/dist/ssr";
import { AcceptTalentForm } from "@/src/components/projects/accept-talent-form";

export async function generateMetadata() {
  return { title: `Review Perjanjian Kerja | CocokIn` };
}

export default async function ProjectAgreementPage({ 
  params 
}: { 
  params: Promise<{ projectId: string, applicationId: string }> 
}) {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: {
      businessProfile: true,
      infrastructurePlan: true,
      milestones: { orderBy: { deadline: "asc" } },
      applications: {
        where: { id: resolvedParams.applicationId },
        include: {
          talentProfile: { include: { user: true } },
          matchSnapshot: true
        }
      }
    }
  });

  if (!project || project.businessProfile.userId !== session.id) {
    return <div className="p-8 text-center">Proyek tidak ditemukan atau akses ditolak.</div>;
  }

  const application = project.applications[0];

  if (!application) {
    return <div className="p-8 text-center">Lamaran Talent tidak ditemukan.</div>;
  }

  if (project.status !== "PUBLISHED") {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-[#001040] mb-4">Proyek Sudah Berjalan</h1>
        <p className="text-[#53647A] mb-8">Anda tidak dapat lagi mengubah Talent untuk proyek ini karena perjanjian telah disepakati sebelumnya.</p>
        <Link href={`/business`} className="bg-[#001040] text-white px-6 py-3 rounded-xl font-bold">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <Link href={`/business/projects/${project.id}/applicants`} className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-4">
          <ArrowLeft weight="bold" /> Kembali ke Daftar Pelamar
        </Link>
        <h1 className="text-3xl font-bold text-[#001040] flex items-center gap-3">
          <Handshake weight="fill" className="text-[#006FE6]" /> Perjanjian Kerja
        </h1>
        <p className="text-[#53647A] mt-2">
          Harap tinjau kembali ruang lingkup pekerjaan, milestone, dan identitas Talent sebelum Anda mengonfirmasi penugasan.
        </p>
      </div>

      <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#F8FAFC] border-b border-[#D8E1EE] p-6">
          <h2 className="text-xl font-bold text-[#001040]">{project.title}</h2>
          <div className="text-sm text-[#53647A] mt-1 flex flex-wrap gap-x-6 gap-y-2">
            <span>Estimasi Waktu: <strong className="text-[#001040]">{project.estimatedDays} Hari</strong></span>
            <span>Tingkat Kesulitan: <strong className="text-[#001040]">{project.difficulty}</strong></span>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* SCOPE */}
          <div>
            <h3 className="text-sm font-bold text-[#53647A] uppercase tracking-wider mb-2">Scope Pekerjaan</h3>
            <p className="text-[#001040] bg-[#F1F5F9] p-4 rounded-xl">{project.scope}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INFRASTRUCTURE */}
            {project.infrastructurePlan && (
              <div>
                <h3 className="text-sm font-bold text-[#53647A] uppercase tracking-wider mb-2">Infrastruktur</h3>
                <div className="bg-[#F1F5F9] p-4 rounded-xl">
                  <span className="font-bold text-[#001040] block">{project.infrastructurePlan.recommendation}</span>
                  <span className="text-xs text-[#53647A]">{project.infrastructurePlan.rationale}</span>
                </div>
              </div>
            )}
            
            {/* VALUE */}
            <div>
              <h3 className="text-sm font-bold text-[#53647A] uppercase tracking-wider mb-2">Nilai Imbalan</h3>
              <div className="bg-[#FFFBEB] p-4 rounded-xl border border-[#FDE68A]">
                <span className="font-bold text-[#FF8010] text-xl">Rp {(Number(project.serviceValue)).toLocaleString("id-ID")}</span>
                <span className="text-xs text-[#92400E] block mt-1">Belum termasuk biaya platform/layanan (ditagih setelahnya)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* MILESTONES */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#001040]">Detail Milestone</h3>
          <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden divide-y divide-[#D8E1EE]">
            {project.milestones.map((m, idx) => (
              <div key={m.id} className="p-4 flex gap-4">
                <div className="bg-[#EAF3FF] text-[#006FE6] font-bold h-10 w-10 flex items-center justify-center rounded-lg shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-[#001040]">{m.title}</h4>
                  <div className="text-sm text-[#53647A] mt-1 flex gap-4">
                    <span>Bobot: <strong className="text-[#001040]">{m.weightBps / 100}%</strong></span>
                    <span>Deadline: <strong className="text-[#001040]">{m.deadline.toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTED TALENT & ACTION */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#001040]">Talent yang Dipilih</h3>
          
          <div className="bg-white border border-[#006FE6] rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
              <div className="h-12 w-12 rounded-full bg-[#001040] flex items-center justify-center text-white font-bold text-xl">
                {application.talentProfile.user.name?.charAt(0) || "T"}
              </div>
              <div>
                <h4 className="font-bold text-lg text-[#001040]">{application.talentProfile.user.name || "Talent Anonim"}</h4>
                <p className="text-[#53647A] text-sm">{application.talentProfile.university || "Universitas tidak diketahui"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-[#ECFDF5] border border-[#A7F3D0] p-4 rounded-xl mb-6">
              <CheckCircle weight="fill" className="text-[#059669] shrink-0 mt-0.5" size={24} />
              <div className="text-sm text-[#065F46]">
                Anda telah membaca Alasan Melamar dan mempercayai Cocok Score <strong>({application.matchSnapshot?.cocokScore}%)</strong> dari Talent ini untuk menyelesaikan proyek Anda.
              </div>
            </div>

            <div className="bg-[#FFF1F2] border border-[#FECDD3] p-4 rounded-xl mb-6 text-sm flex gap-3 items-start">
               <WarningCircle weight="fill" className="text-[#E11D48] shrink-0 mt-0.5" size={24} />
               <div className="text-[#9F1239]">
                 <strong>Tindakan Final.</strong> Setelah Anda menyetujui, Talent lain yang melamar akan otomatis ditolak dan Anda akan diarahkan ke tahap pembayaran/funding.
               </div>
            </div>

            <div className="pt-2">
              <AcceptTalentForm applicationId={application.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
