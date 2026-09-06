import { NextResponse } from "next/server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession, createSession } from "@/src/lib/session";
import { talentOnboardingSchema } from "@/src/modules/talent/onboarding";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.id }, select: { emailVerified: true, role: true, email: true } });
  if (!user?.emailVerified) return NextResponse.json({ message: "Email belum diverifikasi." }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = talentOnboardingSchema.safeParse(body);
  if (!parsed.success || typeof body?.firstName !== "string" || typeof body?.lastName !== "string" || !body.firstName.trim() || !body.lastName.trim()) {
    return NextResponse.json({ message: parsed.success ? "Nama depan dan nama belakang wajib diisi." : parsed.error.issues[0]?.message }, { status: 400 });
  }

  const fullName = `${body.firstName.trim()} ${body.lastName.trim()}`;

  try {
    // Perform atomic profile save and user name update
    await prisma.$transaction(async (tx) => {
      await tx.talentProfile.upsert({
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

      await tx.user.update({
        where: { id: session.id },
        data: { name: fullName },
      });
    });

    // Re-issue fresh session with updated display name
    await createSession({
      id: session.id,
      email: user.email!,
      displayName: fullName,
      role: user.role,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ONBOARDING ERROR]", error);
    const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan profil onboarding. Silakan coba lagi.";
    return NextResponse.json({ message: `Gagal menyimpan profil onboarding: ${errorMessage}` }, { status: 500 });
  }
}
