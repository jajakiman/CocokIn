import { z } from "zod";

export const milestoneSchema = z.object({
  title: z.string().min(5, "Judul milestone minimal 5 karakter"),
  weightBps: z.number().min(1, "Bobot harus lebih dari 0").max(10000, "Maksimal 100%"), // 10000 = 100%
  deadline: z.string().or(z.date()),
  acceptanceCriteria: z.array(z.string().min(5)).min(1, "Minimal 1 acceptance criterion"),
});

export const createProjectSchema = z.object({
  title: z.string().min(10, "Judul proyek minimal 10 karakter"),
  scope: z.string().min(20, "Deskripsi scope minimal 20 karakter"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  infrastructureNeed: z.enum(["STAGING_ONLY", "MANAGED_HOSTING", "SHARED_HOSTING", "VPS", "EXISTING_INFRASTRUCTURE"]),
  estimatedDays: z.number().min(1, "Minimal 1 hari"),
  deadline: z.string().or(z.date()),
  serviceValue: z.number().min(100000, "Nilai minimal Rp 100.000"),
  skills: z.array(z.string()).min(1, "Pilih minimal 1 keahlian"),
  milestones: z.array(milestoneSchema)
    .min(1, "Minimal 1 milestone")
    .max(4, "Maksimal 4 milestone")
    .refine((milestones) => {
      const totalWeight = milestones.reduce((sum, m) => sum + m.weightBps, 0);
      return totalWeight === 10000;
    }, "Total bobot seluruh milestone harus persis 100%"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
