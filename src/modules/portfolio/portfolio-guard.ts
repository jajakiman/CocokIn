import type { PortfolioEntry, PublicPortfolioView } from "./types";

/**
 * Portfolio Publication Guard — PRD §3.1 FR-TAL-04 & BR-CONSENT.
 * Proyek selesai hanya membuat draf privat.
 * Publikasi mensyaratkan Talent Consent AND UMKM Attribution Approval.
 */
export function canPublishPortfolio(entry: PortfolioEntry): boolean {
  return (
    entry.talentPublicationConsentGranted === true &&
    entry.businessAttributionApproved === true
  );
}

/**
 * Sanitizes public portfolio view: strips financial and private communication data.
 */
export function sanitizePublicPortfolio(
  entry: PortfolioEntry,
): PublicPortfolioView {
  return {
    id: entry.id,
    title: entry.title,
    businessName: entry.businessName,
    problemSummary: entry.problemSummary,
    solutionSummary: entry.solutionSummary,
    appliedSkillIds: entry.appliedSkillIds,
    completedAt: entry.completedAt,
    stagingUrl: entry.stagingUrl,
    verifiedByUmkm: entry.verifiedByUmkm,
  };
}
