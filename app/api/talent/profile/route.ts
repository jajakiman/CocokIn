import { NextResponse } from "next/server";
import { prisma } from "@/src/adapters/database/prisma";
import { createSession, getSession } from "@/src/lib/session";
import { hasTalentFeatureAccess } from "@/src/modules/talent/feature-access";
import { talentProfileSchema } from "@/src/modules/talent/profile";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "TALENT") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (!(await hasTalentFeatureAccess(session.id))) return NextResponse.json({ message: "Onboarding required" }, { status: 403 });

    const parsed = talentProfileSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
    }
    const { firstName, lastName, bio, university, major, careerTarget } = parsed.data;
    const name = `${firstName} ${lastName}`;

    const { updatedUser, profile } = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: session.id },
        data: { name },
        select: { id: true, email: true, name: true, role: true },
      });

      const profile = await tx.talentProfile.upsert({
        where: { userId: session.id },
        update: { bio, university, major, careerTarget },
        create: { userId: session.id, bio, university, major, careerTarget },
      });

      return { updatedUser, profile };
    });

    await createSession({
      id: updatedUser.id,
      email: updatedUser.email!,
      displayName: updatedUser.name ?? "Talent",
      role: updatedUser.role,
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Failed to save talent profile:", error);
    return NextResponse.json({ message: "Profil tidak dapat disimpan. Silakan coba lagi." }, { status: 500 });
  }
}
