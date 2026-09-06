import { prisma } from "@/src/adapters/database/prisma";
import { createPlatformReference } from "@/src/lib/money";
import {
  createWarrantyRetentionPayoutJournal,
  createRefundJournal,
  commitJournalTransaction,
} from "@/src/modules/payments/ledger";
import type { DisputeDecisionInput } from "./types";

/**
 * Raises a dispute on a project, freezing the 10% warranty retention.
 * Attaches immutable evidence records.
 */
export async function raiseDispute(
  userId: string,
  projectId: string,
  reason: string,
  evidenceUrls: string[] = []
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { warrantyAgreement: true },
  });

  if (!project) {
    throw new Error("Proyek tidak ditemukan.");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Freeze project and warranty status
    await tx.project.update({
      where: { id: projectId },
      data: { status: "DISPUTED" },
    });

    if (project.warrantyAgreement) {
      await tx.warrantyAgreement.update({
        where: { projectId },
        data: { status: "DISPUTED" },
      });
    }

    // 2. Create Dispute
    const dispute = await tx.dispute.create({
      data: {
        projectId,
        reason,
        status: "OPEN",
      },
    });

    // 3. Attach immutable evidence records
    if (evidenceUrls.length > 0) {
      await tx.disputeEvidence.createMany({
        data: evidenceUrls.map((url) => ({
          disputeId: dispute.id,
          fileUrl: url,
          submitterId: userId,
        })),
      });
    }

    return dispute;
  });
}

/**
 * Admin Dispute Desk: Resolves dispute and creates compensating ledger entries.
 * Enforces zero-sum split of the 10% retention balance.
 */
export async function resolveDispute(
  adminUserId: string,
  disputeId: string,
  decision: DisputeDecisionInput
) {
  if (decision.talentSharePercent + decision.umkmSharePercent !== 100) {
    throw new Error("Total persentase pembagian harus tepat 100%.");
  }

  const dispute = await prisma.dispute.findUnique({
    where: { id: disputeId },
    include: {
      project: {
        include: { escrowTransaction: true, warrantyAgreement: true },
      },
    },
  });

  if (!dispute) {
    throw new Error("Sengketa tidak ditemukan.");
  }

  if (dispute.status === "RESOLVED") {
    throw new Error("Sengketa ini sudah diselesaikan sebelumnya.");
  }

  const project = dispute.project;
  const escrowId = project.escrowTransaction?.id;
  if (!escrowId) {
    throw new Error("Escrow transaction tidak ditemukan untuk proyek ini.");
  }

  const totalRetention = (project.serviceValue * 1000n) / 10000n; // 10%
  const talentAmount = (totalRetention * BigInt(decision.talentSharePercent)) / 100n;
  const umkmAmount = totalRetention - talentAmount;

  return prisma.$transaction(async (tx) => {
    // 1. If Talent is awarded a share, pay out from TALENT_PAYABLE to CASH_AT_BANK
    if (talentAmount > 0n) {
      const talentJournal = createWarrantyRetentionPayoutJournal({
        retentionAmount: talentAmount,
        reference: createPlatformReference(project.id, "DISPUTE_TALENT", 1),
      });
      await commitJournalTransaction(tx, escrowId, talentJournal);
    }

    // 2. If UMKM is awarded a refund, move from TALENT_PAYABLE to CASH_AT_BANK
    if (umkmAmount > 0n) {
      const umkmJournal = createRefundJournal({
        refundAmount: umkmAmount,
        sourceAccount: "TALENT_PAYABLE",
        reference: createPlatformReference(project.id, "DISPUTE_UMKM", 1),
      });
      await commitJournalTransaction(tx, escrowId, umkmJournal);
    }

    // 3. Record Admin Decision
    const decisionRecord = await tx.disputeDecision.create({
      data: {
        disputeId,
        resolution: decision.resolution,
        notes: `[Resolver: ${adminUserId}] [Split: ${decision.talentSharePercent}% Talent / ${decision.umkmSharePercent}% UMKM] ${decision.notes}`,
      },
    });

    // 4. Update Dispute status to RESOLVED
    await tx.dispute.update({
      where: { id: disputeId },
      data: { status: "RESOLVED" },
    });

    // 5. Update WarrantyAgreement & Project to COMPLETED
    if (project.warrantyAgreement) {
      await tx.warrantyAgreement.update({
        where: { projectId: project.id },
        data: { status: "COMPLETED" },
      });
    }

    await tx.project.update({
      where: { id: project.id },
      data: { status: "COMPLETED" },
    });

    return decisionRecord;
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}
