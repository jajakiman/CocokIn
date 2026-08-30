import { prisma } from "@/src/adapters/database/prisma";
import { revalidatePath } from "next/cache";

export type UpdateBusinessProfileData = {
  businessName: string;
  industryCategory?: string | null;
  location?: string | null;
  description?: string | null;
};

/**
 * Updates an existing business profile.
 * Refactored to comply with Rafi's domain isolation rules.
 */
export async function updateBusinessProfile(
  userId: string,
  data: UpdateBusinessProfileData
) {
  // Check if profile exists
  const profile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  const updatedProfile = await prisma.businessProfile.update({
    where: { userId },
    data: {
      businessName: data.businessName,
      industryCategory: data.industryCategory,
      location: data.location,
      description: data.description,
    },
  });

  // Revalidate relevant cache paths
  revalidatePath("/business/my-profile");
  
  return updatedProfile;
}

export type ReadinessAnswers = Record<string, string>;

/**
 * Submits the digital readiness assessment (5-pillars).
 */
export async function submitReadinessAssessment(userId: string, answers: ReadinessAnswers) {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Business profile not found. Complete profile first.");
  }

  // Calculate pillar scores based on the specific questions
  // q1: Keuangan -> financeScore
  // q2: Target pasar -> marketingScore
  // q3: Kesiapan tim -> teamScore
  // q4: SOP -> operationsScore
  // q5: Pengalaman freelancer -> outsourcingScore

  const calculateScore = (ans?: string) => {
    if (!ans) return 0;
    if (ans.includes("Sudah") || ans.includes("Sangat Siap") || ans.includes("Lengkap") || ans.includes("Puas")) return 20;
    if (ans.includes("Proses") || ans.includes("Sebagian") || ans.includes("Cukup Siap") || ans.includes("kurang puas") || ans.includes("Ada namun")) return 10;
    return 0;
  };

  const financeScore = calculateScore(answers["q1"]);
  const marketingScore = calculateScore(answers["q2"]);
  const teamScore = calculateScore(answers["q3"]);
  const operationsScore = calculateScore(answers["q4"]);
  const outsourcingScore = calculateScore(answers["q5"]);
  const readinessScore = financeScore + marketingScore + teamScore + operationsScore + outsourcingScore;

  // Delete old assessments to keep it simple (only latest matters)
  await prisma.businessAssessmentResult.deleteMany({
    where: { businessProfileId: profile.id }
  });

  const assessmentResult = await prisma.businessAssessmentResult.create({
    data: {
      businessProfileId: profile.id,
      readinessScore,
      financeScore,
      marketingScore,
      teamScore,
      operationsScore,
      outsourcingScore
    }
  });

  return assessmentResult;
}
