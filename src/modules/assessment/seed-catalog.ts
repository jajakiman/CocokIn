import type { PrismaClient } from "@prisma/client";

import { BUSINESS_ASSESSMENT_QUESTIONS } from "@/src/modules/business/assessment-bank";
import { ASSESSMENT_QUESTIONS } from "@/src/modules/talent/assessment-bank";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

const BUSINESS_SCORES = [0, 50, 100] as const;

export async function seedAssessmentCatalog(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    for (const career of Object.values(CAREER_TAXONOMY)) {
      const careerRow = await tx.career.upsert({
        where: { key: career.id },
        update: {},
        create: { key: career.id, name: career.label, isActive: true },
      });

      for (const benchmark of [...career.technicalSkills, ...career.softSkills]) {
        const skill = await tx.skill.upsert({
          where: { name: benchmark.name },
          update: {},
          create: { key: benchmark.skillId, name: benchmark.name, category: "ASSESSMENT", isActive: true },
        });
        await tx.careerSkillRequirement.upsert({
          where: { careerId_skillId: { careerId: careerRow.id, skillId: skill.id } },
          update: {},
          create: { careerId: careerRow.id, skillId: skill.id, benchmarkScore: benchmark.benchmarkScore },
        });
      }
    }

    for (const [position, question] of ASSESSMENT_QUESTIONS.entries()) {
      await tx.assessmentQuestionRecord.upsert({
        where: { id: question.id },
        update: {},
        create: { id: question.id, audience: "TALENT", kind: question.type, careerKey: question.careerId, skillKey: question.skillId, text: question.text, position, isActive: true },
      });
      const optionCount = await tx.assessmentOptionRecord.count({ where: { questionId: question.id } });
      if (optionCount === 0) await tx.assessmentOptionRecord.createMany({ data: question.options.map((option, optionPosition) => ({ id: `${question.id}-${optionPosition}`, questionId: question.id, label: option.label, score: option.score, position: optionPosition })) });
    }

    for (const [position, question] of BUSINESS_ASSESSMENT_QUESTIONS.entries()) {
      await tx.assessmentQuestionRecord.upsert({
        where: { id: `business-${question.id}` },
        update: {},
        create: { id: `business-${question.id}`, audience: "BUSINESS", kind: "BUSINESS_READINESS", pillar: question.pillar, text: question.text, position, isActive: true },
      });
      const optionCount = await tx.assessmentOptionRecord.count({ where: { questionId: `business-${question.id}` } });
      if (optionCount === 0) await tx.assessmentOptionRecord.createMany({ data: question.options.map((label, optionPosition) => ({ id: `business-${question.id}-${optionPosition}`, questionId: `business-${question.id}`, label, score: BUSINESS_SCORES[optionPosition], position: optionPosition })) });
    }
  }, { maxWait: 10_000, timeout: 60_000 });
}
