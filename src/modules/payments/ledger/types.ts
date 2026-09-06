/**
 * Ledger Account Types and Journal Data Contracts
 * Sesuai DATA_STATE_MODEL.md & ADR-0003
 */

export type LedgerAccount =
  | "CASH_AT_BANK"
  | "TALENT_PAYABLE"
  | "UMKM_REFUNDABLE"
  | "COCOKIN_FEE_PENDING"
  | "COCOKIN_FEE_EARNED"
  | "COLLECTION_COST"
  | "PAYOUT_COST"
  | "REFUND_COST";

export type JournalEntryDraft = {
  accountType: LedgerAccount;
  amount: bigint; // Positive (+) for Debit, Negative (-) for Credit
  platformReference: string;
};

export type EscrowBalanceSheet = {
  cashAtBank: bigint;
  talentPayable: bigint;
  umkmRefundable: bigint;
  feePending: bigint;
  feeEarned: bigint;
  collectionCost: bigint;
  payoutCost: bigint;
  refundCost: bigint;
  
  // 100% Liability Reserve Metrics
  requiredReserve: bigint;
  isHealthy: boolean;
  coverageRatioPercent: number;
  reserveDeficit: bigint;
};
