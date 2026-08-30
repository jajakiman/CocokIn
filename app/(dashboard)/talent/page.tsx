import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  ArrowRight,
  ClipboardText,
  IdentificationBadge,
  Sparkle,
  BookmarkSimple,
  ShareNetwork,
  CheckCircle,
  Lightning,
  Clock,
} from "@phosphor-icons/react/dist/ssr";
import { calculateCocokScore } from "@/src/domain/matching/cocok-engine";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";

export async function generateMetadata() {
  return { title: `Dashboard Talent | CocokIn` };
}

// Helper initial color for business avatar
const avatarColors = [
  "bg-[#EBF5FF] text-[#006FE6]",
  "bg-[#FFF4E5] text-[#FF8010]",
  "bg-[#ECFDF5] text-[#059669]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#FEE2E2] text-[#DC2626]",
];

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
      assessments: { orderBy: { createdAt: "desc" }, take: 1 },
      applications: {
        include: { project: { include: { businessProfile: true } } },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  // Determine Active Projects (where application is ACCEPTED and project is not COMPLETED)
  const activeApplications = talentProfile.applications.filter(
    (app) =>
      app.status === "ACCEPTED" &&
      !["COMPLETED", "CANCELLED", "PUBLISHED"].includes(app.project.status)
  );

  const pendingApplications = talentProfile.applications.filter(
    (app) => app.status === "PENDING"
  );

  // Fetch Recommended Matches (PUBLISHED projects that the talent hasn't applied to)
  const appliedProjectIds = talentProfile.applications.map((app) => app.projectId);
  const openProjects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      id: { notIn: appliedProjectIds },
    },
    include: { businessProfile: true, skills: { include: { skill: true } } },
    take: 9,
  });

  const recommendedProjects = openProjects
    .map((project) => {
      const match = calculateCocokScore(talentProfile, project);
      return { project, score: match.cocokScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Top 6 recommendations

  const verifiedSkillsCount = talentProfile.skills.filter(
    (s) => s.evidenceLevel !== "SELF_DECLARED"
  ).length;

  const latestAssessment = talentProfile.assessments[0];
  const firstName = talentProfile.user.name?.split(" ")[0] || "Talent";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
      {/* ── TOP GREETING & STATUS BAR (Braintrust Inspired) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#D8E1EE]">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#001040] tracking-tight">
            Hi, {firstName}!
          </h1>
          <p className="text-sm text-[#53647A] mt-1">
            Siap menyelesaikan proyek mikro baru atau melanjutkan bukti portofolio Anda?
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-[#D8E1EE] px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-sm">
            <Sparkle size={18} weight="fill" className="text-[#FF8010]" />
            <div className="text-left">
              <div className="text-[10px] font-bold text-[#53647A] uppercase tracking-wider">
                Kesiapan Karier
              </div>
              <div className="text-sm font-extrabold text-[#001040]">
                {latestAssessment ? `${latestAssessment.compositeScore}% Siap Kerja` : "Belum Asesmen"}
              </div>
            </div>
          </div>

          <Link
            href="/talent/profile"
            className="bg-[#001040] hover:bg-[#001040]/90 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm shrink-0"
          >
            Edit Profil
          </Link>
        </div>
      </div>

      {/* ── HERO BANNER & 3 ACTION CARDS (Braintrust Bento Hero) ── */}
      <div className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Welcome Message Card */}
          <div className="lg:col-span-1 flex flex-col justify-between pr-0 lg:pr-4 border-b lg:border-b-0 lg:border-r border-[#D8E1EE] pb-6 lg:pb-0">
            <div>
              <div className="text-xs font-extrabold text-[#006FE6] uppercase tracking-wider mb-2">
                Selamat Datang di
              </div>
              <div className="flex items-center gap-2 mb-3">
                <CocokInBrand className="w-8 h-8 object-contain" decorative priority variant="mark" />
                <span className="text-2xl font-black text-[#001040] tracking-tight">CocokIn</span>
              </div>
              <p className="text-sm text-[#53647A] leading-relaxed">
                Ubah keahlianmu menjadi portofolio nyata dan bantu transformasi digital UMKM secara langsung.
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-[#006FE6]">
              #UbahPotensiJadiBukti
            </div>
          </div>

          {/* 3 Quick Action Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Action 1: Explore Micro Projects */}
            <div className="bg-[#FFFDF5] border border-[#FDE68A] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase size={22} weight="duotone" />
                </div>
                <h3 className="font-bold text-[#001040] text-base mb-1">Cari Proyek Mikro</h3>
                <p className="text-xs text-[#53647A] leading-relaxed">
                  Temukan tawaran pekerjaan remote terverifikasi dari UMKM.
                </p>
              </div>
              <Link
                href="/talent/projects"
                className="mt-4 inline-flex items-center justify-center bg-[#001040] hover:bg-[#001040]/90 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors w-full"
              >
                Jelajahi Proyek
              </Link>
            </div>

            {/* Action 2: Career Readiness Assessment */}
            <div className="bg-[#F8FAFF] border border-[#BFDBFE] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] text-[#006FE6] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ClipboardText size={22} weight="duotone" />
                </div>
                <h3 className="font-bold text-[#001040] text-base mb-1">Ikuti Asesmen</h3>
                <p className="text-xs text-[#53647A] leading-relaxed">
                  Uji keahlian untuk mendongkrak nilai Cocok Score profilmu.
                </p>
              </div>
              <Link
                href="/talent/assessment"
                className="mt-4 inline-flex items-center justify-center bg-[#001040] hover:bg-[#001040]/90 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors w-full"
              >
                Mulai Asesmen
              </Link>
            </div>

            {/* Action 3: Skill Passport & Portfolio */}
            <div className="bg-[#F6FEF9] border border-[#A7F3D0] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#D1FAE5] text-[#059669] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <IdentificationBadge size={22} weight="duotone" />
                </div>
                <h3 className="font-bold text-[#001040] text-base mb-1">Paspor & Portofolio</h3>
                <p className="text-xs text-[#53647A] leading-relaxed">
                  Lihat bukti kerja tervalidasi dan keahlian terverifikasi.
                </p>
              </div>
              <Link
                href="/talent/passport"
                className="mt-4 inline-flex items-center justify-center bg-[#001040] hover:bg-[#001040]/90 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors w-full"
              >
                Lihat Paspor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── ACTIVE PROJECT BANNER (Priority Workspace) ── */}
      {activeApplications.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#001040] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
              Proyek Sedang Berjalan
            </h2>
            <Link
              href="/talent/workspace"
              className="text-[#006FE6] font-bold text-sm hover:underline flex items-center gap-1"
            >
              Lihat Workspace &rarr;
            </Link>
          </div>

          <div className="space-y-4">
            {activeApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white border-2 border-[#006FE6] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#EAF3FF] text-[#006FE6] text-xs font-extrabold px-3 py-1 rounded-full">
                      {app.project.status === "TALENT_SELECTED"
                        ? "Menunggu Pendanaan UMKM"
                        : "Sedang Dikerjakan"}
                    </span>
                    <span className="text-xs text-[#53647A] font-medium">
                      UMKM: <strong>{app.project.businessProfile.businessName}</strong>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#001040]">{app.project.title}</h3>
                  <p className="text-sm text-[#53647A] line-clamp-1 max-w-2xl">
                    {app.project.scope}
                  </p>
                </div>

                <Link
                  href={`/talent/projects/${app.project.id}/workspace`}
                  className="bg-[#001040] hover:bg-[#001040]/90 !text-white font-bold py-3 px-6 rounded-xl transition-colors inline-flex items-center justify-center gap-2 shrink-0 text-sm shadow-sm"
                >
                  Buka Workspace <ArrowRight weight="bold" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── RECOMMENDED MATCHES SECTION (Braintrust Style Cards) ── */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#001040] tracking-tight">
              Rekomendasi Proyek Terbaru
            </h2>
            <p className="text-xs text-[#53647A] mt-0.5">
              Dipilih secara deterministik berdasarkan Cocok Score profil Anda.
            </p>
          </div>
          <Link
            href="/talent/projects"
            className="text-[#006FE6] font-bold text-sm hover:underline shrink-0"
          >
            Lihat Semua Proyek &rarr;
          </Link>
        </div>

        {recommendedProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProjects.map(({ project, score }, index) => {
              const avatarColor = avatarColors[index % avatarColors.length];
              const businessInitial =
                project.businessProfile.businessName?.[0]?.toUpperCase() || "U";
              const formattedValue = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(Number(project.serviceValue));

              return (
                <div
                  key={project.id}
                  className="bg-white border border-[#D8E1EE] rounded-2xl p-6 hover:shadow-lg hover:border-[#006FE6]/60 transition-all flex flex-col justify-between group"
                >
                  {/* Card Top: Avatar, Role Tag, Share/Save */}
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg ${avatarColor} shadow-inner`}
                        >
                          {businessInitial}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#53647A]">
                            {project.businessProfile.businessName}
                          </div>
                          <span className="inline-block bg-[#FFF4E5] text-[#FF8010] text-[11px] font-extrabold px-2 py-0.5 rounded-md mt-0.5">
                            Remote Micro-Project
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[#9AABC2]">
                        <button
                          type="button"
                          className="p-1.5 hover:text-[#001040] hover:bg-[#F1F5FB] rounded-lg transition-colors"
                          title="Bagikan"
                        >
                          <ShareNetwork size={18} />
                        </button>
                        <button
                          type="button"
                          className="p-1.5 hover:text-[#001040] hover:bg-[#F1F5FB] rounded-lg transition-colors"
                          title="Simpan"
                        >
                          <BookmarkSimple size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Card Title & Value */}
                    <h3 className="font-bold text-lg text-[#001040] group-hover:text-[#006FE6] transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </h3>
                    <div className="text-xl font-extrabold text-[#001040] mb-4">
                      {formattedValue}
                    </div>

                    {/* Meta info: Duration & Remote */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#53647A] pb-4 mb-4 border-b border-[#D8E1EE]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={15} className="text-[#006FE6]" />
                        <span>{project.estimatedDays} Hari Kerja</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-[#059669]">
                        <CheckCircle size={15} weight="fill" />
                        <span>100% Remote</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Cocok Score Badge & CTA */}
                  <div>
                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.skills.slice(0, 3).map((ps, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-medium bg-[#F1F5FB] text-[#001040] px-2.5 py-1 rounded-md border border-[#D8E1EE]"
                        >
                          {ps.skill.name}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="text-[11px] font-medium bg-gray-100 text-[#53647A] px-2 py-1 rounded-md">
                          +{project.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="bg-[#EAF3FF] text-[#006FE6] font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0">
                        <Lightning weight="fill" /> Cocok {score}%
                      </div>

                      <Link
                        href={`/talent/projects/${project.id}`}
                        className="flex-1 bg-[#001040] hover:bg-[#001040]/90 !text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors text-center"
                      >
                        Detail & Lamar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-[#D8E1EE] rounded-2xl p-12 text-center text-[#53647A] space-y-3">
            <Briefcase size={40} className="mx-auto text-[#9AABC2]" weight="duotone" />
            <h3 className="font-bold text-lg text-[#001040]">Belum Ada Proyek Baru</h3>
            <p className="text-sm text-[#53647A] max-w-md mx-auto">
              Saat ini semua proyek yang tersedia sudah Anda lamar atau belum ada lowongan baru. Silakan cek kembali nanti!
            </p>
          </div>
        )}
      </section>

      {/* ── PROFILE & SKILLS SNAPSHOT (Secondary Section) ── */}
      <section className="bg-white border border-[#D8E1EE] rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8E1EE] mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#001040]">Ringkasan Profil & Portofolio</h3>
            <p className="text-xs text-[#53647A] mt-0.5">
              Lengkapi kualifikasi Anda untuk meningkatkan kredibilitas di mata UMKM.
            </p>
          </div>
          <Link
            href="/talent/passport"
            className="text-xs font-bold text-[#006FE6] hover:underline"
          >
            Buka Paspor Keahlian &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#F8FAFC] border border-[#D8E1EE] p-5 rounded-xl text-center">
            <div className="text-3xl font-black text-[#001040]">
              {talentProfile.skills.length}
            </div>
            <div className="text-xs font-bold text-[#53647A] uppercase tracking-wider mt-1">
              Total Keahlian
            </div>
          </div>

          <div className="bg-[#ECFDF5] border border-[#A7F3D0] p-5 rounded-xl text-center">
            <div className="text-3xl font-black text-[#059669]">
              {verifiedSkillsCount}
            </div>
            <div className="text-xs font-bold text-[#059669] uppercase tracking-wider mt-1">
              Keahlian Terverifikasi
            </div>
          </div>

          <div className="bg-[#FFFBEB] border border-[#FDE68A] p-5 rounded-xl text-center">
            <div className="text-3xl font-black text-[#D97706]">
              {pendingApplications.length}
            </div>
            <div className="text-xs font-bold text-[#D97706] uppercase tracking-wider mt-1">
              Lamaran Menunggu
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
