"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import { resolveDispute } from "@/src/modules/disputes";
import type { DisputeResolution } from "@/src/modules/disputes/types";

export type DisputeActionState = {
  ok: boolean;
  message: string;
};

export async function resolveDisputeAction(
  prevState: DisputeActionState | null,
  formData: FormData
): Promise<DisputeActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Admin yang memiliki kewenangan menyelesaikan sengketa." };
  }

  const disputeId = String(formData.get("disputeId"));
  const resolution = String(formData.get("resolution")) as DisputeResolution;
  const notes = String(formData.get("notes") || "");
  const talentSharePercent = Number(formData.get("talentSharePercent") || "50");
  const umkmSharePercent = Number(formData.get("umkmSharePercent") || "50");

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
