export type DisputeResolution = "FAVOR_TALENT" | "FAVOR_UMKM" | "SPLIT";

export type DisputeDecisionInput = {
  resolution: DisputeResolution;
  notes: string;
  talentSharePercent: number; // 0 - 100
  umkmSharePercent: number;   // 0 - 100
};

export type DisputeDetails = {
  id: string;
  projectId: string;
  reason: string;
  status: string;
  evidenceUrls: string[];
  createdAt: Date;
  decision?: {
    resolution: DisputeResolution;
    notes: string;
    talentSharePercent: number;
    umkmSharePercent: number;
    resolverId: string;
  };
};
