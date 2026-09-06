import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { EmptyState } from "@/src/design-system/empty-state";
import { CheckCircle, Globe, Lock, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { StatusBadge } from "@/src/design-system/status-badge";

export async function generateMetadata() {
  return { title: `Portofolio | CocokIn` };
}

export default async function TalentPortfolioPage() {
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

  const entries = await prisma.portfolioEntry.findMany({
    where: { talentProfileId: talentProfile.id },
    include: { project: { include: { skills: { include: { skill: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="portfolio-container max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        eyebrow="Rekam Jejak Nyata"
        title="Portofolio Terverifikasi UMKM"
        description="Karya digital dari proyek mikro yang telah tuntas dan disahkan langsung oleh pemilik usaha UMKM."
      />

      {entries.length === 0 ? (
        <EmptyState
          title="Belum ada portofolio terverifikasi"
          description="Selesaikan proyek pertamamu di workspace untuk otomatis menerbitkan draf portofolio berstempel resmi."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {entries.map((entry) => (
            <article key={entry.id} className="bg-white rounded-xl border border-[#D8E1EE] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-6 border-b border-[#D8E1EE] bg-[#F8FAFC]">
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="inline-flex items-center gap-1 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] px-2 py-1 rounded text-xs font-bold">
                    <ShieldCheck size={14} weight="fill" />
                    Verified by {entry.businessName}
                  </div>
                  {entry.isPublic ? (
                    <div className="inline-flex items-center gap-1 bg-[#EAF3FF] text-[#006FE6] border border-[#BAE6FD] px-2 py-1 rounded text-xs font-bold">
                      <Globe size={14} weight="bold" /> Publik
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-[#F1F5F9] text-[#64748B] border border-[#CBD5E1] px-2 py-1 rounded text-xs font-bold">
                      <Lock size={14} weight="bold" /> Privat (Draf)
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#001040] line-clamp-2">{entry.title}</h3>
              </div>

              <div className="p-6 space-y-4 flex-1">
                <div>
                  <strong className="block text-sm text-[#001040] mb-1">Tantangan Bisnis:</strong>
                  <p className="text-sm text-[#53647A] line-clamp-3">{entry.problemSummary}</p>
                </div>
                <div>
                  <strong className="block text-sm text-[#001040] mb-1">Solusi yang Dibangun:</strong>
                  <p className="text-sm text-[#53647A] line-clamp-3">{entry.solutionBuilt}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-dashed border-[#D8E1EE]">
                  {entry.project.skills.map((ps) => (
                    <span key={ps.skillId} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border">
                      {ps.skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] border-t border-[#D8E1EE]">
                 {/* Temporary placeholder for visibility form until we build Server Action */}
                 <p className="text-xs text-[#53647A] text-center">Atribusi UMKM: <span className="text-[#059669] font-bold"><CheckCircle size={14} weight="fill" className="inline" /> Disetujui</span></p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
