import { redirect } from "next/navigation";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { TalentOnboardingWizard } from "@/src/components/talent/talent-onboarding-wizard";
import { isTalentOnboardingComplete } from "@/src/modules/talent/onboarding";
import { AppShell } from "@/src/design-system/app-shell";

export default async function TalentOnboardingPage() {
  const session = await getSession();
  if (!session || session.role !== "TALENT") redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    include: { talentProfile: { include: { _count: { select: { skills: true } } } } },
  });
  if (!user?.emailVerified) redirect("/verify-email");
  const profile = user.talentProfile;
  if (profile && isTalentOnboardingComplete({
    university: profile.university,
    major: profile.major,
    careerTarget: profile.careerTarget,
    portfolioUrl: profile.portfolioUrl,
    hasNoPortfolio: profile.hasNoPortfolio,
    skillCount: profile._count.skills,
    onboardingCompletedAt: profile.onboardingCompletedAt,
  })) redirect("/talent");

  return (
    <div className="relative min-h-[100dvh] bg-[#F7F9FC] font-sans">
      {/* Background Dashboard Mockup/Placeholder for authentic backdrop preview */}
      <div aria-hidden="true" className="pointer-events-none select-none filter blur-[3px] opacity-40">
        <AppShell role="talent" user={{ id: user.id, email: user.email || "", displayName: user.name || "Talent Member", role: "TALENT" }}>
          <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
            <div className="h-10 w-48 bg-[#001040]/10 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
              <div className="h-28 bg-white border border-[#D8E1EE] rounded-2xl p-4 shadow-sm" />
            </div>
            <div className="h-64 bg-white border border-[#D8E1EE] rounded-2xl p-6 shadow-sm" />
          </div>
        </AppShell>
      </div>

      {/* Backdrop Dimmer & Pop-up Window Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001040]/50 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
        <TalentOnboardingWizard initialName={user.name ?? ""} />
      </div>
    </div>
  );
}
