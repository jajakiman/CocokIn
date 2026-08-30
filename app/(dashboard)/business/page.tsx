import { redirect } from "next/navigation";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { Plus, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function BusinessDashboardPage() {
  const session = await getSession();
  
  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
    include: {
      assessments: true,
      projects: {
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!profile || !profile.assessments || profile.assessments.length === 0) {
    redirect("/business/profile");
  }

  const assessment = profile.assessments[0];

  const isVerified = profile.verificationStatus === "VERIFIED_BUSINESS";

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001040]">
            Halo, {profile.businessName}!
          </h1>
          <p className="text-[#53647A] mt-1">
            Pantau dan kelola seluruh proyek digital Anda di sini.
          </p>
        </div>
        <Link 
          href="/business/projects/new" 
          className="inline-flex items-center gap-2 bg-[#FF8010] hover:bg-[#FF8010]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} weight="bold" />
          Buat Proyek Baru
        </Link>
      </div>

      {/* Verification Status Banner */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 ${isVerified ? 'bg-[#EAF3FF] border-[#006FE6]' : 'bg-[#FFF3E0] border-[#FF8010]'}`}>
        {isVerified ? (
          <CheckCircle size={28} className="text-[#006FE6]" weight="fill" />
        ) : (
          <WarningCircle size={28} className="text-[#FF8010]" weight="fill" />
        )}
        <div>
          <h3 className={`font-semibold ${isVerified ? 'text-[#001040]' : 'text-[#A04B00]'}`}>
            {isVerified ? 'Bisnis Anda Terverifikasi' : 'Menunggu Verifikasi Profil'}
          </h3>
          <p className={`text-sm ${isVerified ? 'text-[#53647A]' : 'text-[#A04B00]/80'}`}>
            {isVerified 
              ? 'Anda memiliki akses penuh untuk merekrut Talent terbaik.'
              : 'Profil bisnis Anda sedang kami tinjau. Anda tetap bisa membuat draf proyek.'}
          </p>
        </div>
      </div>

      {/* Stats / Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h3 className="text-[#53647A] text-sm font-medium">Cocok Score Kesiapan</h3>
          <p className="text-4xl font-bold text-[#001040] mt-2">{assessment.readinessScore}</p>
          <p className="text-sm text-[#006FE6] mt-2 cursor-pointer hover:underline">Lihat Detail Asesmen →</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h3 className="text-[#53647A] text-sm font-medium">Proyek Aktif</h3>
          <p className="text-4xl font-bold text-[#001040] mt-2">{profile.projects.filter(p => p.status === 'IN_PROGRESS').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h3 className="text-[#53647A] text-sm font-medium">Dana Terkunci (Escrow)</h3>
          <p className="text-4xl font-bold text-[#001040] mt-2">Rp 0</p>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-[#D8E1EE] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#D8E1EE]">
          <h2 className="text-xl font-bold text-[#001040]">Proyek Terakhir</h2>
        </div>
        <div className="divide-y divide-[#D8E1EE]">
          {profile.projects.length === 0 ? (
            <div className="p-8 text-center text-[#53647A]">
              Belum ada proyek. Mulai buat proyek pertama Anda!
            </div>
          ) : (
            profile.projects.map((project) => (
              <div key={project.id} className="p-6 flex items-center justify-between hover:bg-[#F7F9FC] transition-colors">
                <div>
                  <h3 className="font-semibold text-[#001040]">{project.title}</h3>
                  <p className="text-sm text-[#53647A] mt-1">{project.status}</p>
                </div>
                <Link href={`/projects/${project.id}`} className="text-[#0080FF] font-medium text-sm hover:underline">
                  Kelola
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
