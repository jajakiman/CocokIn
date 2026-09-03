import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { AssessmentClientView } from "@/src/components/talent/assessment-client-view";

export async function generateMetadata() {
  return { title: `Cek Kesiapan | CocokIn` };
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

  const latestAssessment = talentProfile.assessments[0]
    ? {
        id: talentProfile.assessments[0].id,
        technicalScore: talentProfile.assessments[0].technicalScore,
        softSkillScore: talentProfile.assessments[0].softSkillScore,
        compositeScore: talentProfile.assessments[0].compositeScore,
        createdAt: talentProfile.assessments[0].createdAt.toISOString(),
      }
    : null;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <AssessmentClientView
        careerTarget={talentProfile.careerTarget}
        latestAssessment={latestAssessment}
      />
    </div>
  );
}
