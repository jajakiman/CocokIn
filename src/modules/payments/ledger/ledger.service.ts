import type { Prisma } from "@prisma/client";
import type { LedgerAccount, JournalEntryDraft, EscrowBalanceSheet } from "./types";

/**
 * Validates that journal entries strictly form a balanced transaction.
 * Invariant: Sum of all amounts (Debit [+] and Credit [-]) must equal 0n.
 */
export function validateJournalBalance(entries: JournalEntryDraft[]): void {
  if (!entries || entries.length < 2) {
    throw new Error("Journal transaction must contain at least 2 entries.");
  }

  let sum = 0n;
  for (const entry of entries) {
    if (!entry.accountType) {
      throw new Error("Every journal entry must have an accountType.");
    }
    if (!entry.platformReference) {
      throw new Error("Every journal entry must have a platformReference.");
    }
    sum += entry.amount;
  }

  if (sum !== 0n) {
    throw new Error(
      `Unbalanced journal transaction: Net difference is ${sum.toString()} IDR. Debit must strictly equal Credit.`
    );
  }
}

/**
 * Factory: UMKM Deposit of Project Funds into Escrow.
 * - Debit CASH_AT_BANK: +(serviceValue + platformFee)
 * - Credit TALENT_PAYABLE: -(serviceValue)
 * - Credit COCOKIN_FEE_PENDING: -(platformFee)
 */
