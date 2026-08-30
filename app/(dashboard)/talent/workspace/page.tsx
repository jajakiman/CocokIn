import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { EmptyState } from "@/src/design-system/empty-state";
import { ArrowRight, Briefcase } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Proyek Saya | CocokIn` };
}

export default async function TalentWorkspacePage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: {
      applications: {
        where: { status: "ACCEPTED" },
        include: {
          project: {
            include: { businessProfile: true }
          }
        },
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  const activeProjects = talentProfile.applications.filter(
    app => !["COMPLETED", "CANCELLED", "DISPUTED"].includes(app.project.status)
  );

  const completedProjects = talentProfile.applications.filter(
    app => ["COMPLETED"].includes(app.project.status)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        eyebrow="Proyek Saya"
        title="Workspace Proyek"
        description="Kelola proyek aktif yang sedang berjalan dan lihat riwayat proyek yang telah diselesaikan."
      />

      <div className="space-y-12">
        {/* Active Projects */}
        <section>
          <h2 className="text-xl font-bold text-[#001040] flex items-center gap-2 mb-6">
            <Briefcase weight="fill" className="text-[#006FE6]" /> Proyek Sedang Berjalan
          </h2>
          
          {activeProjects.length === 0 ? (
            <EmptyState
              title="Tidak ada proyek aktif"
              description="Anda belum memiliki proyek yang sedang berjalan saat ini. Mulai cari proyek di Marketplace!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProjects.map(app => (
                <div key={app.id} className="bg-white border-2 border-[#006FE6] rounded-xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#001040]">{app.project.title}</h3>
                        <p className="text-[#53647A] text-sm mt-1">{app.project.businessProfile.businessName}</p>
                      </div>
                      <div className="bg-[#EAF3FF] text-[#006FE6] px-3 py-1 rounded-lg text-xs font-bold border border-[#BAE6FD] whitespace-nowrap">
                        {app.project.status === "TALENT_SELECTED" ? "Menunggu Funding" : "In Progress"}
                      </div>
                    </div>
                    <p className="text-sm text-[#001040] mb-6 bg-[#F8FAFC] p-3 rounded-lg border border-[#D8E1EE] line-clamp-3">
                      {app.project.scope}
                    </p>
                  </div>
                  <Link 
                    href={`/talent/projects/${app.project.id}/workspace`}
                    className="mt-4 flex items-center justify-center w-full bg-[#001040] hover:bg-[#001040]/90 text-white font-bold py-3 px-4 rounded-xl transition-colors gap-2"
                  >
                    Buka Workspace <ArrowRight weight="bold" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Completed Projects */}
        <section>
          <h2 className="text-xl font-bold text-[#001040] flex items-center gap-2 mb-6 pt-8 border-t border-[#D8E1EE]">
            <Briefcase weight="duotone" className="text-[#059669]" /> Riwayat Proyek Selesai
          </h2>
          
          {completedProjects.length === 0 ? (
             <div className="bg-white border border-[#D8E1EE] rounded-xl p-8 text-center text-[#53647A]">
               Anda belum menyelesaikan proyek.
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedProjects.map(app => (
                <div key={app.id} className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-md font-bold text-[#001040] line-clamp-1">{app.project.title}</h3>
                      <p className="text-[#53647A] text-xs mt-1">{app.project.businessProfile.businessName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 rounded-lg w-fit">
                    Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
