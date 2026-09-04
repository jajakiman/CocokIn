import type { Prisma } from "@prisma/client";
import { prisma } from "@/src/adapters/database/prisma";
import { calculateMilestoneFinancials, createPlatformReference } from "@/src/lib/money";
import {
  createMilestonePayoutJournal,
  createRefundJournal,
  commitJournalTransaction,
} from "@/src/modules/payments/ledger";
import type { ApprovedMilestoneRelease, PayoutDetails, RefundCalculation } from "./types";

/**
 * Handles approved milestone release hook triggered by UMKM review.
 * Sesuai kesepakatan antarmuka TEAM_JOBDESCS.md:335
 */
export async function handleApprovedMilestoneRelease(
  tx: Prisma.TransactionClient,
  release: ApprovedMilestoneRelease
) {
  const milestone = await tx.projectMilestone.findUnique({
    where: { id: release.milestoneId },
    include: {
      project: {
        include: {
          applications: {
            where: { status: "ACCEPTED" },
            include: {
              talentProfile: { include: { payoutAccount: true } },
            },
          },
        },
      },
    },
  });

  if (!milestone) {
    throw new Error("Milestone tidak ditemukan.");
  }

  if (milestone.project.id !== release.projectId) {
    throw new Error("Milestone dan proyek pada release tidak cocok.");
  }
  if (milestone.status !== "APPROVED") {
    throw new Error("Payout hanya dapat dibuat dari milestone berstatus APPROVED.");
  }

  const expectedGrossAmount = (milestone.project.serviceValue * BigInt(milestone.weightBps)) / 10_000n;
  if (release.grossAmount !== expectedGrossAmount) {
    throw new Error("Nominal release tidak sesuai nilai bobot milestone.");
  }

  const payoutAccount = milestone.project.applications[0]?.talentProfile.payoutAccount;
  if (!payoutAccount?.verifiedAt) {
    throw new Error("Instruksi payout memerlukan rekening payout Talent terverifikasi.");
  }

  // Calculate 90% immediate payout and 10% warranty retention
  const { immediatePayout } = calculateMilestoneFinancials(release.grossAmount);

  // Ensure EscrowTransaction exists
  let escrow = await tx.escrowTransaction.findUnique({
    where: { projectId: release.projectId },
  });

  if (!escrow) {
    escrow = await tx.escrowTransaction.create({
      data: { projectId: release.projectId },
    });
  }

  const existingPayouts = await tx.payoutInstruction.count({
    where: { escrowTransactionId: escrow.id },
  });

  const platformRef = createPlatformReference(
    release.projectId,
    "PAYOUT",
    existingPayouts + 1
  );

  // Create PayoutInstruction record
  const payout = await tx.payoutInstruction.create({
    data: {
      escrowTransactionId: escrow.id,
      milestoneId: release.milestoneId,
      status: "PAYOUT_DUE",
      amount: immediatePayout,
      platformReference: platformRef,
      recipientBank: payoutAccount.bankName,
      recipientAccount: payoutAccount.accountNumber,
      recipientName: payoutAccount.accountHolder,
    },
  });

  // Update milestone status to PAYOUT_DUE
  await tx.projectMilestone.update({
    where: { id: release.milestoneId },
    data: { status: "PAYOUT_DUE" },
  });

  return payout;
}

/**
 * Executes a payout instruction by moving cash out of bank to Talent in the double-entry ledger.
 */
