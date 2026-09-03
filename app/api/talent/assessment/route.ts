import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { calculateCareerReadiness } from "@/src/modules/talent/career-readiness";
import { getAllCareerIds } from "@/src/modules/talent/career-taxonomy";
import type { CareerDomainId } from "@/src/modules/talent/types";

const submitAssessmentSchema = z.object({
  careerId: z.enum(getAllCareerIds() as [CareerDomainId, ...CareerDomainId[]]),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedScore: z.number().min(0).max(100),
    })
  ),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "TALENT") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitAssessmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Payload tidak valid." },
      { status: 400 }
    );
  }

  const { careerId, answers } = parsed.data;

  try {
    const profile = await prisma.talentProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profil Talent tidak ditemukan." },
        { status: 404 }
      );
    }

    const readiness = calculateCareerReadiness(careerId, answers);

    await prisma.$transaction(async (tx) => {
      // 1. Simpan hasil penilaian kesiapan kerja
      await tx.talentAssessmentResult.create({
        data: {
          talentProfileId: profile.id,
          technicalScore: readiness.technicalScore,
          softSkillScore: readiness.softSkillScore,
          compositeScore: readiness.compositeScore,
        },
      });

      // 2. Promosikan skill yang diuji ke level ASSESSED jika ada pada TalentSkill
      const allTestedSkills = [
        ...readiness.technicalBreakdown,
        ...readiness.softSkillBreakdown,
      ];

      for (const skillScore of allTestedSkills) {
        if (skillScore.talentScore >= 50) {
          const matchedSkill = await tx.skill.findFirst({
            where: { name: { equals: skillScore.name, mode: "insensitive" } },
          });

          if (matchedSkill) {
            await tx.talentSkill.updateMany({
              where: {
                talentProfileId: profile.id,
                skillId: matchedSkill.id,
                evidenceLevel: "SELF_DECLARED",
              },
              data: {
                evidenceLevel: "ASSESSED",
              },
            });
          }
        }
      }
    });

    return NextResponse.json({ ok: true, result: readiness });
  } catch (error) {
    console.error("[SUBMIT ASSESSMENT ERROR]:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan hasil penilaian kesiapan." },
      { status: 500 }
    );
  }
}
