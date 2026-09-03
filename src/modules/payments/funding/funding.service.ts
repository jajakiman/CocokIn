import { prisma } from "@/src/adapters/database/prisma";
import { calculateProjectFinancials, createPlatformReference } from "@/src/lib/money";
import {
  createFundingDepositJournal,
  createActivationFeeJournal,
  commitJournalTransaction,
} from "@/src/modules/payments/ledger";
import type {
  PaymentMethod,
  SupportedBank,
  FundingInstructionDetails,
  ProofSubmissionInput,
  ReconciliationDecision,
} from "./types";

/**
 * Returns deterministic Virtual Account number for simulated banks.
 */
function getSimulatedAccountNumber(bank: SupportedBank, projectId: string): string {
  const bankPrefixes: Record<SupportedBank, string> = {
    BCA: "88012",
    MANDIRI: "89012",
    BRI: "88812",
    BNI: "82012",
  };
  const projectNumeric = projectId.replace(/\D/g, "").slice(-8).padStart(8, "12345678");
  return `${bankPrefixes[bank]}${projectNumeric}`;
}

/**
 * Generates or retrieves existing funding instruction for a project.
 */
export async function getOrCreateFundingInstruction(
  projectId: string,
  method: PaymentMethod = "BANK_TRANSFER",
  bankName: SupportedBank = "BCA"
): Promise<FundingInstructionDetails> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { fundingReceipt: true },
  });

  if (!project) {
    throw new Error("Proyek tidak ditemukan.");
  }

  const financials = calculateProjectFinancials(project.serviceValue);
  const platformRef =
    project.fundingReceipt?.platformReference ||
    createPlatformReference(project.id, "FUNDING", 1);

  let receipt = project.fundingReceipt;

  if (!receipt) {
    receipt = await prisma.fundingReceipt.create({
      data: {
        projectId: project.id,
        status: "AWAITING_PAYMENT",
        amountDue: financials.fundingDue,
        platformReference: platformRef,
      },
    });
  }

  const accountNumber = method === "BANK_TRANSFER"
    ? getSimulatedAccountNumber(bankName, project.id)
    : undefined;

  const qrisPayload = method === "QRIS"
    ? `00020101021226600016ID.CO.COCOKIN.WWW011893600999${platformRef}520458125303360540${financials.fundingDue.toString()}5802ID5914PT COCOKIN IND6007JAKARTA6304`
    : undefined;

  // 24-hour payment window
  const expiresAt = new Date(receipt.createdAt.getTime() + 24 * 60 * 60 * 1000);

  return {
    projectId: project.id,
    projectTitle: project.title,
    serviceValue: financials.serviceValue,
    activationFee: financials.activationFee,
    successFee: financials.successFee,
    totalPlatformFee: financials.totalPlatformFee,
    fundingDue: financials.fundingDue,
    status: receipt.status,
    platformReference: platformRef,
    paymentMethod: method,
    bankName: method === "BANK_TRANSFER" ? bankName : undefined,
    accountNumber,
    accountHolder: "PT COCOKIN TEKNOLOGI INDONESIA",
    qrisCodePayload: qrisPayload,
    expiresAt,
  };
}

/**
 * Handles UMKM proof submission for project funding.
 * Transitions status: AWAITING_PAYMENT -> PROOF_SUBMITTED
 */
export async function submitFundingProof(
  businessUserId: string,
  projectId: string,
  proof: ProofSubmissionInput
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { businessProfile: true, fundingReceipt: true },
  });

  if (!project || project.businessProfile.userId !== businessUserId) {
    throw new Error("Akses ditolak atau proyek tidak ditemukan.");
  }

  if (!project.fundingReceipt) {
    throw new Error("Instruksi pembayaran belum dibuat.");
  }

  if (project.fundingReceipt.status === "FUNDED") {
    throw new Error("Proyek sudah didanai sebelumnya.");
  }

  return prisma.$transaction(async (tx) => {
    const updatedReceipt = await tx.fundingReceipt.update({
      where: { projectId },
      data: {
        status: "PROOF_SUBMITTED",
        amountReceived: proof.amountTransferred,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: { status: "FUNDING_PENDING" },
    });

    return updatedReceipt;
  });
}

