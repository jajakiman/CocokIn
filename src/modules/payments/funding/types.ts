import type { FundingStatus } from "@prisma/client";

export type PaymentMethod = "BANK_TRANSFER" | "QRIS";
export type SupportedBank = "BCA" | "MANDIRI" | "BRI" | "BNI";

export type FundingInstructionDetails = {
  projectId: string;
  projectTitle: string;
  serviceValue: bigint;
  activationFee: bigint;
  successFee: bigint;
  totalPlatformFee: bigint;
  fundingDue: bigint;
  status: FundingStatus;
  platformReference: string;
  paymentMethod: PaymentMethod;
  bankName?: SupportedBank;
  accountNumber?: string;
  accountHolder?: string;
  qrisCodePayload?: string;
  expiresAt: Date;
};

export type ProofSubmissionInput = {
  paymentMethod?: PaymentMethod;
  destinationBank?: SupportedBank;
  senderBank?: string;
  senderAccount?: string;
  senderName: string;
  paymentReference?: string;
  amountTransferred: bigint;
  proofFileUrl?: string;
};

export type ReconciliationDecision = {
  approved: boolean;
  amountReceived?: bigint;
  externalReference?: string;
  notes?: string;
};
