import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { TalentProfileForm } from "./talent-profile-form";
import { PageHeader } from "@/src/design-system/page-header";

export async function generateMetadata() {
  return { title: `Profil Talent | CocokIn` };
}

export default async function TalentProfilePage() {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { talentProfile: { include: { skills: { include: { skill: true } } } } }
  });

  if (!user) {
    redirect("/login");
  }

  const skills = user.talentProfile?.skills ?? [];

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <PageHeader
        eyebrow="Kelola Akun"
        title="Profil & Target Karier"
        description="Perbarui data diri, target karier, dan keahlian untuk mendapatkan rekomendasi proyek yang relevan."
      />
      
      <TalentProfileForm user={user} skills={skills.map((item) => ({
        id: item.id,
        name: item.skill.name,
        category: item.skill.category,
        evidenceLevel: item.evidenceLevel,
      }))} />
    </div>
  );
}
