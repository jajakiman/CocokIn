import { prisma } from "@/src/adapters/database/prisma";
import { isTalentOnboardingComplete } from "./onboarding";

export async function hasTalentFeatureAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { talentProfile: { include: { _count: { select: { skills: true } } } } },
  });
  const profile = user?.talentProfile;
  return Boolean(user?.emailVerified && profile && isTalentOnboardingComplete({
    university: profile.university,
    major: profile.major,
    careerTarget: profile.careerTarget,
    portfolioUrl: profile.portfolioUrl,
    hasNoPortfolio: profile.hasNoPortfolio,
    skillCount: profile._count.skills,
    onboardingCompletedAt: profile.onboardingCompletedAt,
  }));
}
