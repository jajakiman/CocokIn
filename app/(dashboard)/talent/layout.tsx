import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { isTalentOnboardingComplete } from "@/src/modules/talent/onboarding";

export default async function TalentFeatureGate({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") redirect("/login");

  const profile = await prisma.talentProfile.findUnique({
    where: { userId: session.id },
    include: { _count: { select: { skills: true } } },
  });
  if (!profile || !isTalentOnboardingComplete({
    university: profile.university,
    major: profile.major,
    careerTarget: profile.careerTarget,
    portfolioUrl: profile.portfolioUrl,
    hasNoPortfolio: profile.hasNoPortfolio,
    skillCount: profile._count.skills,
    onboardingCompletedAt: profile.onboardingCompletedAt,
  })) redirect("/talent/onboarding");

  return children;
}
