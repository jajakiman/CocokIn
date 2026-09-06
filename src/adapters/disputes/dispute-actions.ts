"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import { resolveDispute } from "@/src/modules/disputes";
import { z } from "zod";

export type DisputeActionState = {
  ok: boolean;
  message: string;
};

const resolveDisputeSchema = z.object({
  disputeId: z.string().min(1, "ID Sengketa wajib diisi."),
  resolution: z.enum(["FAVOR_TALENT", "FAVOR_UMKM", "SPLIT"], {
    message: "Jenis putusan sengketa tidak valid.",
  }),
  notes: z.string().trim().min(3, "Catatan pertimbangan putusan wajib diisi minimal 3 karakter."),
  talentSharePercent: z.number().min(0).max(100).optional(),
  umkmSharePercent: z.number().min(0).max(100).optional(),
});

export async function resolveDisputeAction(
  prevState: DisputeActionState | null,
  formData: FormData
): Promise<DisputeActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Admin yang memiliki kewenangan menyelesaikan sengketa." };
  }

  const rawDisputeId = formData.get("disputeId");
  const rawResolution = formData.get("resolution");
  const rawNotes = formData.get("notes");
  const rawTalentShare = formData.get("talentSharePercent");
  const rawUmkmShare = formData.get("umkmSharePercent");

  const parseResult = resolveDisputeSchema.safeParse({
    disputeId: typeof rawDisputeId === "string" ? rawDisputeId : "",
    resolution: rawResolution,
    notes: typeof rawNotes === "string" ? rawNotes : "",
    talentSharePercent: rawTalentShare ? Number(rawTalentShare) : undefined,
    umkmSharePercent: rawUmkmShare ? Number(rawUmkmShare) : undefined,
  });

  if (!parseResult.success) {
    return {
      ok: false,
      message: parseResult.error.issues[0]?.message || "Data formulir sengketa tidak valid.",
    };
  }

  const { disputeId, resolution, notes } = parseResult.data;

  // Auto-calculate deterministic shares based on resolution type
  let talentSharePercent = 50;
  let umkmSharePercent = 50;

  if (resolution === "FAVOR_TALENT") {
    talentSharePercent = 100;
    umkmSharePercent = 0;
  } else if (resolution === "FAVOR_UMKM") {
    talentSharePercent = 0;
    umkmSharePercent = 100;
  } else if (resolution === "SPLIT") {
    const customTalent = parseResult.data.talentSharePercent;
    const customUmkm = parseResult.data.umkmSharePercent;

    if (typeof customTalent === "number" && typeof customUmkm === "number") {
      talentSharePercent = customTalent;
      umkmSharePercent = customUmkm;
    } else if (typeof customTalent === "number") {
      talentSharePercent = customTalent;
      umkmSharePercent = 100 - customTalent;
    } else if (typeof customUmkm === "number") {
      umkmSharePercent = customUmkm;
      talentSharePercent = 100 - customUmkm;
    } else {
      // Default 50/50 split
      talentSharePercent = 50;
      umkmSharePercent = 50;
    }
  }

  try {
    await resolveDispute(session.id, disputeId, {
      resolution,
      notes,
      talentSharePercent,
      umkmSharePercent,
    });

    revalidatePath("/admin");
    return { ok: true, message: "Putusan sengketa berhasil diterapkan dan jurnal kompensasi dicatat ke buku besar!" };
  } catch (error: unknown) {
    console.error("[RESOLVE DISPUTE ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal menyelesaikan sengketa.",
    };
  }
}
