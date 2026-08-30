import { prisma } from "@/src/adapters/database/prisma";

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
          applications: { where: { talentProfile: { userId: talentUserId }, status: "ACCEPTED" } }
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

    // We can export an event or payload here later for Treasury if APPROVED
    if (decision === "APPROVED") {
      // Treasury logic hooks here for payout queueing
      // e.g. create ApprovedMilestoneRelease payload
    }

    return review;
  }, { maxWait: 10000, timeout: 20000 });
}