export function createFundingDepositJournal({
  serviceValue,
  platformFee,
  reference,
}: {
  serviceValue: bigint;
  platformFee: bigint;
  reference: string;
}): JournalEntryDraft[] {
  if (serviceValue <= 0n) throw new Error("Service value must be greater than zero");
  if (platformFee < 0n) throw new Error("Platform fee cannot be negative");

  const totalDeposit = serviceValue + platformFee;

  const entries: JournalEntryDraft[] = [
    {
      accountType: "CASH_AT_BANK",
      amount: totalDeposit,
      platformReference: reference,
    },
    {
      accountType: "TALENT_PAYABLE",
      amount: -serviceValue,
      platformReference: reference,
    },
    {
      accountType: "COCOKIN_FEE_PENDING",
      amount: -platformFee,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Factory: Project enters IN_PROGRESS -> Activation Fee (5%) is recognized as earned.
 * - Debit COCOKIN_FEE_PENDING: +(activationFee)
 * - Credit COCOKIN_FEE_EARNED: -(activationFee)
 */
export function createActivationFeeJournal({
  activationFee,
  reference,
}: {
  activationFee: bigint;
  reference: string;
}): JournalEntryDraft[] {
  if (activationFee <= 0n) throw new Error("Activation fee must be greater than zero");

  const entries: JournalEntryDraft[] = [
    {
      accountType: "COCOKIN_FEE_PENDING",
      amount: activationFee,
      platformReference: reference,
    },
    {
      accountType: "COCOKIN_FEE_EARNED",
      amount: -activationFee,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Factory: UMKM approves milestone -> Immediate Payout (90%) transferred to Talent.
 * - Debit TALENT_PAYABLE: +(immediatePayout)
 * - Credit CASH_AT_BANK: -(immediatePayout)
 */
export function createMilestonePayoutJournal({
  immediatePayout,
  reference,
}: {
  immediatePayout: bigint;
  reference: string;
}): JournalEntryDraft[] {
  if (immediatePayout <= 0n) throw new Error("Payout amount must be greater than zero");

  const entries: JournalEntryDraft[] = [
    {
      accountType: "TALENT_PAYABLE",
      amount: immediatePayout,
      platformReference: reference,
    },
    {
      accountType: "CASH_AT_BANK",
      amount: -immediatePayout,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Factory: Handover completed -> Success Fee (5%) is recognized as earned.
 * - Debit COCOKIN_FEE_PENDING: +(successFee)
 * - Credit COCOKIN_FEE_EARNED: -(successFee)
 */
export function createSuccessFeeJournal({
  successFee,
  reference,
}: {
  successFee: bigint;
  reference: string;
}): JournalEntryDraft[] {
  if (successFee <= 0n) throw new Error("Success fee must be greater than zero");

  const entries: JournalEntryDraft[] = [
    {
      accountType: "COCOKIN_FEE_PENDING",
      amount: successFee,
      platformReference: reference,
    },
    {
      accountType: "COCOKIN_FEE_EARNED",
      amount: -successFee,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Factory: 30-day warranty expires without unresolved dispute -> 10% retention paid to Talent.
 * - Debit TALENT_PAYABLE: +(retentionAmount)
 * - Credit CASH_AT_BANK: -(retentionAmount)
 */
export function createWarrantyRetentionPayoutJournal({
  retentionAmount,
  reference,
}: {
  retentionAmount: bigint;
  reference: string;
}): JournalEntryDraft[] {
  if (retentionAmount <= 0n) throw new Error("Retention amount must be greater than zero");

  const entries: JournalEntryDraft[] = [
    {
      accountType: "TALENT_PAYABLE",
      amount: retentionAmount,
      platformReference: reference,
    },
    {
      accountType: "CASH_AT_BANK",
      amount: -retentionAmount,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Factory: Project cancellation / dispute refund to UMKM.
 * - Debit TALENT_PAYABLE / UMKM_REFUNDABLE: +(refundAmount)
 * - Credit CASH_AT_BANK: -(refundAmount)
 */
export function createRefundJournal({
  refundAmount,
  sourceAccount = "TALENT_PAYABLE",
  reference,
}: {
  refundAmount: bigint;
  sourceAccount?: "TALENT_PAYABLE" | "UMKM_REFUNDABLE";
  reference: string;
}): JournalEntryDraft[] {
  if (refundAmount <= 0n) throw new Error("Refund amount must be greater than zero");

  const entries: JournalEntryDraft[] = [
    {
      accountType: sourceAccount,
      amount: refundAmount,
      platformReference: reference,
    },
    {
      accountType: "CASH_AT_BANK",
      amount: -refundAmount,
      platformReference: reference,
    },
  ];

  validateJournalBalance(entries);
  return entries;
}

/**
 * Calculates current balance sheet and validates 100% Liability Reserve Invariant.
 * 
 * Invariant formula:
 * Required Cash Coverage = Talent Payable + UMKM Refundable + CocokIn Fee Pending
 * Restricted Cash >= Required Cash Coverage (Coverage ratio >= 100%)
 */
export function calculateBalanceSheet(
  entries: Array<{ accountType: string; amount: bigint }>
): EscrowBalanceSheet {
  let cashAtBank = 0n;
  let talentPayableSigned = 0n;
  let umkmRefundableSigned = 0n;
  let feePendingSigned = 0n;
  let feeEarnedSigned = 0n;
  let collectionCost = 0n;
  let payoutCost = 0n;
  let refundCost = 0n;

  for (const entry of entries) {
    switch (entry.accountType) {
      case "CASH_AT_BANK":
        cashAtBank += entry.amount;
        break;
      case "TALENT_PAYABLE":
        talentPayableSigned += entry.amount;
        break;
      case "UMKM_REFUNDABLE":
        umkmRefundableSigned += entry.amount;
        break;
      case "COCOKIN_FEE_PENDING":
        feePendingSigned += entry.amount;
        break;
      case "COCOKIN_FEE_EARNED":
        feeEarnedSigned += entry.amount;
        break;
      case "COLLECTION_COST":
        collectionCost += entry.amount;
        break;
      case "PAYOUT_COST":
        payoutCost += entry.amount;
        break;
      case "REFUND_COST":
        refundCost += entry.amount;
        break;
    }
  }

  // Liabilities and Revenues increase with Credit (-), so outstanding liability balance is -signedSum
  const talentPayable = -talentPayableSigned;
  const umkmRefundable = -umkmRefundableSigned;
  const feePending = -feePendingSigned;
  const feeEarned = -feeEarnedSigned;

  // Required coverage = sum of outstanding user liabilities and pending unearned fees
  const requiredReserve =
    (talentPayable > 0n ? talentPayable : 0n) +
    (umkmRefundable > 0n ? umkmRefundable : 0n) +
    (feePending > 0n ? feePending : 0n);

  const isHealthy = cashAtBank >= requiredReserve;
  const reserveDeficit = isHealthy ? 0n : requiredReserve - cashAtBank;

  const coverageRatioPercent =
    requiredReserve === 0n
      ? 100
      : Number((cashAtBank * 10000n) / requiredReserve) / 100;

  return {
    cashAtBank,
    talentPayable,
    umkmRefundable,
    feePending,
    feeEarned,
    collectionCost,
    payoutCost,
    refundCost,
    requiredReserve,
    isHealthy,
    coverageRatioPercent,
    reserveDeficit,
  };
}

/**
 * Commits a balanced journal transaction into PostgreSQL via Prisma within an existing transaction.
 * Strictly verifies the 100% Liability Reserve invariant before committing.
 */
export async function commitJournalTransaction(
  tx: Prisma.TransactionClient,
  escrowTransactionId: string,
  entries: JournalEntryDraft[]
): Promise<EscrowBalanceSheet> {
  validateJournalBalance(entries);

  // Fetch existing ledger entries to check cumulative state
  const existingEntries = await tx.ledgerEntry.findMany({
    where: { escrowTransactionId },
    select: { accountType: true, amount: true },
  });

  const projectedEntries = [
    ...existingEntries,
    ...entries.map((e) => ({ accountType: e.accountType, amount: e.amount })),
  ];

  const balanceSheet = calculateBalanceSheet(projectedEntries);

  if (!balanceSheet.isHealthy) {
    throw new Error(
      `100% Reserve Invariant Violated! Required: ${balanceSheet.requiredReserve.toString()} IDR, Available Cash: ${balanceSheet.cashAtBank.toString()} IDR. Deficit: ${balanceSheet.reserveDeficit.toString()} IDR.`
    );
  }

  // Append immutable ledger records
  await tx.ledgerEntry.createMany({
    data: entries.map((e) => ({
      escrowTransactionId,
      accountType: e.accountType,
      amount: e.amount,
      platformReference: e.platformReference,
    })),
  });

  return balanceSheet;
}
