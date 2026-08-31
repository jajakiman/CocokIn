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
    <main className="min-h-[100dvh] bg-[#E9EEF0] px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-[#001040]/10">
        <div className="h-1.5 bg-[#006FE6]" />
        <div className="p-6 sm:p-10">
          <CocokInBrand className="mx-auto mb-5 h-10 w-10 object-contain" decorative priority variant="mark" />
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-black tracking-tight text-[#001040]">Selamat datang! Mari berkenalan</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#53647A]">Lengkapi profil wajib agar CocokIn dapat menghitung rekomendasi proyek dan membangun Skill Passport Anda.</p>
          </header>
          <TalentOnboardingWizard initialName={user.name ?? ""} />
        </div>
      </div>
    </main>
  );
}
