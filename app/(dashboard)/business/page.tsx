import { redirect } from "next/navigation";
import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { Plus, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { StatusBadge, type StatusTone } from "@/src/design-system/status-badge";
import { calculateBalanceSheet } from "@/src/modules/payments/ledger";
import { formatIdr } from "@/src/lib/money";

const PROJECT_STATUS: Record<string, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Draf", tone: "neutral" },
  PUBLISHED: { label: "Mencari Talent", tone: "info" },
  TALENT_SELECTED: { label: "Talent Terpilih", tone: "warning" },
  AGREEMENT_CONFIRMED: { label: "Kesepakatan Dikonfirmasi", tone: "info" },
  FUNDING_PENDING: { label: "Menunggu Pendanaan", tone: "warning" },
  FUNDED: { label: "Sudah Didanai", tone: "info" },
  IN_PROGRESS: { label: "Sedang Dikerjakan", tone: "info" },
  STAGING_REVIEW: { label: "Perlu Review", tone: "warning" },
  PRODUCTION_DEPLOYMENT: { label: "Deployment Produksi", tone: "info" },
  HANDOVER_PENDING: { label: "Menunggu Serah Terima", tone: "warning" },
  DELIVERED: { label: "Masa Garansi", tone: "success" },
  COMPLETED: { label: "Selesai", tone: "success" },
  CANCELLED: { label: "Dibatalkan", tone: "destructive" },
  DISPUTED: { label: "Sengketa", tone: "destructive" },
};

export default async function BusinessDashboardPage() {
  const session = await getSession();
  
  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
    include: {
      assessments: { orderBy: { createdAt: "desc" }, take: 1 },
    }
  });

  if (!profile || !profile.assessments || profile.assessments.length === 0) {
    redirect("/business/profile");
  }

  const assessment = profile.assessments[0];
  const isVerified = profile.verificationStatus === "VERIFIED_BUSINESS";

  const [recentProjects, activeProjectCount, pendingApplications, reviewMilestones, ledgerEntries] = await Promise.all([
    prisma.project.findMany({
      where: { businessProfileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.project.count({
      where: {
        businessProfileId: profile.id,
        status: { in: ["IN_PROGRESS", "STAGING_REVIEW", "PRODUCTION_DEPLOYMENT", "HANDOVER_PENDING", "DELIVERED"] },
      },
    }),
    prisma.projectApplication.findMany({
      where: { project: { businessProfileId: profile.id }, status: "PENDING" },
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.projectMilestone.findMany({
      where: { project: { businessProfileId: profile.id }, status: "READY_FOR_REVIEW" },
      include: { project: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.ledgerEntry.findMany({
      where: { escrowTransaction: { project: { businessProfileId: profile.id } } },
      select: { accountType: true, amount: true },
    }),
  ]);

  const lockedFunds = calculateBalanceSheet(ledgerEntries).requiredReserve;

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
          className="inline-flex items-center gap-2 bg-[#001040] hover:bg-[#001040]/90 !text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
          <Link href="/business/my-profile" className="text-sm text-[#006FE6] mt-2 inline-block hover:underline">Lihat Detail Asesmen →</Link>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h3 className="text-[#53647A] text-sm font-medium">Proyek Aktif</h3>
          <p className="text-4xl font-bold text-[#001040] mt-2 tabular-nums">{activeProjectCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#D8E1EE] shadow-sm">
          <h3 className="text-[#53647A] text-sm font-medium">Dana Wajib Dicadangkan</h3>
          <p className="text-4xl font-bold text-[#001040] mt-2 tabular-nums">{formatIdr(lockedFunds)}</p>
          <p className="text-xs text-[#53647A] mt-2">Liabilitas proyek yang wajib ditutup kas 100%</p>
        </div>
      </div>

      {(pendingApplications.length > 0 || reviewMilestones.length > 0) && (
        <section className="bg-white rounded-xl border border-[#D8E1EE] shadow-sm overflow-hidden" aria-labelledby="action-center-title">
          <div className="p-6 border-b border-[#D8E1EE]">
            <h2 id="action-center-title" className="text-xl font-bold text-[#001040]">Perlu Tindakan Anda</h2>
            <p className="text-sm text-[#53647A] mt-1">Keputusan berikut diperlukan agar proyek tetap bergerak.</p>
          </div>
          <div className="divide-y divide-[#D8E1EE]">
            {reviewMilestones.map((milestone) => (
              <div key={milestone.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFBEB]">
                <div>
                  <StatusBadge tone="warning">Milestone siap direview</StatusBadge>
                  <h3 className="font-bold text-[#001040] mt-2">{milestone.title}</h3>
                  <p className="text-sm text-[#53647A]">{milestone.project.title}</p>
                </div>
                <Link href={`/business/projects/${milestone.projectId}/milestones/${milestone.id}/review`} className="font-bold text-sm text-[#001040] hover:underline">
                  Tinjau hasil →
                </Link>
              </div>
            ))}
            {pendingApplications.map((application) => (
              <div key={application.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <StatusBadge tone="info">Pelamar baru</StatusBadge>
                  <h3 className="font-bold text-[#001040] mt-2">{application.project.title}</h3>
                  <p className="text-sm text-[#53647A]">Talent menunggu keputusan seleksi UMKM.</p>
                </div>
                <Link href={`/business/projects/${application.projectId}/applicants`} className="font-bold text-sm text-[#006FE6] hover:underline">
                  Review pelamar →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Projects */}
      <div className="bg-white rounded-xl border border-[#D8E1EE] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#D8E1EE]">
          <h2 className="text-xl font-bold text-[#001040]">Proyek Terakhir</h2>
        </div>
        <div className="divide-y divide-[#D8E1EE]">
          {recentProjects.length === 0 ? (
            <div className="p-8 text-center text-[#53647A]">
              Belum ada proyek. Mulai buat proyek pertama Anda!
            </div>
          ) : (
            recentProjects.map((project) => {
              const status = PROJECT_STATUS[project.status] ?? { label: project.status, tone: "neutral" as const };
              return (
              <div key={project.id} className="p-6 flex items-center justify-between hover:bg-[#F7F9FC] transition-colors">
                <div>
                  <h3 className="font-semibold text-[#001040]">{project.title}</h3>
                  <div className="mt-2"><StatusBadge tone={status.tone}>{status.label}</StatusBadge></div>
                </div>
                <Link href={`/business/projects/${project.id}`} className="text-[#0080FF] font-medium text-sm hover:underline">
                  Kelola
                </Link>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
