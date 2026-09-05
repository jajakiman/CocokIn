import { prisma } from "@/src/adapters/database/prisma";
import { handleApprovedMilestoneRelease } from "@/src/modules/payments/payout";

export async function submitMilestoneStaging(
  talentUserId: string,
  projectMilestoneId: string,
  stagingUrl: string,
  summary: string,
  instructions: string
) {
  const milestone = await prisma.projectMilestone.findUnique({
    where: { id: projectMilestoneId },
    include: {
      project: {
        include: {
          applications: { where: { talentProfile: { userId: talentUserId }, status: "ACCEPTED" } },
          businessProfile: true
        }
      },
      submissions: {
        orderBy: { version: "desc" },
        take: 1
      }
    }
  });

  if (!milestone || milestone.project.applications.length === 0) {
    throw new Error("Akses ditolak atau milestone tidak ditemukan.");
  }

  if (milestone.status === "APPROVED" || milestone.status === "PAID" || milestone.status === "PAYOUT_DUE") {
    throw new Error("Milestone ini sudah selesai/disetujui.");
  }

  const nextVersion = milestone.submissions.length > 0 ? milestone.submissions[0].version + 1 : 1;

  return prisma.$transaction(async (tx) => {
    // 1. Create the submission
    const submission = await tx.milestoneSubmission.create({
      data: {
        projectMilestoneId,
        version: nextVersion,
        stagingUrl,
        summary,
        instructions
      }
    });

    // 2. Update milestone status
    await tx.projectMilestone.update({
      where: { id: projectMilestoneId },
      data: { status: "READY_FOR_REVIEW" }
    });
    
    // 3. Update project status if it's the first submission
    if (milestone.project.status === "IN_PROGRESS" || milestone.project.status === "TALENT_SELECTED") {
      await tx.project.update({
        where: { id: milestone.projectId },
        data: { status: "STAGING_REVIEW" }
      });
    }

    // Notify Business
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    await createNotification(
      milestone.project.businessProfile.userId,
      "Pekerjaan Dikumpulkan",
      `Talent telah mengumpulkan hasil pengerjaan milestone "${milestone.title}". Silakan direview.`
    );

    return submission;
  }, { maxWait: 10000, timeout: 20000 });
}

export type ReviewDecision = "APPROVED" | "REVISION_REQUESTED" | "DISPUTED";

export async function reviewMilestone(
  businessUserId: string,
  milestoneSubmissionId: string,
  decision: ReviewDecision,
  feedback: string
) {
  const submission = await prisma.milestoneSubmission.findUnique({
    where: { id: milestoneSubmissionId },
    include: {
      milestone: {
        include: { project: true }
      }
    }
  });

  const profile = await prisma.businessProfile.findUnique({where: {userId: businessUserId}});

  if (!submission || !profile || submission.milestone.project.businessProfileId !== profile.id) {
    throw new Error("Akses ditolak atau submission tidak ditemukan.");
  }

  if (submission.milestone.status !== "READY_FOR_REVIEW") {
    throw new Error("Milestone ini tidak dalam status siap direview.");
  }

  return prisma.$transaction(async (tx) => {
    // Create Review Record
    const review = await tx.milestoneReview.upsert({
      where: { milestoneSubmissionId },
      update: { decision, feedback },
      create: { milestoneSubmissionId, decision, feedback }
    });

    // Update Milestone Status based on decision
    const newStatus = decision;
    
    await tx.projectMilestone.update({
      where: { id: submission.projectMilestoneId },
      data: { status: newStatus }
    });

    // Hook to Treasury/Payout upon milestone approval (TEAM_JOBDESCS.md:335)
    if (decision === "APPROVED") {
      const grossAmount =
        (submission.milestone.project.serviceValue * BigInt(submission.milestone.weightBps)) / 10000n;

      await handleApprovedMilestoneRelease(tx, {
        projectId: submission.milestone.projectId,
        milestoneId: submission.projectMilestoneId,
        grossAmount,
        approvedAt: new Date(),
        approvedBy: businessUserId,
      });
    }
    
    // Notify Talent
    const { createNotification } = await import("@/src/modules/notifications/notification.service");
    
    // We need to fetch the talent user ID
    const application = await tx.projectApplication.findFirst({
      where: { projectId: submission.milestone.projectId, status: "ACCEPTED" },
      include: { talentProfile: true }
    });
    
    if (application) {
      await createNotification(
        application.talentProfile.userId,
        decision === "APPROVED" ? "Milestone Disetujui" : decision === "REVISION_REQUESTED" ? "Revisi Milestone" : "Milestone Disputed",
        `UMKM telah mereview milestone "${submission.milestone.title}" dengan status: ${decision}.`
      );
    }

    return review;
  }, { maxWait: 10000, timeout: 20000 });
}
