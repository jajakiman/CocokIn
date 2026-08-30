import { prisma } from "@/src/adapters/database/prisma";
import { type CreateProjectInput } from "@/src/domain/projects/schemas";

export async function createProjectDraft(businessUserId: string, data: Partial<CreateProjectInput>, projectId?: string) {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId: businessUserId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  // If projectId is provided, update the draft
  if (projectId) {
    const existing = await prisma.project.findUnique({ where: { id: projectId } });
    if (!existing || existing.businessProfileId !== profile.id) {
      throw new Error("Draft not found or unauthorized.");
    }
    
    // In a real autosave we'd handle partial updates, but for simplicity we'll just return the project
    // Usually autosave updates the json blob or fields progressively
    return prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title || existing.title,
        scope: data.scope || existing.scope,
        difficulty: data.difficulty || existing.difficulty,
        estimatedDays: data.estimatedDays || existing.estimatedDays,
        deadline: data.deadline || existing.deadline,
        serviceValue: data.serviceValue || existing.serviceValue,
      }
    });
  }

  // Creating a new draft
  return prisma.project.create({
    data: {
      businessProfileId: profile.id,
      title: data.title || "Untitled Draft",
      scope: data.scope || "",
      difficulty: data.difficulty || "BEGINNER",
      estimatedDays: data.estimatedDays || 1,
      deadline: data.deadline || new Date(),
      serviceValue: data.serviceValue || 0,
      status: "DRAFT",
    }
  });
}

export async function publishProject(businessUserId: string, projectId: string) {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId: businessUserId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  const existing = await prisma.project.findUnique({ 
    where: { id: projectId },
    include: { milestones: true }
  });

  if (!existing || existing.businessProfileId !== profile.id) {
    throw new Error("Project not found or unauthorized.");
  }

  const totalWeight = existing.milestones.reduce((sum, m) => sum + m.weightBps, 0);
  if (totalWeight !== 10000) {
    throw new Error("Total milestone weight must be exactly 100% (10000 bps) to publish.");
  }

  return prisma.project.update({
    where: { id: projectId },
    data: { status: "PUBLISHED" }
  });
}

export async function createProject(businessUserId: string, data: CreateProjectInput, status: "DRAFT" | "PUBLISHED" = "PUBLISHED") {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId: businessUserId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  // Calculate if the project can be published based on milestone weights
  const totalWeight = data.milestones.reduce((sum, m) => sum + m.weightBps, 0);
  if (status === "PUBLISHED" && totalWeight !== 10000) {
    throw new Error("Total milestone weight must be exactly 100% (10000 bps) to publish.");
  }

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        businessProfileId: profile.id,
        title: data.title,
        scope: data.scope,
        difficulty: data.difficulty,
        estimatedDays: data.estimatedDays,
        deadline: data.deadline,
        serviceValue: data.serviceValue,
        status, // DRAFT or PUBLISHED
        
        infrastructurePlan: {
          create: {
            recommendation: data.infrastructureNeed,
            rationale: "Dipilih saat pembuatan proyek"
          }
        },

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
    return project;
  }, {
    maxWait: 10000,
    timeout: 20000
  });
}

export async function applyToProject(talentUserId: string, projectId: string, motivation: string) {
  const talentProfile = await prisma.talentProfile.findUnique({
    where: { userId: talentUserId },
    include: { skills: { include: { skill: true } } }
  });

  if (!talentProfile) {
    throw new Error("Talent profile not found.");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { skills: { include: { skill: true } } }
  });

  if (!project || project.status !== "PUBLISHED") {
    throw new Error("Project is not available for applications.");
  }

  const { calculateCocokScore } = await import("@/src/domain/matching/cocok-engine");
  const match = calculateCocokScore(talentProfile, project);

  return prisma.$transaction(async (tx) => {
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
    return application;
  }, {
    maxWait: 10000,
    timeout: 20000
  });
}

export async function acceptApplicant(businessUserId: string, applicationId: string) {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId: businessUserId },
  });

  if (!profile) {
    throw new Error("Business profile not found.");
  }

  const application = await prisma.projectApplication.findUnique({
    where: { id: applicationId },
    include: { project: true }
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.project.businessProfileId !== profile.id) {
    throw new Error("Unauthorized to accept talent for this project.");
  }

  if (application.project.status !== "PUBLISHED") {
    throw new Error("Project is no longer accepting applications.");
  }

  return prisma.$transaction(async (tx) => {
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
    return application;
  }, {
    maxWait: 10000,
    timeout: 20000
  });
}
