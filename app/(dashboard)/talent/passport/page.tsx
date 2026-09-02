import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { PageHeader } from "@/src/design-system/page-header";
import { StatusBadge } from "@/src/design-system/status-badge";
import { TalentSkillManager } from "@/src/components/talent/talent-skill-manager";

export async function generateMetadata() {
  return { title: `Skill Passport | CocokIn` };
}

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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <TalentSkillManager skills={skills.map((item) => ({
            id: item.id,
            name: item.skill.name,
            category: item.skill.category,
            evidenceLevel: item.evidenceLevel,
          }))} />
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
