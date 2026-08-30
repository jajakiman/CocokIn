import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { StatusBadge } from "@/src/design-system/status-badge";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata() {
  return { title: `Skill Passport | CocokIn` };
}

const EVIDENCE_LABEL: Record<string, string> = {
  SELF_DECLARED: "Self-Declared",
  ASSESSED: "Assessed",
  PROJECT_APPLIED: "Project Applied",
  PROJECT_VERIFIED: "Verified",
};

const EVIDENCE_TONE: Record<string, "neutral" | "info" | "warning" | "success"> = {
  SELF_DECLARED: "neutral",
  ASSESSED: "info",
  PROJECT_APPLIED: "warning",
  PROJECT_VERIFIED: "success",
};

export default async function TalentPassportPage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: { skills: { include: { skill: true } } },
  });

  if (!talentProfile) {
    redirect("/talent/profile");
  }

  const { skills } = talentProfile;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageHeader
          eyebrow="Skill Passport"
          title={talentProfile.careerTarget || "Target Karier Belum Diatur"}
          description="Skill passport menampilkan tingkat validitas bukti keahlianmu. Tingkatkan level dengan mengikuti asesmen dan menyelesaikan proyek."
        />
        <button className="bg-[#001040] hover:bg-[#001040]/90 text-white px-4 py-2 rounded-lg font-bold inline-flex items-center gap-2 mt-4 md:mt-0">
          <Plus size={20} weight="bold" />
          Klaim Keahlian Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {skills.length === 0 ? (
            <div className="bg-white border border-[#D8E1EE] rounded-xl p-8 text-center text-[#53647A]">
              Anda belum menambahkan keahlian apapun. Silakan klaim keahlian baru.
            </div>
          ) : (
            skills.map((ts) => (
              <div key={ts.id} className="bg-white border border-[#D8E1EE] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#001040]">{ts.skill.name}</h3>
                    <p className="text-[#53647A] text-sm mt-1">Kategori: {ts.skill.category}</p>
                  </div>
                  <StatusBadge tone={EVIDENCE_TONE[ts.evidenceLevel] || "neutral"}>
                    {EVIDENCE_LABEL[ts.evidenceLevel] || ts.evidenceLevel}
                  </StatusBadge>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="bg-[#F8FAFC] border border-[#D8E1EE] rounded-xl p-6 sticky top-24">
            <h3 className="font-bold text-[#001040] mb-4 text-lg">Tingkat Evidence</h3>
            <dl className="space-y-4">
              <div>
                <dt className="mb-1"><StatusBadge tone="neutral">Self-Declared</StatusBadge></dt>
                <dd className="text-sm text-[#53647A]">Klaim awal dari talent</dd>
              </div>
              <div>
                <dt className="mb-1"><StatusBadge tone="info">Assessed</StatusBadge></dt>
                <dd className="text-sm text-[#53647A]">Teruji lewat kuis asesmen platform</dd>
              </div>
              <div>
                <dt className="mb-1"><StatusBadge tone="warning">Project Applied</StatusBadge></dt>
                <dd className="text-sm text-[#53647A]">Sedang diterapkan pada proyek aktif</dd>
              </div>
              <div>
                <dt className="mb-1"><StatusBadge tone="success">Verified</StatusBadge></dt>
                <dd className="text-sm text-[#53647A]">Tervalidasi oleh UMKM pemilik proyek</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
