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
    include: { 
      skills: { include: { skill: true } },
      businessProfile: { include: { user: true } }
    }
  });

  if (!project || project.status !== "PUBLISHED") {
    throw new Error("Project is not available for applications.");
  }

  const { calculateCocokScore } = await import("@/src/modules/matching/calculate-cocok-score");
  
  const match = calculateCocokScore(
    {
      skills: talentProfile.skills.map((s) => ({
        skillId: s.skillId,
        name: s.skill.name,
        level: s.evidenceLevel as any,
      })),
      targetCareerId: talentProfile.careerTarget || "",
      availability: talentProfile.timeAvailability as any,
      completedProjectsCount: 0, // Fallback for MVP
      workModePreference: talentProfile.workModePreference as any,
      city: undefined,
    },
    {
      requiredSkills: project.skills.map((s) => ({
        skillId: s.skillId,
        name: s.skill.name,
      })),
      targetCareerId: "", // Simplification for now
      difficulty: project.difficulty as any,
      durationDays: project.estimatedDays,
      workMode: "REMOTE", // Simplified for Phase 3 MVP
      city: undefined,
    }
  );

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
        cocokScore: match.total,
        skillMatchScore: match.factors.skill,
        careerAlignmentScore: match.factors.career,
        availabilityScore: match.factors.availability,
        experienceScore: match.factors.experience,
        preferenceScore: match.factors.workMode,
        explainableText: match.reasons.join(" "),
      }
    });
    
    // Send Notification to Business
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    await createNotification(
      project.businessProfile.userId,
      "Lamaran Baru",
      `Seorang Talent baru saja melamar ke proyek "${project.title}".`
    );

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
    include: { 
      project: true,
      talentProfile: { include: { user: true } }
    }
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
    
    // 4. Initialize empty ProjectAgreement
    await tx.projectAgreement.create({
      data: { projectId: application.projectId }
    });
    
    // Send Notification to Talent
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    await createNotification(
      application.talentProfile.userId,
      "Lamaran Diterima!",
      `Selamat! Lamaran Anda untuk proyek "${application.project.title}" telah diterima. Silakan tandatangani perjanjian.`
    );

    return application;
  }, {
    maxWait: 10000,
    timeout: 20000
  });
}

export async function signProjectAgreement(userId: string, projectId: string, role: "BUSINESS" | "TALENT") {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      agreement: true,
      businessProfile: true,
      applications: {
        where: { status: "ACCEPTED" },
        include: { talentProfile: true }
      }
    }
  });

  if (!project || project.status !== "TALENT_SELECTED") {
    throw new Error("Project not available for agreement signing.");
  }
  
  if (!project.agreement) {
    throw new Error("Agreement not found.");
  }

  const acceptedApp = project.applications[0];
  if (!acceptedApp) throw new Error("No accepted talent found.");

  if (role === "BUSINESS" && project.businessProfile.userId !== userId) {
    throw new Error("Unauthorized to sign as UMKM.");
  }
  
  if (role === "TALENT" && acceptedApp.talentProfile.userId !== userId) {
    throw new Error("Unauthorized to sign as Talent.");
  }

  return prisma.$transaction(async (tx) => {
    const updateData = role === "BUSINESS" 
      ? { businessAgreedAt: new Date() } 
      : { talentAgreedAt: new Date() };

    const updatedAgreement = await tx.projectAgreement.update({
      where: { projectId },
      data: updateData
    });

    const isFullySigned = updatedAgreement.businessAgreedAt && updatedAgreement.talentAgreedAt;
    
    if (isFullySigned) {
      await tx.project.update({
        where: { id: projectId },
        data: { status: "AGREEMENT_CONFIRMED" }
      });
    }

    // Notify the other party
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    const otherUserId = role === "BUSINESS" ? acceptedApp.talentProfile.userId : project.businessProfile.userId;
    
    await createNotification(
      otherUserId,
      isFullySigned ? "Perjanjian Selesai!" : "Perjanjian Ditandatangani",
      isFullySigned 
        ? `Perjanjian untuk proyek "${project.title}" telah disetujui kedua belah pihak.`
        : `${role === "BUSINESS" ? "UMKM" : "Talent"} telah menandatangani perjanjian untuk proyek "${project.title}".`
    );

    return updatedAgreement;
  }, { maxWait: 10000, timeout: 20000 });
}
