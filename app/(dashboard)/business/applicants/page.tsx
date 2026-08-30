import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { Users, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Hub Pelamar | CocokIn` };
}

export default async function GlobalApplicantsPage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
  });

  if (!profile) redirect("/business/profile");

  const projects = await prisma.project.findMany({
    where: { businessProfileId: profile.id },
    include: {
      _count: {
        select: { applications: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const activeProjects = projects.filter(p => p.status === "PUBLISHED" || p.status === "DRAFT");

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <PageHeader
        title="Hub Pelamar"
        description="Pilih proyek Anda di bawah ini untuk melihat dan menyeleksi Talent yang telah melamar."
      />

      {activeProjects.length === 0 ? (
        <div className="bg-white border border-[#D8E1EE] p-12 rounded-xl text-center shadow-sm">
          <Users size={48} className="mx-auto text-[#9AABC2] mb-4" />
          <h2 className="text-xl font-bold text-[#001040] mb-2">Belum Ada Proyek Aktif</h2>
          <p className="text-[#53647A] mb-6">Anda belum memiliki proyek yang sedang mencari talent.</p>
          <Link href="/business/projects/new" className="bg-[#FF8010] hover:bg-[#FF8010]/90 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Buat Proyek Baru
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {activeProjects.map((project) => (
            <div key={project.id} className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm hover:border-[#0080FF] transition-all group">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#EAF3FF] text-[#006FE6] font-bold text-xs px-2 py-1 rounded">
                    {project.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#001040] text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-[#FF8010] font-bold bg-[#FFF3E8] p-3 rounded-lg mt-4">
                  <Users size={20} weight="fill" />
                  <span>{project._count.applications} Pelamar</span>
                </div>
              </div>
              <div className="bg-[#F8FAFC] border-t border-[#D8E1EE] p-4 flex justify-between items-center">
                <span className="text-sm font-semibold text-[#53647A]">Kelola Pelamar</span>
                <Link 
                  href={`/business/projects/${project.id}/applicants`}
                  className="bg-[#001040] !text-white p-2 rounded-lg group-hover:bg-[#006FE6] transition-colors"
                >
                  <ArrowRight weight="bold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
