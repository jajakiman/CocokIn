import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { calculateCocokScore } from "@/src/domain/matching/cocok-engine";
import { Lightning, Clock, Briefcase } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Marketplace Proyek | CocokIn",
};

export default async function TalentMarketplacePage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: {
      skills: {
        include: { skill: true }
      }
    }
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  // Fetch all published projects
  const publishedProjects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    include: {
      businessProfile: true,
      skills: {
        include: { skill: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Calculate CocokScore for each project
  const scoredProjects = publishedProjects.map((project) => {
    const match = calculateCocokScore(talentProfile, project);
    return { ...project, match };
  });

  // Sort by highest CocokScore
  scoredProjects.sort((a, b) => b.match.cocokScore - a.match.cocokScore);

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#001040]">Marketplace Proyek</h1>
        <p className="text-[#53647A] mt-1">
          Temukan proyek mikro UMKM yang paling cocok dengan keahlian Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scoredProjects.length === 0 ? (
          <div className="col-span-full p-12 text-center border rounded-xl bg-white text-[#53647A]">
            Belum ada proyek yang tersedia saat ini.
          </div>
        ) : (
          scoredProjects.map((project) => (
            <div key={project.id} className="border border-[#D8E1EE] rounded-xl bg-white flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="p-6 border-b border-[#D8E1EE] flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-lg text-[#001040]">{project.title}</h2>
                    <p className="text-[#53647A] text-sm mt-1">{project.businessProfile.businessName}</p>
                  </div>
                  <div className="bg-[#EAF3FF] text-[#006FE6] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Lightning weight="fill" /> {project.match.cocokScore}% Cocok
                  </div>
                </div>

                <p className="text-[#53647A] text-sm line-clamp-2 mb-4">{project.scope}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.slice(0, 3).map((ps) => (
                    <span key={ps.skillId} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">
                      {ps.skill.name}
                    </span>
                  ))}
                  {project.skills.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">+{project.skills.length - 3} lagi</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-[#53647A] font-medium">
                  <span className="flex items-center gap-1"><Clock size={16} /> {project.estimatedDays} hari</span>
                  <span className="flex items-center gap-1"><Briefcase size={16} /> {project.difficulty}</span>
                </div>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-b-xl flex justify-between items-center">
                <div className="text-lg font-bold text-[#001040]">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(project.serviceValue))}
                </div>
                <Link 
                  href={`/talent/projects/${project.id}`} 
                  className="bg-[#001040] !text-white px-6 py-2 rounded-lg font-medium hover:bg-[#001040]/90 transition-colors"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
