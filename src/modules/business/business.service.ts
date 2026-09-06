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

export type ReadinessAnswers = Record<string, number>;

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

  const financeScore = answers.q1 ?? 0;
  const marketingScore = answers.q2 ?? 0;
  const teamScore = answers.q3 ?? 0;
  const operationsScore = answers.q4 ?? 0;
  const outsourcingScore = answers.q5 ?? 0;
  const readinessScore = Math.round((financeScore + marketingScore + teamScore + operationsScore + outsourcingScore) / 5);

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
