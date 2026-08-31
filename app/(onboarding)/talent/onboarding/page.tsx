import { redirect } from "next/navigation";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { TalentOnboardingWizard } from "@/src/components/talent/talent-onboarding-wizard";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";
import { isTalentOnboardingComplete } from "@/src/modules/talent/onboarding";

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
    <main className="min-h-[100dvh] bg-[#F7F9FC] flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#D8E1EE] bg-white shadow-xl shadow-[#001040]/5">
        <div className="h-1.5 bg-[#006FE6]" />
        <div className="p-6 sm:p-10">
          <CocokInBrand className="mx-auto mb-4 h-10 w-10 object-contain" decorative priority variant="mark" />
          <header className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#001040]">Selamat datang! Mari berkenalan</h1>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm leading-relaxed text-[#53647A]">Lengkapi data profil wajib agar CocokIn dapat merekomendasikan proyek mikro dan membangun Skill Passport Anda.</p>
          </header>
          <TalentOnboardingWizard initialName={user.name ?? ""} />
        </div>
      </div>
    </main>
  );
}
