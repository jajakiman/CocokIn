import { NextResponse } from "next/server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { talentOnboardingSchema } from "@/src/modules/talent/onboarding";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { emailVerified: true } });
  if (!user?.emailVerified) return NextResponse.json({ message: "Email belum diverifikasi." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = talentOnboardingSchema.safeParse(body);
  if (!parsed.success || typeof body?.firstName !== "string" || typeof body?.lastName !== "string" || !body.firstName.trim() || !body.lastName.trim()) {
    return NextResponse.json({ message: parsed.success ? "Nama depan dan nama belakang wajib diisi." : parsed.error.issues[0]?.message }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    const profile = await tx.talentProfile.upsert({
      where: { userId: session.id },
      update: {
        university: parsed.data.university,
        major: parsed.data.major,
        careerTarget: parsed.data.careerTarget,
        portfolioUrl: parsed.data.portfolioUrl || null,
        hasNoPortfolio: parsed.data.hasNoPortfolio,
        workModePreference: "REMOTE",
        onboardingCompletedAt: new Date(),
      },
      create: {
        userId: session.id,
        university: parsed.data.university,
        major: parsed.data.major,
        careerTarget: parsed.data.careerTarget,
        portfolioUrl: parsed.data.portfolioUrl || null,
        hasNoPortfolio: parsed.data.hasNoPortfolio,
        workModePreference: "REMOTE",
        onboardingCompletedAt: new Date(),
      },
    });
    await tx.user.update({ where: { id: session.id }, data: { name: `${body.firstName.trim()} ${body.lastName.trim()}` } });

    for (const skillName of parsed.data.skills) {
      const skill = await tx.skill.upsert({ where: { name: skillName }, update: {}, create: { name: skillName, category: "UNCATEGORIZED" } });
      await tx.talentSkill.upsert({
        where: { talentProfileId_skillId: { talentProfileId: profile.id, skillId: skill.id } },
        update: {},
        create: { talentProfileId: profile.id, skillId: skill.id, evidenceLevel: "SELF_DECLARED" },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