export async function executePayoutTransfer(
  payoutInstructionId: string,
  externalReference?: string
) {
  const payout = await prisma.payoutInstruction.findUnique({
    where: { id: payoutInstructionId },
    include: {
      escrowTransaction: {
        include: {
          project: {
            include: { milestones: true },
          },
        },
      },
    },
  });

  if (!payout) {
    throw new Error("Instruksi payout tidak ditemukan.");
  }

  if (payout.status === "PAID") {
    throw new Error("Payout ini sudah berhasil dibayarkan sebelumnya.");
  }

  if (
    !payout.recipientBank ||
    !payout.recipientAccount ||
    !payout.recipientName ||
    [payout.recipientBank, payout.recipientAccount, payout.recipientName].includes("UNSET")
  ) {
    throw new Error("Rekening tujuan payout tidak valid atau belum diverifikasi.");
  }

  const extRef =
    externalReference ||
    `SIM-PAYOUT-${payout.platformReference?.replace("CCK-", "") || Date.now()}`;

  return prisma.$transaction(async (tx) => {
    // 1. Commit payout journal to Ledger (TALENT_PAYABLE -> CASH_AT_BANK)
    const payoutJournal = createMilestonePayoutJournal({
      immediatePayout: payout.amount,
      reference: payout.platformReference || createPlatformReference(payout.escrowTransaction.projectId, "PAYOUT", 1),
    });
    await commitJournalTransaction(tx, payout.escrowTransactionId, payoutJournal);

    // 2. Update PayoutInstruction status to PAID
    const updatedPayout = await tx.payoutInstruction.update({
      where: { id: payoutInstructionId },
      data: {
        status: "PAID",
        externalReference: extRef,
      },
    });

    // 3. Update milestone status to PAID
    await tx.projectMilestone.update({
      where: { id: payout.milestoneId },
      data: { status: "PAID" },
    });

    // 4. Check if all project milestones are now PAID
    const remainingMilestones = await tx.projectMilestone.findMany({
      where: {
        projectId: payout.escrowTransaction.projectId,
        id: { not: payout.milestoneId },
        status: { not: "PAID" },
      },
    });

    if (remainingMilestones.length === 0) {
      await tx.project.update({
        where: { id: payout.escrowTransaction.projectId },
        data: { status: "HANDOVER_PENDING" },
      });
    }

    return updatedPayout;
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}

/**
 * Calculates deterministic refund breakdown from remaining project funds in the ledger.
 */
export async function calculateRefundBreakdown(
  projectId: string,
  isPlatformFault: boolean = false
): Promise<RefundCalculation> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      milestones: true,
      fundingReceipt: true,
    },
  });

  if (!project) {
    throw new Error("Proyek tidak ditemukan.");
  }

  const serviceValue = project.serviceValue;
  let uncompletedMilestoneValue = 0n;
  let completedMilestoneValue = 0n;

  for (const m of project.milestones) {
    const mValue = (serviceValue * BigInt(m.weightBps)) / 10_000n;
    if (m.status === "PAID" || m.status === "APPROVED" || m.status === "PAYOUT_DUE") {
      completedMilestoneValue += mValue;
    } else {
      uncompletedMilestoneValue += mValue;
    }
  }

  // 5% Success Fee remains unearned and refundable if project is cancelled before handover
  const pendingPlatformFee = (serviceValue * 500n) / 10_000n;
  const grossRefundable = uncompletedMilestoneValue + pendingPlatformFee;

  const transferCost = isPlatformFault ? 0n : 2500n; // Rp 2.500 BI-FAST transfer fee
  const netRefund = grossRefundable > transferCost ? grossRefundable - transferCost : 0n;

  return {
    projectId,
    serviceValue,
    completedMilestoneValue,
    uncompletedMilestoneValue,
    pendingPlatformFee,
    grossRefundable,
    transferCost,
    netRefund,
    costBearer: isPlatformFault ? "COCOKIN" : "UMKM",
  };
}

/**
 * Executes refund to UMKM, records balanced ledger entries, and updates project status to CANCELLED.
 */
export async function executeRefundTransfer(
  projectId: string,
  isPlatformFault: boolean = false,
  externalReference?: string
) {
  const calc = await calculateRefundBreakdown(projectId, isPlatformFault);

  let escrow = await prisma.escrowTransaction.findUnique({
    where: { projectId },
  });

  if (!escrow) {
    escrow = await prisma.escrowTransaction.create({
      data: { projectId },
    });
  }

  const extRef = externalReference || `SIM-REFUND-${Date.now()}`;
  const platformRef = createPlatformReference(projectId, "REFUND", 1);

  return prisma.$transaction(async (tx) => {
    // 1. Commit refund journal
    const refundJournal = createRefundJournal({
      refundAmount: calc.grossRefundable,
      sourceAccount: "TALENT_PAYABLE",
      reference: platformRef,
    });
    await commitJournalTransaction(tx, escrow.id, refundJournal);

    // 2. Create RefundInstruction record
    const refundInstruction = await tx.refundInstruction.create({
      data: {
        escrowTransactionId: escrow.id,
        status: "REFUNDED",
        grossRefundable: calc.grossRefundable,
        netRefund: calc.netRefund,
        costBearer: calc.costBearer,
        platformReference: platformRef,
        externalReference: extRef,
      },
    });

    // 3. Update Project Status to CANCELLED
    await tx.project.update({
      where: { id: projectId },
      data: { status: "CANCELLED" },
    });

    // 4. Update FundingReceipt to REFUNDED
    await tx.fundingReceipt.update({
      where: { projectId },
      data: { status: "CANCELLED" },
    });

    return refundInstruction;
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}
