import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Briefcase, Lightning } from "@phosphor-icons/react/dist/ssr";
import { calculateCocokScore } from "@/src/domain/matching/cocok-engine";
import { ApplyProjectForm } from "@/src/components/projects/apply-project-form";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Detail Proyek | CocokIn`,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: { skills: { include: { skill: true } } }
  });

  if (!talentProfile) redirect("/talent/profile");

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: {
      businessProfile: true,
      skills: { include: { skill: true } },
      milestones: {
        include: { criteria: true },
        orderBy: { deadline: 'asc' }
      }
    }
  });

  if (!project || project.status !== "PUBLISHED") {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        Proyek tidak ditemukan atau tidak tersedia lagi.
      </div>
    );
  }

  // Check if already applied
  const existingApp = await prisma.projectApplication.findUnique({
    where: { projectId_talentProfileId: { projectId: project.id, talentProfileId: talentProfile.id } }
  });

  const match = calculateCocokScore(talentProfile, project);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <Link href="/talent/marketplace" className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium">
        <ArrowLeft weight="bold" /> Kembali ke Marketplace
      </Link>
      
      <div className="bg-white p-8 rounded-xl border border-[#D8E1EE] shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#001040]">{project.title}</h1>
            <p className="text-lg text-[#53647A] mt-1">{project.businessProfile.businessName}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#FF8010]">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(project.serviceValue))}
            </div>
            <p className="text-sm text-[#53647A]">Nilai Imbalan Proyek</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium text-[#53647A]">
          <span className="flex items-center gap-1 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border">
            <Clock size={18} /> Estimasi {project.estimatedDays} hari
          </span>
          <span className="flex items-center gap-1 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border">
            <Briefcase size={18} /> Tingkat {project.difficulty}
          </span>
          <span className="flex items-center gap-1 bg-[#EAF3FF] text-[#006FE6] border-[#006FE6] border px-3 py-1.5 rounded-lg">
            <Lightning size={18} weight="fill" /> {match.cocokScore}% Cocok (Cocok Score)
          </span>
        </div>

        <div className="prose max-w-none text-[#001040] mb-8">
          <h3 className="text-xl font-bold mb-2">Scope Pekerjaan</h3>
          <p className="whitespace-pre-line">{project.scope}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#001040] mb-4">Keahlian yang Dibutuhkan</h3>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((ps) => {
              const hasSkill = talentProfile.skills.some(ts => ts.skill.name.toLowerCase() === ps.skill.name.toLowerCase());
              return (
                <span key={ps.skillId} className={`px-3 py-1 rounded-full text-sm ${hasSkill ? 'bg-[#ECFDF5] text-[#059669] border border-[#059669]' : 'bg-gray-100 text-gray-700'}`}>
                  {ps.skill.name} {hasSkill && '✓'}
                </span>
              );
            })}
          </div>
          <p className="text-sm text-[#53647A] mt-2 italic">{match.explainableText}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold text-[#001040] mb-4">Milestone Pekerjaan ({project.milestones.length})</h3>
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

        {existingApp ? (
          <div className="bg-[#ECFDF5] border border-[#059669] text-[#059669] p-4 rounded-xl font-semibold text-center mt-8">
            Anda sudah melamar proyek ini. Status lamaran: {existingApp.status}
          </div>
        ) : (
          <ApplyProjectForm projectId={project.id} />
        )}
      </div>
    </div>
  );
}
