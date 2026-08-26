import type { EvidenceLevel } from "@/src/modules/matching/types";
import type {
  CareerDomainId,
  SkillPassportEntry,
  TalentSkillPassport,
} from "./types";

/**
 * Evidence level promotion order — PRD §3.1 FR-TAL-01.
 * SELF_DECLARED → ASSESSED → PROJECT_APPLIED → PROJECT_VERIFIED
 */
const EVIDENCE_RANK: Record<EvidenceLevel, number> = {
  SELF_DECLARED: 0,
  ASSESSED: 1,
  PROJECT_APPLIED: 2,
  PROJECT_VERIFIED: 3,
};

/** Evidence can only move forward, never backward. */
export function canPromote(
  current: EvidenceLevel,
  next: EvidenceLevel,
): boolean {
  return EVIDENCE_RANK[next] > EVIDENCE_RANK[current];
}

/** Promote a single entry. Returns new entry or unchanged if invalid transition. */
export function promoteEvidence(
  entry: SkillPassportEntry,
  to: EvidenceLevel,
): SkillPassportEntry {
  if (!canPromote(entry.evidenceLevel, to)) return entry;
  return { ...entry, evidenceLevel: to, lastUpdated: new Date().toISOString() };
}

/** Create an initial passport with all skills declared at SELF_DECLARED. */
export function createPassport(
  talentId: string,
  careerId: CareerDomainId,
  skillIds: { skillId: string; name: string }[],
): TalentSkillPassport {
  const now = new Date().toISOString();
  return {
    talentId,
    careerId,
    entries: skillIds.map((s) => ({
      skillId: s.skillId,
      name: s.name,
      evidenceLevel: "SELF_DECLARED" as EvidenceLevel,
      verifiedProjectCount: 0,
      lastUpdated: now,
    })),
  };
}

/** Mark skills as ASSESSED after completing career readiness assessment. */
export function markAssessed(
  passport: TalentSkillPassport,
  assessedSkillIds: string[],
  scores: Map<string, number>,
): TalentSkillPassport {
  const set = new Set(assessedSkillIds);
  return {
    ...passport,
    entries: passport.entries.map((e) => {
      if (!set.has(e.skillId)) return e;
      const promoted = promoteEvidence(e, "ASSESSED");
      return { ...promoted, assessedScore: scores.get(e.skillId) };
    }),
  };
}
