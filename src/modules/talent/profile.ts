import { z } from "zod";

import { CAREER_TAXONOMY } from "./career-taxonomy";

export const careerTargets = [
  "Fullstack Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Digital Marketer",
] as const;

// Canonical aliases for common skill spellings outside the taxonomy (dotted acronyms etc.)
const CANONICAL_SKILL_ALIASES = ["Next.js", "Node.js", "Vue.js"];

export function normalizeSkillName(value: string) {
  const compact = value.trim().replace(/\s+/g, " ");
  const candidates = [
    ...Object.values(CAREER_TAXONOMY).flatMap((career) => career.technicalSkills).map((s) => s.name),
    ...CANONICAL_SKILL_ALIASES,
  ];
  const canonical = candidates.find((name) => name.toLowerCase() === compact.toLowerCase());
  return canonical ?? compact.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export const claimSkillSchema = z.object({
  skillName: z.string().transform(normalizeSkillName).pipe(
    z.string().min(1, "Nama keahlian wajib diisi.").max(60, "Nama keahlian maksimal 60 karakter."),
  ),
});

export const removeSkillSchema = z.object({
  talentSkillId: z.string().min(1),
});

export const talentProfileSchema = z.object({
  firstName: z.string().trim().min(1, "Nama depan wajib diisi.").max(50),
  lastName: z.string().trim().min(1, "Nama belakang wajib diisi.").max(50),
  bio: z.string().trim().max(500).optional().default(""),
  university: z.string().trim().min(2, "Universitas wajib diisi.").max(120),
  major: z.string().trim().min(2, "Jurusan wajib diisi.").max(120),
  careerTarget: z.enum(careerTargets),
});
