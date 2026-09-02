import { z } from "zod";

import { CAREER_TAXONOMY } from "./career-taxonomy";

export const careerTargets = [
  "Frontend Developer",
  "UI/UX Designer",
  "Data Analyst",
  "Digital Marketer",
] as const;

export function normalizeSkillName(value: string) {
  const compact = value.trim().replace(/\s+/g, " ");
  const canonical = Object.values(CAREER_TAXONOMY)
    .flatMap((career) => career.technicalSkills)
    .find((skill) => skill.name.toLowerCase() === compact.toLowerCase());
  return canonical?.name ?? compact.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
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
  name: z.string().trim().min(2, "Nama lengkap wajib diisi.").max(100),
  bio: z.string().trim().max(500).optional().default(""),
  university: z.string().trim().min(2, "Universitas wajib diisi.").max(120),
  major: z.string().trim().min(2, "Jurusan wajib diisi.").max(120),
  careerTarget: z.enum(careerTargets),
  workModePreference: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
  timeAvailability: z.enum(["FULL_TIME", "PART_TIME", "WEEKEND"]),
});
