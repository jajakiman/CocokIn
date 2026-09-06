import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/src/design-system/page-header";
import { calculateDigitalGrowth } from "@/src/modules/business/digital-growth";
import { DigitalGrowthChart } from "@/src/components/business/digital-growth-chart";
import {
  TrendUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Storefront,
  Lightbulb,
  RocketLaunch,
} from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: "Pertumbuhan Digital UMKM | CocokIn" };
}

export default async function BusinessGrowthPage() {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
    include: {
      assessments: {
        orderBy: { createdAt: "asc" },
      },
      projects: {
        where: {
          status: { in: ["IN_PROGRESS", "STAGING_REVIEW", "DELIVERED", "COMPLETED"] },
        },
        include: {
          milestones: true,
          applications: {
            where: { status: "ACCEPTED" },
            include: { talentProfile: { include: { user: true } } },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!profile) {
    redirect("/business/profile");
  }

  const growth = calculateDigitalGrowth(profile.assessments);
  const deliveredOrCompletedProjects = profile.projects.filter(
    (p) => p.status === "DELIVERED" || p.status === "COMPLETED"
  );
  const inProgressProjects = profile.projects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "STAGING_REVIEW"
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <PageHeader
        eyebrow="Evaluasi Dampak Proyek"
        title="Pertumbuhan Kesiapan Digital"
        description="Pantau perkembangan adopsi teknologi bisnis Anda seiring selesainya proyek mikro bersama talenta digital."
        action={
          <Link
            href="/business/assessment"
            className="inline-flex items-center gap-2 bg-[#001040] hover:bg-[#001040]/90 !text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <span>Evaluasi Ulang Kesiapan</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        }
      />

      {/* Top Bento Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Baseline Score */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#53647A] block">
            Skor Awal (Baseline)
          </span>
          <div className="text-3xl font-black text-[#53647A] mt-2 tabular-nums">
            {growth.baseline ? `${growth.baseline.readinessScore}/100` : "-"}
          </div>
          <p className="text-xs text-[#53647A] mt-2">
            Titik awal kesiapan saat pertama bergabung di CocokIn.
          </p>
        </div>

        {/* Current Score */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006FE6] block">
            Skor Terkini
          </span>
          <div className="text-3xl font-black text-[#001040] mt-2 tabular-nums">
            {growth.latest ? `${growth.latest.readinessScore}/100` : "-"}
          </div>
          <p className="text-xs text-[#047857] font-semibold mt-2 flex items-center gap-1">
            <CheckCircle weight="fill" /> Berdasarkan evaluasi proyek digital
          </p>
        </div>

        {/* Net Growth (Delta) */}
        <div className="bg-[#EAF3FF] border border-[#BAE6FD] p-5 rounded-xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006FE6] block flex items-center justify-between">
            <span>Peningkatan Skor (&Delta;)</span>
            <TrendUp size={18} weight="bold" className="text-[#006FE6]" />
          </span>
          <div className="text-3xl font-black text-[#006FE6] mt-2 tabular-nums">
            {growth.hasGrowth
              ? `${growth.deltaScore >= 0 ? "+" : ""}${growth.deltaScore} Poin`
              : "0 Poin"}
          </div>
          <p className="text-xs text-[#006FE6] font-semibold mt-2">
            {growth.hasGrowth
              ? `Pertumbuhan ${growth.deltaPercent >= 0 ? "+" : ""}${growth.deltaPercent}% dari baseline`
              : "Menunggu penyelesaian proyek pertama"}
          </p>
        </div>

        {/* Adoption Stage */}
        <div className="bg-white border border-[#D8E1EE] p-5 rounded-xl shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[#53647A] block flex items-center justify-between">
            <span>Status Transformasi</span>
            <RocketLaunch size={18} weight="duotone" className="text-[#FF8010]" />
          </span>
          <div className="text-lg font-bold text-[#001040] mt-2 leading-tight">
            {growth.stage}
          </div>
          <p className="text-xs text-[#53647A] mt-2 line-clamp-2 leading-relaxed">
            {growth.stageDescription}
          </p>
        </div>
      </div>

      {/* Main Analysis Section: 5-Pillars Comparison */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm">
        <DigitalGrowthChart pillars={growth.pillars} hasGrowth={growth.hasGrowth} />
      </div>

      {/* Projects Driving Digital Transformation */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8E1EE]">
          <div>
            <h2 className="text-lg font-bold text-[#001040]">Proyek Pendorong Transformasi Digital</h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Daftar proyek mikro terverifikasi yang berkontribusi langsung pada peningkatan pilar kesiapan usaha Anda.
            </p>
          </div>

          <Link
            href="/business/projects"
            className="text-xs font-bold text-[#006FE6] hover:underline shrink-0"
          >
            Lihat Semua Proyek &rarr;
          </Link>
        </div>

        {deliveredOrCompletedProjects.length === 0 && inProgressProjects.length === 0 ? (
          <div className="p-8 text-center bg-[#F8FAFC] rounded-xl border border-[#D8E1EE] space-y-3">
            <Storefront size={36} className="mx-auto text-[#9AABC2]" />
            <h3 className="font-bold text-base text-[#001040]">Belum Ada Proyek Digital yang Selesai</h3>
            <p className="text-xs text-[#53647A] max-w-md mx-auto leading-relaxed">
              Mulailah berkolaborasi dengan Talent muda untuk membangun katalog online, POS kasir, atau landing page. Skor pertumbuhan Anda akan otomatis meningkat setelah proyek tuntas diserahterimakan!
            </p>
            <div className="pt-2">
              <Link
                href="/business/projects/new"
                className="inline-flex items-center gap-2 bg-[#001040] hover:bg-[#001040]/90 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <span>Mulai Proyek Pertama</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveredOrCompletedProjects.map((p) => {
              const talent = p.applications[0]?.talentProfile?.user;
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl border border-[#D8E1EE] bg-[#F8FAFC] hover:bg-white hover:border-[#006FE6] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                        {p.status === "COMPLETED" ? "Selesai 100%" : "Masa Garansi Aktif"}
                      </span>
                      <span className="text-xs text-[#53647A] font-medium">
                        {p.milestones.length} Milestone Tuntas
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#001040]">{p.title}</h3>
                    <p className="text-xs text-[#53647A] line-clamp-2 leading-relaxed">
                      {p.scope}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D8E1EE] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#53647A]">
                      <ShieldCheck size={16} className="text-[#047857]" />
                      <span>Talent: <strong className="text-[#001040]">{talent?.name || "Budi Santoso"}</strong></span>
                    </div>

                    <Link
                      href={`/business/projects/${p.id}`}
                      className="font-bold text-[#006FE6] hover:underline"
                    >
                      Detail &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}

            {inProgressProjects.map((p) => {
              const talent = p.applications[0]?.talentProfile?.user;
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl border border-[#D8E1EE] bg-[#FFFBEB]/50 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                        {p.status === "STAGING_REVIEW" ? "Perlu Review Staging" : "Sedang Dikerjakan"}
                      </span>
                      <span className="text-xs text-[#53647A] font-medium">
                        {p.milestones.length} Milestone
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[#001040]">{p.title}</h3>
                    <p className="text-xs text-[#53647A] line-clamp-2 leading-relaxed">
                      {p.scope}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D8E1EE] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#53647A]">
                      <Lightbulb size={16} className="text-[#B45309]" />
                      <span>Talent: <strong className="text-[#001040]">{talent?.name || "Budi Santoso"}</strong></span>
                    </div>

                    <Link
                      href={`/business/projects/${p.id}`}
                      className="font-bold text-[#001040] hover:underline"
                    >
                      Buka Workspace &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
