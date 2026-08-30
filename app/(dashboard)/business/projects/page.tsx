import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { Plus, Briefcase, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Proyek Anda | CocokIn` };
}

export default async function BusinessProjectsPage() {
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
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <PageHeader
          title="Manajemen Proyek"
          description="Buat, pantau, dan kelola semua proyek digital Anda."
        />
        <Link 
          href="/business/projects/new" 
          className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-[#FF8010] hover:bg-[#FF8010]/90 !text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} weight="bold" />
          Buat Proyek Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-[#D8E1EE] p-12 rounded-xl text-center shadow-sm">
          <Briefcase size={48} className="mx-auto text-[#9AABC2] mb-4" />
          <h2 className="text-xl font-bold text-[#001040] mb-2">Belum Ada Proyek</h2>
          <p className="text-[#53647A] mb-6">Mulai perjalanan transformasi digital Anda dengan memposting proyek pertama Anda.</p>
          <Link href="/business/projects/new" className="bg-[#001040] hover:bg-[#001040]/90 text-white px-6 py-3 rounded-lg font-bold transition-colors">
            Mulai Proyek Pertama
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-[#D8E1EE] rounded-xl overflow-hidden shadow-sm hover:border-[#0080FF] transition-all group flex flex-col h-full">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-bold text-xs px-2 py-1 rounded ${
                    project.status === 'PUBLISHED' ? 'bg-[#EAF3FF] text-[#006FE6]' :
                    project.status === 'IN_PROGRESS' ? 'bg-[#FFF3E8] text-[#FF8010]' :
                    project.status === 'COMPLETED' ? 'bg-[#ECFDF5] text-[#059669]' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="font-bold text-[#001040] text-lg mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-[#53647A] text-sm mt-4">
                  Estimasi: {project.estimatedDays} Hari
                </p>
                <p className="text-[#53647A] text-sm mt-1">
                  Budget: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(project.serviceValue))}
                </p>
              </div>
              <div className="bg-[#F8FAFC] border-t border-[#D8E1EE] p-4 mt-auto">
                <Link 
                  href={`/business/projects/${project.id}`}
                  className="flex items-center justify-between text-[#006FE6] font-medium group-hover:text-[#001040] transition-colors"
                >
                  Lihat Detail <ArrowRight weight="bold" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
