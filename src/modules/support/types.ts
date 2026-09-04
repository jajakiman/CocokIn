import type { WarrantyStatus } from "@prisma/client";

export type TicketSeverity = "CRITICAL" | "MAJOR" | "MINOR";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export type WarrantyAgreementDetails = {
  id: string;
  projectId: string;
  status: WarrantyStatus;
  startDate: Date | null;
  endDate: Date | null;
  daysRemaining: number;
  retentionAmount: bigint;
  ticketQuotaRemaining: number;
  openTicketsCount: number;
};

export type CreateTicketInput = {
  severity: TicketSeverity;
  description: string;
};

export type WarrantyReleaseResult =
  | { released: false; reason: string }
  | { released: true; retentionAmount: bigint; successFee: bigint };

