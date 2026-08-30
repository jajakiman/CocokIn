"use server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";

export type DeliveryActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitMilestoneAction(
  prevState: DeliveryActionState | null,
  formData: FormData
): Promise<DeliveryActionState> {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    return { ok: false, message: "Hanya Talent terautentikasi yang dapat mengumpulkan milestone." };
  }

  const projectMilestoneId = String(formData.get("projectMilestoneId"));
  const stagingUrl = String(formData.get("stagingUrl"));
  const summary = String(formData.get("summary"));
  const instructions = String(formData.get("instructions") || "");

  if (!stagingUrl.startsWith("http")) {
    return { ok: false, message: "URL Staging harus diawali dengan http:// atau https://" };
  }
  
  if (summary.trim().length < 10) {
    return { ok: false, message: "Summary minimal 10 karakter." };
  }

  try {
    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: projectMilestoneId },
      include: {
        project: {
          include: {
            applications: { where: { talentProfile: { userId: session.id }, status: "ACCEPTED" } }
          }
        },
        submissions: {
          orderBy: { version: "desc" },
          take: 1
        }
      }
    });

    if (!milestone || milestone.project.applications.length === 0) {
      return { ok: false, message: "Akses ditolak atau milestone tidak ditemukan." };
    }

    if (milestone.status === "APPROVED" || milestone.status === "PAID" || milestone.status === "PAYOUT_DUE") {
      return { ok: false, message: "Milestone ini sudah selesai/disetujui." };
    }

    const nextVersion = milestone.submissions.length > 0 ? milestone.submissions[0].version + 1 : 1;

    await prisma.$transaction(async (tx) => {
      // 1. Create the submission
      await tx.milestoneSubmission.create({
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
    }, { maxWait: 10000, timeout: 20000 });

    revalidatePath(`/talent/projects/${milestone.projectId}/workspace`);
    return { ok: true, message: "Berhasil mengumpulkan hasil pengerjaan milestone!" };

  } catch (error) {
    console.error(error);
    return { ok: false, message: "Terjadi kesalahan internal saat mengumpulkan milestone." };
  }
}

export async function reviewMilestoneAction(
  prevState: DeliveryActionState | null,
  formData: FormData
): Promise<DeliveryActionState> {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya UMKM terautentikasi yang dapat mereview milestone." };
  }

  const milestoneSubmissionId = String(formData.get("milestoneSubmissionId"));
  const decision = String(formData.get("decision")); // APPROVED, REVISION_REQUESTED, DISPUTED
  const feedback = String(formData.get("feedback") || "");

  if (decision === "REVISION_REQUESTED" && feedback.trim().length < 10) {
    return { ok: false, message: "Alasan revisi minimal 10 karakter." };
  }

  try {
    const submission = await prisma.milestoneSubmission.findUnique({
      where: { id: milestoneSubmissionId },
      include: {
        milestone: {
          include: { project: true }
        }
      }
    });

    if (!submission || submission.milestone.project.businessProfileId !== (await prisma.businessProfile.findUnique({where: {userId: session.id}}))?.id) {
      return { ok: false, message: "Akses ditolak atau submission tidak ditemukan." };
    }

    if (submission.milestone.status !== "READY_FOR_REVIEW") {
      return { ok: false, message: "Milestone ini tidak dalam status siap direview." };
    }

    await prisma.$transaction(async (tx) => {
      // Create Review Record
      await tx.milestoneReview.upsert({
        where: { milestoneSubmissionId },
        update: { decision, feedback },
        create: { milestoneSubmissionId, decision, feedback }
      });

      // Update Milestone Status based on decision
      const newStatus = decision === "APPROVED" ? "APPROVED" 
                      : decision === "REVISION_REQUESTED" ? "REVISION_REQUESTED" 
                      : "DISPUTED";
      
      await tx.projectMilestone.update({
        where: { id: submission.projectMilestoneId },
        data: { status: newStatus }
      });

      // If approved, check if all milestones are approved to move project to DELIVERED/COMPLETED
      // For now, let's keep it simple. If this is APPROVED, we can trigger funding flow in Phase 5.
    }, { maxWait: 10000, timeout: 20000 });

    revalidatePath(`/business/projects/${submission.milestone.projectId}`);
    return { ok: true, message: `Review berhasil disimpan dengan status: ${decision}` };

  } catch (error) {
    console.error(error);
    return { ok: false, message: "Terjadi kesalahan internal saat memproses review." };
  }
}

