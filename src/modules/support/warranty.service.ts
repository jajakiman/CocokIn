import { prisma } from "@/src/adapters/database/prisma";
import { createPlatformReference } from "@/src/lib/money";
import {
  createWarrantyRetentionPayoutJournal,
  createSuccessFeeJournal,
  commitJournalTransaction,
} from "@/src/modules/payments/ledger";
import type { CreateTicketInput, WarrantyAgreementDetails, WarrantyReleaseResult } from "./types";

/**
 * Starts the official 30-day warranty agreement and 5-ticket maintenance package.
 * Triggered upon successful handover completion.
 */
export async function startWarrantyPeriod(projectId: string, startDate?: Date) {
  const start = startDate || new Date();
  const end = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // exactly 30 days

  return prisma.$transaction(async (tx) => {
    const warranty = await tx.warrantyAgreement.upsert({
      where: { projectId },
      update: {
        status: "ACTIVE",
        startDate: start,
        endDate: end,
      },
      create: {
        projectId,
        status: "ACTIVE",
        startDate: start,
        endDate: end,
      },
    });

    await tx.maintenancePackage.upsert({
      where: { projectId },
      update: {
        startDate: start,
        endDate: end,
        ticketQuota: 5,
      },
      create: {
        projectId,
        startDate: start,
        endDate: end,
        ticketQuota: 5,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { status: "DELIVERED" },
    });

    return warranty;
  });
}

/**
 * Creates a support ticket under the maintenance package.
 * Enforces the strict 5-ticket quota rule.
 */
export async function createSupportTicket(
  businessUserId: string,
  projectId: string,
  input: CreateTicketInput
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      businessProfile: true,
      warrantyAgreement: true,
      maintenancePackage: true,
    },
  });

  if (!project || project.businessProfile.userId !== businessUserId) {
    throw new Error("Akses ditolak atau proyek tidak ditemukan.");
  }

  if (!project.warrantyAgreement || project.warrantyAgreement.status !== "ACTIVE") {
    throw new Error("Garansi proyek ini tidak dalam status aktif.");
  }

  if (!project.maintenancePackage || project.maintenancePackage.ticketQuota <= 0) {
    throw new Error("Kuota 5 tiket pemeliharaan untuk proyek ini telah habis.");
  }

  return prisma.$transaction(async (tx) => {
    // Deduct ticket quota
    await tx.maintenancePackage.update({
      where: { projectId },
      data: { ticketQuota: { decrement: 1 } },
    });

    const ticket = await tx.supportTicket.create({
      data: {
        projectId,
        severity: input.severity,
        description: input.description,
        status: "OPEN",
      },
    });

    return ticket;
  });
}

/**
 * Resolves an active support ticket.
 */
export async function resolveSupportTicket(ticketId: string) {
  return prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "RESOLVED" },
  });
}

/**
 * Evaluates warranty completion and releases the 10% retention if:
 * 1. 30 days have elapsed.
 * 2. No open or in-progress support tickets exist.
 * 3. No open disputes exist.
 */
export async function checkAndReleaseWarrantyRetention(
  projectId: string,
  asOfDate?: Date
): Promise<WarrantyReleaseResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      warrantyAgreement: true,
      supportTickets: true,
      disputes: true,
      escrowTransaction: true,
    },
  });

  if (!project || !project.warrantyAgreement) {
    throw new Error("Data garansi proyek tidak ditemukan.");
  }

  const warranty = project.warrantyAgreement;

  if (warranty.status === "COMPLETED") {
    return { released: false, reason: "Garansi sudah selesai dan retensi sudah dicairkan sebelumnya." };
  }

  if (warranty.status !== "ACTIVE") {
    return { released: false, reason: `Garansi sedang dalam status ${warranty.status}.` };
  }

  const now = asOfDate || new Date();
  if (warranty.endDate && now < warranty.endDate) {
    const daysLeft = Math.ceil((warranty.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return { released: false, reason: `Masa garansi 30 hari belum berakhir (${daysLeft} hari tersisa).` };
  }

  const unresolvedTickets = project.supportTickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS"
  );
  if (unresolvedTickets.length > 0) {
    return {
      released: false,
      reason: `Terdapat ${unresolvedTickets.length} tiket pemeliharaan aktif yang belum selesai.`,
    };
  }

  const activeDisputes = project.disputes.filter(
    (d) => d.status === "OPEN" || d.status === "UNDER_REVIEW"
  );
  if (activeDisputes.length > 0) {
    return { released: false, reason: "Terdapat sengketa aktif yang sedang ditinjau Admin." };
  }

  // All release criteria satisfied!
  const retentionAmount = (project.serviceValue * 1000n) / 10000n; // 10%
  const successFee = (project.serviceValue * 500n) / 10000n; // 5%

  const escrowId = project.escrowTransaction?.id;
  if (!escrowId) {
    throw new Error("Escrow transaction tidak ditemukan untuk proyek ini.");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Release 10% warranty retention to Talent in ledger
    const retentionJournal = createWarrantyRetentionPayoutJournal({
      retentionAmount,
      reference: createPlatformReference(projectId, "RETENTION", 1),
    });
    await commitJournalTransaction(tx, escrowId, retentionJournal);

    // 2. Recognize final 5% Success Fee in ledger
    const successFeeJournal = createSuccessFeeJournal({
      successFee,
      reference: createPlatformReference(projectId, "SUCCESSFEE", 1),
    });
    await commitJournalTransaction(tx, escrowId, successFeeJournal);

    // 3. Mark WarrantyAgreement as COMPLETED
    await tx.warrantyAgreement.update({
      where: { projectId },
      data: { status: "COMPLETED" },
    });

    // 4. Mark Project as COMPLETED
    await tx.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" },
    });

    return {
      released: true,
      retentionAmount,
      successFee,
    };
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}
