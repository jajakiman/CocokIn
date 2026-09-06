import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { ApplyProjectForm } from "@/src/components/projects/apply-project-form";
import { ProjectAgreementCard } from "@/src/components/projects/project-agreement-card";
import { Clock, Briefcase, Lightning, ArrowLeft, BuildingOffice, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  return { title: `Detail Proyek | CocokIn` };
}

export default async function TalentProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.projectId;
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      businessProfile: true,
      skills: { include: { skill: true } },
      agreement: true,
      applications: { where: { talentProfileId: talentProfile.id } },
    }
  });

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 text-center">
        <h1 className="text-2xl font-bold text-[#001040]">Proyek Tidak Ditemukan</h1>
        <p className="text-[#53647A]">Proyek yang Anda cari mungkin sudah ditutup atau tidak ada.</p>
        <Link href="/talent/projects" className="text-[#006FE6] font-bold hover:underline">
          &larr; Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  const existingApplication = project.applications[0];
  const isAccepted = existingApplication?.status === "ACCEPTED";

  if (project.status !== "PUBLISHED" && !isAccepted) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 text-center">
        <h1 className="text-2xl font-bold text-[#001040]">Proyek Tidak Tersedia</h1>
        <p className="text-[#53647A]">Proyek ini tidak lagi menerima lamaran baru atau Anda tidak memiliki akses.</p>
        <Link href="/talent/projects" className="text-[#006FE6] font-bold hover:underline">
          &larr; Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <Link href="/talent/projects" className="inline-flex items-center gap-2 text-[#53647A] font-medium hover:text-[#001040] transition-colors mb-4">
        <ArrowLeft weight="bold" /> Kembali ke Marketplace
      </Link>
      
      {project.status === "TALENT_SELECTED" && project.agreement && isAccepted && (
        <ProjectAgreementCard 
          projectId={project.id}
          role="TALENT"
          talentAgreedAt={project.agreement.talentAgreedAt}
          businessAgreedAt={project.agreement.businessAgreedAt}
          serviceValue={project.serviceValue}
          estimatedDays={project.estimatedDays}
        />
      )}

      <div className="bg-white border border-[#D8E1EE] rounded-2xl overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="p-8 border-b border-[#D8E1EE] bg-[#F8FAFC]">
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#001040] leading-tight mb-2">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 text-[#53647A] font-medium">
                <BuildingOffice size={18} />
                {project.businessProfile.businessName}
              </div>
            </div>
            <div className="bg-[#EAF3FF] text-[#006FE6] font-bold px-4 py-2 rounded-xl text-lg whitespace-nowrap">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(project.serviceValue))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-[#001040] font-medium">
            <div className="bg-white border border-[#D8E1EE] px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
              <Clock className="text-[#006FE6]" size={18} /> 
              Estimasi: {project.estimatedDays} hari
            </div>
            <div className="bg-white border border-[#D8E1EE] px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
              <Briefcase className="text-[#059669]" size={18} /> 
              Tingkat: {project.difficulty}
            </div>
            <div className="bg-white border border-[#D8E1EE] px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm">
              <Lightning className="text-[#FF8010]" size={18} /> 
              Deadline: {new Date(project.deadline).toLocaleDateString("id-ID")}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-bold text-[#001040] mb-3">Ruang Lingkup Proyek (Scope)</h2>
              <div className="text-[#53647A] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-[#D8E1EE]">
                {project.scope}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-[#001040] mb-3">Keahlian yang Dibutuhkan</h2>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((ps) => (
                  <span key={ps.skillId} className="bg-[#EAF3FF] text-[#006FE6] font-semibold text-sm px-3 py-1.5 rounded-lg border border-[#BAE6FD]">
                    {ps.skill.name}
                  </span>
                ))}
                {project.skills.length === 0 && (
                  <span className="text-[#53647A] text-sm italic">Tidak ada keahlian spesifik yang dicantumkan.</span>
                )}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            {existingApplication ? (
              <div className={`border p-6 rounded-xl flex flex-col items-center text-center sticky top-24 ${isAccepted ? 'bg-[#FFF4E5] border-[#FF8010]' : 'bg-[#ECFDF5] border-[#059669]'}`}>
                <CheckCircle size={48} weight="fill" className={isAccepted ? 'text-[#FF8010] mb-4' : 'text-[#059669] mb-4'} />
                <h3 className="font-bold text-[#001040] text-lg mb-2">
                  {isAccepted ? "Lamaran Diterima!" : "Lamaran Terkirim!"}
                </h3>
                <p className={isAccepted ? "text-[#FF8010] text-sm" : "text-[#059669] text-sm"}>
                  {isAccepted 
                    ? "Selamat! Lamaran Anda telah diterima oleh UMKM. Silakan tinjau dan tandatangani perjanjian proyek." 
                    : "Anda sudah melamar untuk proyek ini. UMKM sedang meninjau lamaran Anda beserta kandidat lainnya."}
                </p>
                <div className={`mt-6 w-full p-4 bg-white rounded-lg border text-sm text-left ${isAccepted ? 'border-[#FF8010]/30' : 'border-[#A7F3D0]'}`}>
                  <span className="block font-bold text-[#001040] mb-1">Status:</span>
                  <span className={`font-semibold uppercase ${isAccepted ? 'text-[#FF8010]' : 'text-[#059669]'}`}>{existingApplication.status}</span>
                </div>
              </div>
            ) : (
              <div className="sticky top-24">
                <ApplyProjectForm projectId={project.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
