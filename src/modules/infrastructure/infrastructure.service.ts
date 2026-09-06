import { prisma } from "@/src/adapters/database/prisma";

export async function submitHandover(
  talentUserId: string,
  projectId: string,
  productionUrl: string,
  checklistData: Record<string, boolean>
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      applications: { where: { talentProfile: { userId: talentUserId }, status: "ACCEPTED" } },
      milestones: true,
      businessProfile: true,
    }
  });

  if (!project || project.applications.length === 0) {
    throw new Error("Akses ditolak.");
  }

  // Ensure all milestones are approved/paid
  const allMilestonesDone = project.milestones.every(m => m.status === "APPROVED" || m.status === "PAID" || m.status === "PAYOUT_DUE");
  if (!allMilestonesDone) {
    throw new Error("Semua milestone harus disetujui sebelum melakukan handover.");
  }

  return prisma.$transaction(async (tx) => {
    const handover = await tx.infrastructureHandover.upsert({
      where: { projectId },
      update: {
        status: "PENDING",
        productionUrl,
        checklistData
      },
      create: {
        projectId,
        status: "PENDING",
        productionUrl,
        checklistData
      }
    });

    await tx.project.update({
      where: { id: projectId },
      data: { status: "HANDOVER_PENDING" }
    });

    // Notify UMKM
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    await createNotification(
      project.businessProfile.userId,
      "Handover Infrastruktur",
      `Talent telah mensubmit handover infrastruktur untuk proyek ${project.title}. Silakan direview.`
    );

    return handover;
  });
}

export async function reviewHandover(
  businessUserId: string,
  projectId: string,
  decision: "ACCEPTED" | "DISPUTED"
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { businessProfile: true, applications: { where: { status: "ACCEPTED" }, include: { talentProfile: true } } }
  });

  if (!project || project.businessProfile.userId !== businessUserId) {
    throw new Error("Akses ditolak.");
  }

  return prisma.$transaction(async (tx) => {
    const handover = await tx.infrastructureHandover.update({
      where: { projectId },
      data: { status: decision }
    });

    if (decision === "ACCEPTED") {
      // Transition project to DELIVERED and initialize 30-day warranty agreement & 5-ticket maintenance package
      const { startWarrantyPeriod } = await import("@/src/modules/support/warranty.service");
      await startWarrantyPeriod(projectId);

      // Notify Talent
      if (project.applications[0]) {
        const { createNotification } = await import("@/src/modules/notifications/notification.service");
        await createNotification(
          project.applications[0].talentProfile.userId,
          "Handover Disetujui",
          `Proyek ${project.title} telah disetujui serah terimanya dan resmi memasuki masa garansi 30 hari!`
        );
      }

      // Trigger Digital Growth Reassessment (create new snapshot record for FR-BIZ-05 growth tracking)
      const assessment = await tx.businessAssessmentResult.findFirst({
        where: { businessProfileId: project.businessProfileId },
        orderBy: { createdAt: "desc" }
      });
      if (assessment) {
        await tx.businessAssessmentResult.create({
          data: {
            businessProfileId: project.businessProfileId,
            readinessScore: Math.min(100, assessment.readinessScore + 6),
            financeScore: Math.min(100, assessment.financeScore + 5),
            marketingScore: Math.min(100, assessment.marketingScore + 10),
            teamScore: Math.min(100, assessment.teamScore + 5),
            operationsScore: Math.min(100, assessment.operationsScore + 10),
            outsourcingScore: Math.min(100, assessment.outsourcingScore + 10),
          }
        });
      }
    } else if (decision === "DISPUTED") {
      await tx.project.update({
        where: { id: projectId },
        data: { status: "DISPUTED" }
      });
    }

    return handover;
  });
}
