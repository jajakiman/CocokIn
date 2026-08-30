import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ApplicantComparisonView } from "@/src/components/projects/applicant-comparison-view";

export async function generateMetadata({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Daftar Pelamar | CocokIn`,
  };
}

export default async function ApplicantsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    redirect("/login");
  }

  const resolvedParams = await params;

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.id },
  });

  if (!profile) redirect("/business/profile");

  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.projectId },
    include: {
      applications: {
        include: {
          talentProfile: { include: { user: true, skills: { include: { skill: true } } } },
          matchSnapshot: true,
        },
      }
    }
  });

  if (!project || project.businessProfileId !== profile.id) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        Proyek tidak ditemukan atau Anda tidak memiliki akses.
      </div>
    );
  }

  // Sort applications by Cocok Score descending
  const applications = [...project.applications].sort((a, b) => {
    const scoreA = a.matchSnapshot?.cocokScore || 0;
    const scoreB = b.matchSnapshot?.cocokScore || 0;
    return scoreB - scoreA;
  });

  const isSelected = project.status !== "PUBLISHED" && project.status !== "DRAFT";

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div>
        <Link href={`/business/projects/${project.id}`} className="inline-flex items-center gap-2 text-[#53647A] hover:text-[#001040] transition-colors font-medium mb-4">
          <ArrowLeft weight="bold" /> Kembali ke Detail Proyek
        </Link>
        <h1 className="text-3xl font-bold text-[#001040]">Review Pelamar Talent</h1>
        <p className="text-[#53647A] mt-1">
          Pilih Talent terbaik berdasarkan kecocokan keahlian dengan kebutuhan proyek Anda.
        </p>
      </div>

      {isSelected && (
        <div className="bg-[#ECFDF5] border border-[#059669] p-4 rounded-xl flex items-center gap-4">
          <CheckCircle size={32} className="text-[#059669]" weight="fill" />
          <div>
            <h3 className="font-bold text-[#001040]">Talent Sudah Dipilih</h3>
            <p className="text-sm text-[#059669]">Proyek ini sudah ditugaskan ke seorang Talent. Menunggu proses funding/pembayaran.</p>
          </div>
        </div>
      )}

      <ApplicantComparisonView applications={applications} isSelected={isSelected} />
    </div>
  );
}
