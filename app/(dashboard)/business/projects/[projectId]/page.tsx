import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, Briefcase } from "@phosphor-icons/react/dist/ssr";
import { ProjectAgreementCard } from "@/src/components/projects/project-agreement-card";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Detail Proyek | CocokIn`,
  };
}

export default async function BusinessProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
  });

  if (!profile) redirect("/business/profile");

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: {
      skills: { include: { skill: true } },
      milestones: { include: { criteria: true }, orderBy: { deadline: 'asc' } },
      agreement: true,
      _count: { select: { applications: true } }
    }
  });

  if (!project || project.businessProfileId !== profile.id) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        Proyek tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <Link href="/business" className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-4">
          <ArrowLeft weight="bold" /> Kembali ke Dashboard
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#001040]">{project.title}</h1>
            <div className="flex gap-4 mt-2 text-sm font-medium text-[#53647A]">
              <span className="flex items-center gap-1"><Clock size={16} /> Estimasi {project.estimatedDays} hari</span>
              <span className="flex items-center gap-1"><Briefcase size={16} /> Tingkat {project.difficulty}</span>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-3">
            <span className="bg-[#EAF3FF] text-[#006FE6] font-bold px-3 py-1.5 rounded-lg border border-[#006FE6]">
              Status: {project.status}
            </span>
            {project.status !== "DRAFT" && project.status !== "PUBLISHED" && (
              <Link href={`/projects/${project.id}/chat`} className="bg-[#EAF5F8] text-[#0080FF] font-bold px-4 py-2 rounded-lg text-sm border border-[#0080FF]/20 hover:bg-[#D4EDF4] transition-colors">
                Buka Ruang Chat
              </Link>
            )}
          </div>
        </div>
      </div>

      {project.status === "TALENT_SELECTED" && project.agreement && (
        <ProjectAgreementCard 
          projectId={project.id}
          role="BUSINESS"
          talentAgreedAt={project.agreement.talentAgreedAt}
          businessAgreedAt={project.agreement.businessAgreedAt}
          serviceValue={project.serviceValue}
          estimatedDays={project.estimatedDays}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
            <h2 className="text-xl font-bold text-[#001040] mb-4">Scope Pekerjaan</h2>
            <p className="text-[#001040] whitespace-pre-line">{project.scope}</p>
            
            <h3 className="text-lg font-bold text-[#001040] mt-6 mb-3">Keahlian yang Dibutuhkan</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((ps) => (
                <span key={ps.skillId} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border">
                  {ps.skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
            <h2 className="text-xl font-bold text-[#001040] mb-4">Milestone Pekerjaan ({project.milestones.length})</h2>
            <div className="space-y-4">
              {project.milestones.map((m, idx) => (
                <div key={m.id} className="border border-[#D8E1EE] p-4 rounded-lg bg-[#F8FAFC]">
                  <div className="flex justify-between font-bold text-[#001040] mb-2">
                    <span>{idx + 1}. {m.title}</span>
                    <span className="text-[#0080FF]">{m.weightBps / 100}%</span>
                  </div>
                  <p className="text-sm text-[#53647A] mb-2">Deadline: {m.deadline.toLocaleDateString('id-ID')}</p>
                  <ul className="list-disc pl-5 text-sm text-[#001040]">
                    {m.criteria.map(c => (
                      <li key={c.id}>{c.description}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm text-center">
            <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border">
              <Users size={32} className="text-[#FF8010]" />
            </div>
            <h3 className="text-[#53647A] text-sm font-medium mb-1">Total Pelamar</h3>
            <p className="text-4xl font-bold text-[#001040] mb-4">{project._count.applications}</p>
            <Link 
              href={`/business/projects/${project.id}/applicants`}
              className="block w-full bg-[#FF8010] hover:bg-[#FF8010]/90 text-white font-medium py-2 rounded-lg transition-colors"
            >
              Lihat Review Hub
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
            <h3 className="text-[#53647A] text-sm font-medium mb-1">Nilai Imbalan</h3>
            <p className="text-2xl font-bold text-[#001040]">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(project.serviceValue))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
