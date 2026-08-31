import { z } from "zod";

export const onboardingSkills = ["React", "Next.js", "UI/UX Design", "Figma", "Data Analysis", "Digital Marketing"] as const;

export const talentOnboardingSchema = z.object({
  university: z.string().trim().min(2, "Universitas atau institusi wajib diisi."),
  major: z.string().trim().min(2, "Jurusan atau bidang studi wajib diisi."),
  careerTarget: z.string().trim().min(2, "Target karier wajib diisi."),
  portfolioUrl: z.string().url("Masukkan URL portofolio yang valid.").optional().or(z.literal("")),
  hasNoPortfolio: z.boolean(),
  skills: z.array(z.enum(onboardingSkills)).min(1, "Pilih minimal satu keahlian.").max(6),
}).refine((value) => value.hasNoPortfolio || Boolean(value.portfolioUrl), {
  path: ["portfolioUrl"],
  message: "Tambahkan tautan portofolio atau pilih belum memiliki portofolio.",
});

export function isTalentOnboardingComplete(profile: {
  university: string | null;
  major: string | null;
  careerTarget: string | null;
  portfolioUrl: string | null;
  hasNoPortfolio: boolean;
  skillCount: number;
  onboardingCompletedAt: Date | null;
}) {
  return Boolean(
    profile.onboardingCompletedAt &&
    profile.university?.trim() &&
    profile.major?.trim() &&
    profile.careerTarget?.trim() &&
    (profile.portfolioUrl?.trim() || profile.hasNoPortfolio) &&
    profile.skillCount > 0
  );
}
