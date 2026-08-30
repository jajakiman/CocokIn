import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { ClipboardText, Info } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Asesmen Talent | CocokIn` };
}

export default async function TalentAssessmentPage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: { assessments: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  const latestAssessment = talentProfile.assessments[0];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader
          eyebrow="Validasi Kemampuan"
          title="Asesmen Kualifikasi"
          description="Uji kemampuan teknis dan soft-skill untuk mendapatkan skor yang lebih tinggi di Cocok Engine."
        />
        {!latestAssessment && (
          <button className="bg-[#FF8010] hover:bg-[#FF8010]/90 text-white px-6 py-2 rounded-lg font-bold inline-flex items-center gap-2 mt-4 md:mt-0">
            Mulai Asesmen Sekarang
          </button>
        )}
      </div>

      {!latestAssessment ? (
        <div className="bg-[#FFFBEB] border border-[#FDE68A] p-6 rounded-xl flex items-start gap-4">
          <Info size={28} className="text-[#D97706] shrink-0" weight="fill" />
          <div>
            <h3 className="font-bold text-[#92400E]">Asesmen Wajib Belum Selesai</h3>
            <p className="text-sm text-[#92400E] mt-1">
              Untuk meningkatkan peluang diterima oleh UMKM, silakan selesaikan Asesmen Tahap 1. Asesmen ini terdiri dari 20 soal teknis dan studi kasus dasar.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#D8E1EE] rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#D8E1EE]">
            <ClipboardText size={32} className="text-[#006FE6]" weight="duotone" />
            <div>
              <h2 className="text-xl font-bold text-[#001040]">Hasil Asesmen Terakhir</h2>
              <p className="text-sm text-[#53647A]">
                Diambil pada: {new Date(latestAssessment.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
              <h3 className="text-sm font-bold text-[#53647A] mb-2">Technical Score</h3>
              <p className="text-4xl font-bold text-[#001040]">{latestAssessment.technicalScore}</p>
            </div>
            <div className="p-6 bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl text-center">
              <h3 className="text-sm font-bold text-[#53647A] mb-2">Soft Skill Score</h3>
              <p className="text-4xl font-bold text-[#001040]">{latestAssessment.softSkillScore}</p>
            </div>
            <div className="p-6 bg-[#EAF3FF] border border-[#006FE6] rounded-xl text-center">
              <h3 className="text-sm font-bold text-[#006FE6] mb-2">Composite Score</h3>
              <p className="text-4xl font-bold text-[#001040]">{latestAssessment.compositeScore}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#D8E1EE] text-center">
            <button className="text-[#006FE6] font-bold text-sm hover:underline">
              Ambil Ulang Asesmen (Retake) &rarr;
            </button>
            <p className="text-xs text-[#53647A] mt-2">
              Retake dapat dilakukan 1x setiap 30 hari.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
