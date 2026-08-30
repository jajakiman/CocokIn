import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Briefcase, ArrowRight, Star, WarningCircle, CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import { calculateCocokScore } from "@/src/domain/matching/cocok-engine";

export async function generateMetadata() {
  return { title: `Dashboard Talent | CocokIn` };
}

export default async function TalentDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: {
      user: true,
      skills: { include: { skill: true } },
      assessments: true,
      applications: {
        include: { project: { include: { businessProfile: true } } },
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  // Determine Active Projects (where application is ACCEPTED and project is not COMPLETED)
  const activeApplications = talentProfile.applications.filter(
    app => app.status === "ACCEPTED" && !["COMPLETED", "CANCELLED", "PUBLISHED"].includes(app.project.status)
  );

  const pendingApplications = talentProfile.applications.filter(
    app => app.status === "PENDING"
  );

  // Fetch Recommended Matches (PUBLISHED projects that the talent hasn't applied to)
  const appliedProjectIds = talentProfile.applications.map(app => app.projectId);
  const openProjects = await prisma.project.findMany({
    where: { 
      status: "PUBLISHED",
      id: { notIn: appliedProjectIds }
    },
    include: { businessProfile: true, skills: { include: { skill: true } } },
    take: 10
  });

  const recommendedProjects = openProjects
    .map(project => {
      const match = calculateCocokScore(talentProfile, project as any);
      return { project, score: match.cocokScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3 recommendations

  // Readiness / Skill gaps logic
  const verifiedSkillsCount = talentProfile.skills.filter(s => s.evidenceLevel !== "SELF_DECLARED").length;
  const selfDeclaredSkillsCount = talentProfile.skills.filter(s => s.evidenceLevel === "SELF_DECLARED").length;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-[#001040]">Selamat Datang, {talentProfile.user.name?.split(" ")[0]}!</h1>
        <p className="text-[#53647A] mt-1 text-lg">
          Mari selesaikan proyek Anda atau temukan peluang baru yang cocok dengan keahlian Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (Priority: Active Projects, Readiness) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. ACTIVE PROJECT (Top priority as per markdown) */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#001040] flex items-center gap-2">
                <Briefcase weight="fill" className="text-[#006FE6]" /> Proyek Aktif
              </h2>
            </div>
            
            {activeApplications.length > 0 ? (
              <div className="space-y-4">
                {activeApplications.map(app => (
                  <div key={app.id} className="bg-white border-2 border-[#006FE6] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#001040]">{app.project.title}</h3>
                        <p className="text-[#53647A] mt-1">{app.project.businessProfile.businessName}</p>
                      </div>
                      <div className="bg-[#EAF3FF] text-[#006FE6] px-3 py-1 rounded-lg text-sm font-bold border border-[#BAE6FD]">
                        {app.project.status === "TALENT_SELECTED" ? "Menunggu Funding UMKM" : "Sedang Berjalan"}
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#001040] mb-6 bg-[#F8FAFC] p-3 rounded-lg border border-[#D8E1EE] line-clamp-2">
                      {app.project.scope}
                    </p>

                    <Link 
                      href={`/talent/projects/${app.project.id}/workspace`}
                      className="inline-flex items-center justify-center w-full md:w-auto bg-[#001040] hover:bg-[#001040]/90 text-white font-bold py-3 px-6 rounded-xl transition-colors gap-2"
                    >
                      Buka Workspace Proyek <ArrowRight weight="bold" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#D8E1EE] rounded-xl p-8 text-center text-[#53647A]">
                Anda tidak memiliki proyek aktif saat ini. Cek rekomendasi di bawah untuk melamar.
              </div>
            )}
          </section>

          {/* 2. RECOMMENDED MATCHES */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#001040]">Rekomendasi Proyek</h2>
              <Link href="/talent/marketplace" className="text-[#006FE6] font-bold text-sm hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProjects.length > 0 ? (
                recommendedProjects.map(({ project, score }) => (
                  <Link href={`/talent/marketplace/${project.id}`} key={project.id} className="bg-white border border-[#D8E1EE] rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-[#EAF3FF] text-[#006FE6] font-bold text-sm px-2 py-1 rounded flex items-center gap-1 shrink-0">
                          Cocok {score}%
                        </div>
                        <div className="text-xs font-bold text-[#FF8010] bg-[#FFFBEB] px-2 py-1 rounded">
                          Rp {(Number(project.serviceValue) / 1000000).toFixed(1)} Jt
                        </div>
                      </div>
                      <h3 className="font-bold text-[#001040] group-hover:text-[#006FE6] transition-colors">{project.title}</h3>
                      <p className="text-xs text-[#53647A] mt-1 line-clamp-1">{project.businessProfile.businessName}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-dashed flex gap-2 overflow-x-hidden">
                      {project.skills.slice(0, 3).map((ps: any, i: number) => (
                         <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-1 rounded border whitespace-nowrap">
                           {ps.skill.name}
                         </span>
                      ))}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full bg-white border border-[#D8E1EE] rounded-xl p-8 text-center text-[#53647A]">
                  Belum ada proyek baru yang cocok dengan profil Anda.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN (Priority: Readiness, Skill Gaps, Pending Apps) */}
        <div className="space-y-6">
          
          {/* READINESS & SKILLS */}
          <div className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-[#001040] mb-4 text-lg border-b pb-2">Status Profil & Keahlian</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#53647A] font-medium">Kelengkapan Profil</span>
                  <span className="font-bold text-[#006FE6]">
                    {talentProfile.bio && talentProfile.university ? '100%' : '75%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#006FE6] h-2 rounded-full transition-all duration-500" style={{ width: talentProfile.bio && talentProfile.university ? '100%' : '75%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#F8FAFC] border p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#001040]">{talentProfile.skills.length}</div>
                  <div className="text-xs text-[#53647A] mt-1">Total Keahlian</div>
                </div>
                <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#059669]">{verifiedSkillsCount}</div>
                  <div className="text-xs text-[#059669] mt-1">Terverifikasi</div>
                </div>
              </div>

              {selfDeclaredSkillsCount > 0 && (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] p-3 rounded-lg flex gap-3 items-start">
                  <WarningCircle className="text-[#B45309] shrink-0 mt-0.5" size={20} weight="fill" />
                  <div className="text-sm text-[#92400E]">
                    Anda memiliki <strong>{selfDeclaredSkillsCount} keahlian</strong> yang belum diverifikasi. Ikuti asesmen untuk meningkatkan Cocok Score Anda!
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PENDING APPLICATIONS */}
          <div className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm">
             <div className="bg-[#F8FAFC] p-4 border-b">
               <h3 className="font-bold text-[#001040] text-sm uppercase tracking-wider flex items-center gap-2">
                 <Clock weight="bold" /> Lamaran Menunggu Review
               </h3>
             </div>
             <div className="divide-y divide-[#D8E1EE]">
               {pendingApplications.length > 0 ? (
                 pendingApplications.map(app => (
                   <div key={app.id} className="p-4 hover:bg-[#F8FAFC] transition-colors">
                     <h4 className="font-bold text-[#001040] text-sm">{app.project.title}</h4>
                     <p className="text-xs text-[#53647A] mt-1">{app.project.businessProfile.businessName}</p>
                     <div className="mt-2 text-[10px] font-bold text-[#64748B] bg-gray-100 inline-block px-2 py-1 rounded">
                       Status: PENDING
                     </div>
                   </div>
                 ))
               ) : (
                 <div className="p-6 text-center text-sm text-[#53647A]">
                   Tidak ada lamaran yang sedang diproses.
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
