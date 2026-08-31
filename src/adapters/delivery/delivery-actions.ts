"use server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import { hasTalentFeatureAccess } from "@/src/modules/talent/feature-access";

import { submitMilestoneStaging, reviewMilestone, type ReviewDecision } from "@/src/modules/delivery/delivery.service";

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
  if (!(await hasTalentFeatureAccess(session.id))) return { ok: false, message: "Selesaikan verifikasi email dan onboarding Talent terlebih dahulu." };

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
    const submission = await submitMilestoneStaging(
      session.id,
      projectMilestoneId,
      stagingUrl,
      summary,
      instructions
    );

    const milestone = await prisma.projectMilestone.findUnique({
      where: { id: submission.projectMilestoneId }
    });

    if (milestone) {
      revalidatePath(`/talent/projects/${milestone.projectId}/workspace`);
    }

    return { ok: true, message: "Berhasil mengumpulkan hasil pengerjaan milestone!" };

  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Terjadi kesalahan internal saat mengumpulkan milestone." };
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
  const decision = String(formData.get("decision")) as ReviewDecision; // APPROVED, REVISION_REQUESTED, DISPUTED
  const feedback = String(formData.get("feedback") || "");

  if (decision === "REVISION_REQUESTED" && feedback.trim().length < 10) {
    return { ok: false, message: "Alasan revisi minimal 10 karakter." };
  }

  try {
    const review = await reviewMilestone(
      session.id,
      milestoneSubmissionId,
      decision,
      feedback
    );

    const submission = await prisma.milestoneSubmission.findUnique({
      where: { id: review.milestoneSubmissionId },
      include: { milestone: true }
    });

    if (submission) {
      revalidatePath(`/business/projects/${submission.milestone.projectId}`);
    }

    return { ok: true, message: `Review berhasil disimpan dengan status: ${decision}` };

  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Terjadi kesalahan internal saat memproses review." };
  }
}

