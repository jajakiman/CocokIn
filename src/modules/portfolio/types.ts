export type PortfolioVisibility = "PRIVATE" | "UNLISTED" | "PUBLIC";

export type PortfolioEntry = {
  id: string;
  projectId: string;
  talentId: string;
  businessName: string;
  businessAttributionApproved: boolean;
  talentPublicationConsentGranted: boolean;
  visibility: PortfolioVisibility;
  title: string;
  problemSummary: string;
  solutionSummary: string;
  appliedSkillIds: string[];
  completedAt: string; // ISO date
  stagingUrl: string;
  verifiedByUmkm: boolean;
  // Private / Internal fields
  serviceValue?: number;
  chatMessageCount?: number;
};

export type PublicPortfolioView = {
  id: string;
  title: string;
  businessName: string;
  problemSummary: string;
  solutionSummary: string;
  appliedSkillIds: string[];
  completedAt: string;
  stagingUrl: string;
  verifiedByUmkm: boolean;
};
