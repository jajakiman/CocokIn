import type { Project, TalentProfile, TalentSkill, ProjectSkill, Skill } from "@prisma/client";

type ProjectWithSkills = Project & {
  skills: (ProjectSkill & { skill: Skill })[];
};

type TalentProfileWithSkills = TalentProfile & {
  skills: (TalentSkill & { skill: Skill })[];
};

export function calculateCocokScore(
  talent: TalentProfileWithSkills,
  project: ProjectWithSkills
): {
  cocokScore: number;
  skillMatchScore: number;
  careerAlignmentScore: number;
  availabilityScore: number;
  experienceScore: number;
  preferenceScore: number;
  explainableText: string;
} {
  // 1. Get required skills from project
  const requiredSkills = project.skills.map((ps) => ps.skill.name.toLowerCase());
  
  if (requiredSkills.length === 0) {
    return {
      cocokScore: 100, // No skills required, perfect match by default
      skillMatchScore: 100,
      careerAlignmentScore: 100,
      availabilityScore: 100,
      experienceScore: 100,
      preferenceScore: 100,
      explainableText: "Proyek tidak memerlukan keahlian spesifik. Anda memiliki peluang sangat besar!",
    };
  }

  // 2. Check talent skills overlap
  const talentSkills = talent.skills.map((ts) => ts.skill.name.toLowerCase());
  
  let matchCount = 0;
  for (const reqSkill of requiredSkills) {
    if (talentSkills.includes(reqSkill)) {
      matchCount++;
    }
  }

  // 3. Simplified scoring logic
  const percentage = Math.round((matchCount / requiredSkills.length) * 100);

  let explainableText = `Anda memiliki ${matchCount} dari ${requiredSkills.length} keahlian yang dibutuhkan.`;
  
  if (percentage >= 80) {
    explainableText += " Keahlian Anda sangat relevan dengan proyek ini!";
  } else if (percentage >= 50) {
    explainableText += " Anda bisa mengambil proyek ini untuk melengkapi portofolio Anda.";
  } else {
    explainableText += " Mungkin proyek ini sedikit di atas tingkat keahlian Anda saat ini, tetapi tidak ada salahnya mencoba!";
  }

  return {
    cocokScore: percentage,
    skillMatchScore: percentage,
    careerAlignmentScore: percentage,
    availabilityScore: percentage,
    experienceScore: percentage,
    preferenceScore: percentage,
    explainableText,
  };
}