/**
 * Finance Reconciliation Desk: Verifies that funds have reached bank account.
 * When approved:
 * 1. Checks amountReceived matches or exceeds amountDue.
 * 2. Creates EscrowTransaction and writes balanced Funding Deposit Journal.
 * 3. Transitions project to IN_PROGRESS.
 * 4. Recognizes 5% Activation Fee in the ledger.
 * 5. Updates FundingReceipt status to FUNDED.
 */
export async function reconcileFundingDeposit(
  projectId: string,
  decision: ReconciliationDecision
) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      fundingReceipt: true,
      escrowTransaction: true,
    },
  });

  if (!project || !project.fundingReceipt) {
    throw new Error("Data pendanaan proyek tidak ditemukan.");
  }

  const receipt = project.fundingReceipt;

  if (receipt.status === "FUNDED") {
    throw new Error("Pendanaan proyek ini sudah selesai direkonsiliasi sebelumnya.");
  }

  const financials = calculateProjectFinancials(project.serviceValue);
  const amountReceived = decision.amountReceived ?? receipt.amountReceived ?? financials.fundingDue;

  return prisma.$transaction(async (tx) => {
    // Check if decision is rejection or amount mismatch
    if (!decision.approved) {
      return await tx.fundingReceipt.update({
        where: { projectId },
        data: { status: "CANCELLED" },
      });
    }

    if (amountReceived < receipt.amountDue) {
      return await tx.fundingReceipt.update({
        where: { projectId },
        data: {
          status: "AMOUNT_MISMATCH",
          amountReceived,
        },
      });
    }

    const externalRef =
      decision.externalReference ||
      `SIM-BANK-${receipt.platformReference?.replace("CCK-", "") || Date.now()}`;

    // 1. Create or ensure EscrowTransaction
    let escrow = project.escrowTransaction;
    if (!escrow) {
      escrow = await tx.escrowTransaction.create({
        data: { projectId },
      });
    }

    // 2. Commit Funding Deposit Journal to Ledger
    const depositRef = receipt.platformReference || createPlatformReference(project.id, "FUNDING", 1);
    const depositJournal = createFundingDepositJournal({
      serviceValue: financials.serviceValue,
      platformFee: financials.totalPlatformFee,
      reference: depositRef,
    });
    await commitJournalTransaction(tx, escrow.id, depositJournal);

    // 3. Commit Activation Fee (5%) Recognition Journal to Ledger
    const activationRef = createPlatformReference(project.id, "ACTIVATION", 1);
    const activationJournal = createActivationFeeJournal({
      activationFee: financials.activationFee,
      reference: activationRef,
    });
    await commitJournalTransaction(tx, escrow.id, activationJournal);

    // 4. Update Project Status to IN_PROGRESS
    await tx.project.update({
      where: { id: projectId },
      data: { status: "IN_PROGRESS" },
    });

    // 5. Update FundingReceipt to FUNDED
    const updatedReceipt = await tx.fundingReceipt.update({
      where: { projectId },
      data: {
        status: "FUNDED",
        amountReceived,
        externalReference: externalRef,
      },
    });

    return updatedReceipt;
  }, {
    maxWait: 10000,
    timeout: 20000,
  });
}

/**
 * Developer/Demo Convenience: Simulates instant funding success in one step.
 */
export async function simulateInstantFundingSuccess(businessUserId: string, projectId: string) {
  const instruction = await getOrCreateFundingInstruction(projectId);
  await submitFundingProof(businessUserId, projectId, {
    senderBank: "BCA",
    senderAccount: "0123456789",
    senderName: "Demo Business Owner",
    amountTransferred: instruction.fundingDue,
  });

  return await reconcileFundingDeposit(projectId, {
    approved: true,
    amountReceived: instruction.fundingDue,
    externalReference: `SIM-INSTANT-${Date.now()}`,
  });
}
