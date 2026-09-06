import { prisma } from "@/src/adapters/database/prisma";
import { BUSINESS_ASSESSMENT_QUESTIONS } from "@/src/modules/business/assessment-bank";
import { ASSESSMENT_QUESTIONS } from "@/src/modules/talent/assessment-bank";
import type { AssessmentQuestion, CareerDomainId } from "@/src/modules/talent/types";
import type { CareerDomain } from "@/src/modules/talent/types";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

type QuestionRow = {
  id: string;
  audience: "TALENT" | "BUSINESS";
  kind: "TECHNICAL" | "SOFT_SKILL" | "BUSINESS_READINESS";
  careerKey: string | null;
  skillKey: string | null;
  pillar: string | null;
  text: string;
  position: number;
  isActive: boolean;
  options: Array<{ id: string; label: string; score: number; position: number }>;
};

export type CatalogQuestion = AssessmentQuestion & {
  pillar?: string;
  options: Array<{ id: string; label: string; score: number }>;
};

export function mapQuestionRecords(rows: QuestionRow[]): CatalogQuestion[] {
  return rows.map((row) => ({
    id: row.id,
    careerId: (row.careerKey ?? "fullstack-dev") as CareerDomainId,
    type: row.kind === "SOFT_SKILL" ? "SOFT_SKILL" : "TECHNICAL",
    skillId: row.skillKey ?? undefined,
    pillar: row.pillar ?? undefined,
    text: row.text,
    options: [...row.options]
      .sort((a, b) => a.position - b.position)
      .map(({ id, label, score }) => ({ id, label, score })),
  }));
}

async function loadRows(audience: "TALENT" | "BUSINESS", careerKey?: string) {
  return prisma.assessmentQuestionRecord.findMany({
    where: { audience, careerKey: careerKey ?? null, isActive: true },
    include: { options: true },
    orderBy: { position: "asc" },
  });
}

export async function loadCareerAssessment(careerKey: CareerDomainId): Promise<CatalogQuestion[]> {
  try {
    const rows = await loadRows("TALENT", careerKey);
    if (rows.length > 0) return mapQuestionRecords(rows);
  } catch {
    // Rollout fallback while migrations/seeding catch up.
  }
  return ASSESSMENT_QUESTIONS.filter((question) => question.careerId === careerKey).map((question) => ({
    ...question,
    options: question.options.map((option, index) => ({ ...option, id: `${question.id}-${index}` })),
  }));
}

export async function loadBusinessAssessment(): Promise<CatalogQuestion[]> {
  try {
    const rows = await loadRows("BUSINESS");
    if (rows.length > 0) return mapQuestionRecords(rows).slice(0, 5);
  } catch {
    // Rollout fallback while migrations/seeding catch up.
  }
  return BUSINESS_ASSESSMENT_QUESTIONS.map((question) => ({
    id: `business-${question.id}`,
    careerId: "fullstack-dev",
    type: "TECHNICAL",
    pillar: question.pillar,
    text: question.text,
    options: question.options.map((label, optionIndex) => ({ id: `business-${question.id}-${optionIndex}`, label, score: [0, 50, 100][optionIndex] })),
  }));
}

export async function loadCareerDomains(): Promise<Record<CareerDomainId, CareerDomain>> {
  try {
    const rows = await prisma.career.findMany({
      where: { key: { not: null }, isActive: true },
      include: { requirements: { include: { skill: true } } },
    });
    if (rows.length > 0) {
      const entries = rows.map((career) => {
        const fallback = CAREER_TAXONOMY[career.key as CareerDomainId];
        const benchmarks = career.requirements.filter((item) => item.skill.key).map((item) => ({ skillId: item.skill.key!, name: item.skill.name, benchmarkScore: item.benchmarkScore }));
        const softIds = new Set(fallback?.softSkills.map((skill) => skill.skillId) ?? []);
        return [career.key, { id: career.key, label: career.name, technicalSkills: benchmarks.filter((item) => !softIds.has(item.skillId)), softSkills: benchmarks.filter((item) => softIds.has(item.skillId)) }] as const;
      });
      return { ...CAREER_TAXONOMY, ...Object.fromEntries(entries) };
    }
  } catch {
    // Rollout fallback while migrations/seeding catch up.
  }
  return CAREER_TAXONOMY;
}

export function resolveSubmittedAnswers(questions: CatalogQuestion[], answers: Array<{ questionId: string; optionId: string }>) {
  if (answers.length !== questions.length || new Set(answers.map((answer) => answer.questionId)).size !== questions.length) {
    throw new Error("Semua pertanyaan asesmen wajib dijawab tepat satu kali.");
  }
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const resolved = answers.map((answer) => {
    const option = questionMap.get(answer.questionId)?.options.find((candidate) => candidate.id === answer.optionId);
    if (!option) throw new Error("Jawaban asesmen tidak valid.");
    return { questionId: answer.questionId, selectedScore: option.score };
  });
  if (resolved.some((answer) => !questionMap.has(answer.questionId))) throw new Error("Jawaban asesmen tidak valid.");
  return resolved;
}
