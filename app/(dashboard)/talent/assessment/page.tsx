import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { redirect } from "next/navigation";
import { AssessmentClientView } from "@/src/components/talent/assessment-client-view";
import { loadCareerAssessment } from "@/src/modules/assessment/catalog";
import { getAllCareerIds } from "@/src/modules/talent/career-taxonomy";
import type { CareerDomainId } from "@/src/modules/talent/types";

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
  const careerIds = getAllCareerIds();
  const catalogs = await Promise.all(careerIds.map(async (careerId) => [careerId, await loadCareerAssessment(careerId)] as const));
  const questionCatalog = Object.fromEntries(catalogs) as Record<CareerDomainId, Awaited<ReturnType<typeof loadCareerAssessment>>>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <AssessmentClientView
        careerTarget={talentProfile.careerTarget}
        latestAssessment={latestAssessment}
        questionCatalog={questionCatalog}
      />
    </div>
  );
}
