import type {
  MatchingFactors,
  ProjectMatchRequirement,
  TalentMatchProfile,
} from "./types";

export function explainMatch(
  talent: TalentMatchProfile,
  project: ProjectMatchRequirement,
  factors: MatchingFactors,
): { reasons: string[]; gaps: string[] } {
  const reasons: string[] = [];
  const gaps: string[] = [];

  // Skill reasons and gaps
  const talentSkillMap = new Map<string, { name: string; level: string }>();
  for (const s of talent.skills) {
    talentSkillMap.set(s.skillId.toLowerCase(), { name: s.name, level: s.level });
  }

  const missingSkills: string[] = [];

  for (const req of project.requiredSkills) {
    const matched = talentSkillMap.get(req.skillId.toLowerCase());
    if (matched) {
      if (matched.level === "PROJECT_VERIFIED") {
        reasons.push(`Skill ${matched.name} terverifikasi dari proyek sebelumnya.`);
      } else if (matched.level === "ASSESSED") {
        reasons.push(`Skill ${matched.name} teruji lewat asesmen platform.`);
      }
    } else {
      missingSkills.push(req.name);
    }
  }

  if (missingSkills.length > 0) {
    gaps.push(`Belum menguasai skill wajib: ${missingSkills.join(", ")}.`);
  }

  // Career alignment reason
  if (
    talent.targetCareerId &&
    project.targetCareerId &&
    talent.targetCareerId.toLowerCase() === project.targetCareerId.toLowerCase()
  ) {
    reasons.push("Proyek ini selaras dengan target karier Anda.");
  }

  // Major skill gap closure reason
  if (talent.majorSkillGapIds && talent.majorSkillGapIds.length > 0) {
    const gapSkillNames = talent.majorSkillGapIds
      .map((gapId) => project.requiredSkills.find((s) => s.skillId.toLowerCase() === gapId.toLowerCase())?.name)
      .filter((name): name is string => Boolean(name));

    if (gapSkillNames.length > 0) {
      reasons.push(
        `Proyek ini membantu menutup skill gap Anda pada: ${gapSkillNames.join(", ")}.`,
      );
    }
  }

  // Experience reason
  if (factors.experience >= 100) {
    reasons.push("Tingkat pengalaman Anda sangat sesuai dengan kompleksitas proyek.");
  } else if (factors.experience < 60) {
    gaps.push("Tingkat kesulitan proyek mungkin lebih tinggi daripada pengalaman Anda saat ini.");
  }

  // Work mode reason or gap
  if (factors.workMode === 0) {
    gaps.push("Mode kerja onsite tidak sesuai dengan lokasi Anda saat ini.");
  } else if (factors.workMode === 50) {
    gaps.push("Mode kerja hybrid memerlukan kehadiran sebagian di lokasi yang berbeda dari kota Anda.");
  }

  return { reasons, gaps };
}
