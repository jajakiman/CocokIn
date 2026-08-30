"use server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { createProjectSchema, type CreateProjectInput } from "@/src/domain/projects/schemas";
import { revalidatePath } from "next/cache";

import { createProject, applyToProject, acceptApplicant } from "@/src/modules/marketplace/marketplace.service";

export type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
  projectId?: string;
};

export async function createProjectAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  
  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya UMKM terautentikasi yang dapat membuat proyek." };
  }

  // Parse milestones from hidden JSON field or multiple inputs
  const milestonesRaw = formData.get("milestones");
  const skillsRaw = formData.get("skills");

  let milestones = [];
  let skills = [];
  try {
    milestones = milestonesRaw ? JSON.parse(String(milestonesRaw)) : [];
    skills = skillsRaw ? JSON.parse(String(skillsRaw)) : [];
  } catch (e) {
    return { ok: false, message: "Data milestone atau skill tidak valid." };
  }

  const payload = {
    title: String(formData.get("title")),
    scope: String(formData.get("scope")),
    difficulty: String(formData.get("difficulty")),
    infrastructureNeed: String(formData.get("infrastructureNeed")),
    estimatedDays: Number(formData.get("estimatedDays")),
    deadline: new Date(String(formData.get("deadline"))),
    serviceValue: Number(formData.get("serviceValue")),
    skills,
    milestones,
  };

  const validated = createProjectSchema.safeParse(payload);

  if (!validated.success) {
    return {
      ok: false,
      message: "Terdapat kesalahan pada isian formulir.",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const project = await createProject(session.id, validated.data);

    revalidatePath("/business");
    revalidatePath("/talent/marketplace");

    return { ok: true, message: "Proyek berhasil dipublikasikan!", projectId: project.id };
  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Terjadi kesalahan internal saat menyimpan proyek." };
  }
}

export async function applyToProjectAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  
  if (!session || session.role !== "TALENT") {
    return { ok: false, message: "Hanya Talent terautentikasi yang dapat melamar proyek." };
  }

  const projectId = String(formData.get("projectId"));
  const motivation = String(formData.get("motivation") || "");

  try {
    await applyToProject(session.id, projectId, motivation);

    revalidatePath("/talent/marketplace");
    revalidatePath(`/talent/marketplace/${projectId}`);

    return { ok: true, message: "Lamaran berhasil dikirim!" };
  } catch (error: unknown) {
    console.error(error);
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { ok: false, message: "Anda sudah melamar proyek ini." };
    }
    return { ok: false, message: error instanceof Error && error.message || "Terjadi kesalahan internal." };
  }
}

export async function acceptApplicantAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  
  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya UMKM terautentikasi yang dapat menerima Talent." };
  }

  const applicationId = String(formData.get("applicationId"));

  try {
    const application = await acceptApplicant(session.id, applicationId);

    revalidatePath(`/business/projects/${application.projectId}/applicants`);
    revalidatePath("/business");

    return { ok: true, message: "Talent berhasil dipilih! Proyek masuk tahap selanjutnya." };
  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Terjadi kesalahan internal." };
  }
}

