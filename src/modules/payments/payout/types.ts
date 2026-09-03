import type { PayoutStatus, RefundStatus } from "@prisma/client";

/**
 * Interface consumed from Rafi's Delivery module upon milestone approval.
 * Sesuai TEAM_JOBDESCS.md:338
 */
export type ApprovedMilestoneRelease = {
  projectId: string;
  milestoneId: string;
  grossAmount: bigint;
  approvedAt: Date;
  approvedBy: string;
};

export type PayoutDetails = {
  id: string;
  projectId: string;
  milestoneId: string;
  milestoneTitle: string;
  amount: bigint;
  status: PayoutStatus;
  platformReference: string;
  externalReference?: string | null;
  createdAt: Date;
};

export type RefundCalculation = {
  projectId: string;
  serviceValue: bigint;
  completedMilestoneValue: bigint;
  uncompletedMilestoneValue: bigint;
  pendingPlatformFee: bigint;
  grossRefundable: bigint;
  transferCost: bigint;
  netRefund: bigint;
  costBearer: "UMKM" | "COCOKIN";
};
