import { NextResponse } from "next/server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { claimSkillSchema, removeSkillSchema } from "@/src/modules/talent/profile";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = claimSkillSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const profile = await prisma.talentProfile.findUnique({ where: { userId: session.id } });
    if (!profile) return NextResponse.json({ message: "Profil Talent tidak ditemukan." }, { status: 404 });

    const talentSkill = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${parsed.data.skillName.toLowerCase()}))`;
      const existing = await tx.skill.findFirst({
        where: { name: { equals: parsed.data.skillName, mode: "insensitive" } },
      });
      const skill = existing ?? await tx.skill.create({
        data: { name: parsed.data.skillName, category: "UNCATEGORIZED" },
      });

      return tx.talentSkill.upsert({
        where: { talentProfileId_skillId: { talentProfileId: profile.id, skillId: skill.id } },
        update: {},
        create: { talentProfileId: profile.id, skillId: skill.id, evidenceLevel: "SELF_DECLARED" },
        include: { skill: true },
      });
    });

    return NextResponse.json({
      ok: true,
      skill: {
        id: talentSkill.id,
        name: talentSkill.skill.name,
        category: talentSkill.skill.category,
        evidenceLevel: talentSkill.evidenceLevel,
      },
    });
  } catch (error) {
    console.error("[TALENT SKILL CLAIM ERROR]", error);
    return NextResponse.json({ message: "Keahlian tidak dapat disimpan. Silakan coba lagi." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const parsed = removeSkillSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Keahlian tidak valid." }, { status: 400 });

  try {
    const removed = await prisma.talentSkill.deleteMany({
      where: {
        id: parsed.data.talentSkillId,
        evidenceLevel: "SELF_DECLARED",
        talentProfile: { userId: session.id },
      },
    });

    if (removed.count !== 1) {
      return NextResponse.json({ message: "Keahlian tidak ditemukan atau sudah memiliki bukti." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[TALENT SKILL REMOVE ERROR]", error);
    return NextResponse.json({ message: "Keahlian tidak dapat dihapus. Silakan coba lagi." }, { status: 500 });
  }
}
