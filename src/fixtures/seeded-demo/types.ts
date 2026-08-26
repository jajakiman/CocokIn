import type {
  AvailabilityType,
  ProjectMatchRequirement,
  WorkMode,
} from "@/src/modules/matching/types";
import type { PortfolioEntry } from "@/src/modules/portfolio/types";
import type {
  CareerDomainId,
  SkillAssessmentScore,
  SkillPassportEntry,
  TalentSkillPassport,
} from "@/src/modules/talent/types";

export type SeedMetadata = {
  source: "SEEDED_DEMO";
  synthetic: true;
};

export type SeededRecord<T extends object> = T & SeedMetadata;

export type SeedDisplayOnly = {
  displayOnly: true;
};

export type SeedIdentity = {
  id: string;
  role: "TALENT" | "BUSINESS";
  displayName: string;
  email: string;
};

export type SeedConsentDisplay = {
  termsAndPrivacy: boolean;
  publicPortfolio: boolean;
  marketingResearch: boolean;
  displayOnly: true;
};

export type SeedTalentProfile = {
  id: string;
  name: string;
  university: string;
  major: string;
  graduationYear: string;
  bio: string;
  targetCareerId: CareerDomainId;
  availability: AvailabilityType;
  workModePreference: WorkMode;
  city: string;
  externalLinks: {
    github?: string;
    linkedin?: string;
    figma?: string;
    portfolio?: string;
  };
  consents: SeedConsentDisplay;
  completedProjectsCount: number;
  skillScores: SkillAssessmentScore[];
  passportEntries: SkillPassportEntry[];
  displayOnly: true;
};

export type SeedTalentPassport = TalentSkillPassport & {
  id: string;
};

export type SeedBusinessProfile = {
  id: string;
  name: string;
  category: string;
  city: string;
  description: string;
  verificationStatus: "UNVERIFIED" | "BASIC_VERIFIED" | "VERIFIED_BUSINESS";
  readinessScore: number;
};

export type SeedProject = {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  project: ProjectMatchRequirement;
};

export type SeedPortfolioEntry = SeededRecord<PortfolioEntry & SeedDisplayOnly>;

export type SeedWorkspaceMilestone = {
  id: string;
  order: number;
  title: string;
  weight: number;
  status: "APPROVED" | "READY_FOR_REVIEW" | "IN_PROGRESS" | "PENDING";
  deliverableSummary: string;
  submittedUrl?: string;
};

export type SeedWorkspace = {
  id: string;
  title: string;
  businessId: string;
  businessName: string;
  serviceValue: number;
  status: "IN_PROGRESS";
  durationDays: number;
  remainingDays: number;
  milestones: SeedWorkspaceMilestone[];
};

export const SEED_METADATA: SeedMetadata = {
  source: "SEEDED_DEMO",
  synthetic: true,
};

export function cloneSeed<T>(value: T): T {
  return structuredClone(value);
}
