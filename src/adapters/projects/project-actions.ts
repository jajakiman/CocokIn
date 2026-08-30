"use server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { createProjectSchema, type CreateProjectInput } from "@/src/domain/projects/schemas";
import { revalidatePath } from "next/cache";

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
  // For simplicity in FormData, we assume the client passes a JSON string for milestones
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

  const { data } = validated;

  try {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) {
      return { ok: false, message: "Profil UMKM tidak ditemukan." };
    }

    const project = await prisma.$transaction(async (tx) => {
      // Create project
      const p = await tx.project.create({
        data: {
          businessProfileId: profile.id,
          title: data.title,
          scope: data.scope,
          difficulty: data.difficulty,
          estimatedDays: data.estimatedDays,
          deadline: data.deadline,
          serviceValue: data.serviceValue,
          status: "PUBLISHED", // Immediately publish for Phase 3 simplicity
          
          infrastructurePlan: {
            create: {
              recommendation: data.infrastructureNeed,
              rationale: "Dipilih saat pembuatan proyek"
            }
          },

          // Connect/Create skills
          skills: {
            create: data.skills.map(skillName => ({
              skill: {
                connectOrCreate: {
                  where: { name: skillName },
                  create: { name: skillName, category: "UNCATEGORIZED" }
                }
              }
            }))
          },
          
          // Create milestones and their acceptance criteria
          milestones: {
            create: data.milestones.map((m) => ({
              title: m.title,
              weightBps: m.weightBps,
              deadline: new Date(m.deadline),
              criteria: {
                create: m.acceptanceCriteria.map((c: string) => ({
                  description: c
                }))
              }
            }))
          }
        }
      });
      return p;
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    revalidatePath("/business");
    revalidatePath("/talent/marketplace");

    return { ok: true, message: "Proyek berhasil dipublikasikan!", projectId: project.id };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Terjadi kesalahan internal saat menyimpan proyek." };
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
    const talentProfile = await prisma.talentProfile.findUnique({
      where: { userId: session.id },
      include: { skills: { include: { skill: true } } }
    });

    if (!talentProfile) {
      return { ok: false, message: "Profil Talent tidak ditemukan." };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { skills: { include: { skill: true } } }
    });

    if (!project || project.status !== "PUBLISHED") {
      return { ok: false, message: "Proyek tidak tersedia." };
    }

    // Dynamic import to avoid circular dependency or keeping it simple
    const { calculateCocokScore } = await import("@/src/domain/matching/cocok-engine");
    const match = calculateCocokScore(talentProfile, project);

    await prisma.$transaction(async (tx) => {
      const application = await tx.projectApplication.create({
        data: {
          projectId,
          talentProfileId: talentProfile.id,
          status: "PENDING",
          motivation,
        }
      });

      await tx.matchSnapshot.create({
        data: {
          projectApplicationId: application.id,
          cocokScore: match.cocokScore,
          skillMatchScore: match.skillMatchScore,
          careerAlignmentScore: match.careerAlignmentScore,
          availabilityScore: match.availabilityScore,
          experienceScore: match.experienceScore,
          preferenceScore: match.preferenceScore,
          explainableText: match.explainableText,
        }
      });
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    revalidatePath("/talent/marketplace");
    revalidatePath(`/talent/marketplace/${projectId}`);

    return { ok: true, message: "Lamaran berhasil dikirim!" };
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return { ok: false, message: "Anda sudah melamar proyek ini." };
    }
    return { ok: false, message: "Terjadi kesalahan internal." };
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
    const profile = await prisma.businessProfile.findUnique({
      where: { userId: session.id },
    });

    if (!profile) {
      return { ok: false, message: "Profil UMKM tidak ditemukan." };
    }

    const application = await prisma.projectApplication.findUnique({
      where: { id: applicationId },
      include: { project: true }
    });

    if (!application) {
      return { ok: false, message: "Lamaran tidak ditemukan." };
    }

    if (application.project.businessProfileId !== profile.id) {
      return { ok: false, message: "Anda tidak berhak menerima Talent untuk proyek ini." };
    }

    if (application.project.status !== "PUBLISHED") {
      return { ok: false, message: "Status proyek sudah tidak menerima lamaran." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Accept the specific application
      await tx.projectApplication.update({
        where: { id: applicationId },
        data: { status: "ACCEPTED" }
      });

      // 2. Reject all other applications for this project
      await tx.projectApplication.updateMany({
        where: { projectId: application.projectId, id: { not: applicationId } },
        data: { status: "REJECTED" }
      });

      // 3. Move project to TALENT_SELECTED
      await tx.project.update({
        where: { id: application.projectId },
        data: { status: "TALENT_SELECTED" }
      });
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    revalidatePath(`/business/projects/${application.projectId}/applicants`);
    revalidatePath("/business");

    return { ok: true, message: "Talent berhasil dipilih! Proyek masuk tahap selanjutnya." };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Terjadi kesalahan internal." };
  }
}
