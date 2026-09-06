"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export type TaxonomyActionState = { ok: boolean; message: string };

const key = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Key hanya boleh berisi huruf kecil, angka, dan tanda hubung.").max(60);
const skillSchema = z.object({ key, name: z.string().trim().min(2).max(80), category: z.string().trim().min(2).max(40) });
const benchmarkSchema = z.object({ careerId: z.string().min(1), skillId: z.string().min(1), benchmarkScore: z.coerce.number().int().min(0).max(100) });
const optionSchema = z.object({ label: z.string().trim().min(1).max(300), score: z.coerce.number().int().min(0).max(100) });
const questionSchema = z.object({
  id: z.string().trim().min(1).max(80),
  audience: z.enum(["TALENT", "BUSINESS"]),
  kind: z.enum(["TECHNICAL", "SOFT_SKILL", "BUSINESS_READINESS"]),
  careerKey: z.string().trim().optional(), skillKey: z.string().trim().optional(), pillar: z.string().trim().max(80).optional(),
  text: z.string().trim().min(10).max(1000), position: z.coerce.number().int().min(0).max(1000),
  options: z.array(optionSchema).min(2, "Setiap pertanyaan wajib memiliki minimal 2 opsi.").max(4, "Setiap pertanyaan maksimal memiliki 4 opsi."),
}).superRefine((value, context) => {
  if (value.options.filter((option) => option.score === 100).length !== 1) context.addIssue({ code: "custom", message: "Setiap pertanyaan wajib memiliki tepat satu opsi dengan skor 100." });
  if (value.audience === "TALENT" && (!value.careerKey || !value.skillKey)) context.addIssue({ code: "custom", message: "Pertanyaan Talent wajib memiliki karier dan skill." });
  if (value.audience === "BUSINESS" && !value.pillar) context.addIssue({ code: "custom", message: "Pertanyaan UMKM wajib memiliki pilar." });
});

async function adminSession() { const session = await getSession(); return session?.role === "ADMIN" ? session : null; }
function fail(error: z.ZodError): TaxonomyActionState { return { ok: false, message: error.issues[0]?.message ?? "Data tidak valid." }; }

export async function createSkillAction(_previous: TaxonomyActionState | null, formData: FormData): Promise<TaxonomyActionState> {
  const admin = await adminSession(); if (!admin) return { ok: false, message: "Hanya Admin yang dapat mengelola skill." };
  const parsed = skillSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return fail(parsed.error);
  try {
    const skill = await prisma.skill.create({ data: { ...parsed.data, isActive: true } });
    await prisma.auditEvent.create({ data: { action: "SKILL_CREATED", actorId: admin.id, payload: { skillId: skill.id, key: parsed.data.key } } });
    revalidatePath("/admin"); return { ok: true, message: "Skill berhasil ditambahkan." };
  } catch { return { ok: false, message: "Key atau nama skill sudah digunakan." }; }
}

export async function updateCareerBenchmarkAction(_previous: TaxonomyActionState | null, formData: FormData): Promise<TaxonomyActionState> {
  const admin = await adminSession(); if (!admin) return { ok: false, message: "Hanya Admin yang dapat mengubah benchmark." };
  const parsed = benchmarkSchema.safeParse(Object.fromEntries(formData)); if (!parsed.success) return fail(parsed.error);
  await prisma.careerSkillRequirement.upsert({ where: { careerId_skillId: { careerId: parsed.data.careerId, skillId: parsed.data.skillId } }, update: { benchmarkScore: parsed.data.benchmarkScore }, create: parsed.data });
  await prisma.auditEvent.create({ data: { action: "CAREER_BENCHMARK_UPDATED", actorId: admin.id, payload: parsed.data } });
  revalidatePath("/admin"); return { ok: true, message: "Benchmark berhasil diperbarui." };
}

export async function saveAssessmentQuestionAction(_previous: TaxonomyActionState | null, formData: FormData): Promise<TaxonomyActionState> {
  const admin = await adminSession(); if (!admin) return { ok: false, message: "Hanya Admin yang dapat mengelola soal." };
  let options: unknown; try { options = JSON.parse(String(formData.get("optionsJson") ?? "[]")); } catch { return { ok: false, message: "Format opsi tidak valid." }; }
  const parsed = questionSchema.safeParse({ ...Object.fromEntries(formData), options }); if (!parsed.success) return fail(parsed.error);
  const { options: validOptions, ...question } = parsed.data;
  await prisma.$transaction(async (tx) => {
    await tx.assessmentQuestionRecord.upsert({ where: { id: question.id }, update: { ...question, careerKey: question.careerKey || null, skillKey: question.skillKey || null, pillar: question.pillar || null }, create: { ...question, careerKey: question.careerKey || null, skillKey: question.skillKey || null, pillar: question.pillar || null } });
    await tx.assessmentOptionRecord.deleteMany({ where: { questionId: question.id } });
    await tx.assessmentOptionRecord.createMany({ data: validOptions.map((option, position) => ({ id: `${question.id}-${position}`, questionId: question.id, position, ...option })) });
    await tx.auditEvent.create({ data: { action: "ASSESSMENT_QUESTION_SAVED", actorId: admin.id, payload: { questionId: question.id } } });
  });
  revalidatePath("/admin"); return { ok: true, message: "Pertanyaan berhasil disimpan." };
}

export async function toggleAssessmentQuestionAction(_previous: TaxonomyActionState | null, formData: FormData): Promise<TaxonomyActionState> {
  const admin = await adminSession(); if (!admin) return { ok: false, message: "Hanya Admin yang dapat mengubah status soal." };
  const parsed = z.object({ id: z.string().min(1), isActive: z.enum(["true", "false"]).transform((value) => value === "true") }).safeParse(Object.fromEntries(formData)); if (!parsed.success) return fail(parsed.error);
  await prisma.assessmentQuestionRecord.update({ where: { id: parsed.data.id }, data: { isActive: parsed.data.isActive } });
  await prisma.auditEvent.create({ data: { action: "ASSESSMENT_QUESTION_STATUS_CHANGED", actorId: admin.id, payload: parsed.data } });
  revalidatePath("/admin"); return { ok: true, message: "Status pertanyaan diperbarui." };
}
