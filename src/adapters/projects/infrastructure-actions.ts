"use server";

import { getSession } from "@/src/lib/session";
import { submitHandover, reviewHandover } from "@/src/modules/infrastructure/infrastructure.service";
import { revalidatePath } from "next/cache";

export type HandoverActionState = {
  ok: boolean;
  message: string;
};

export async function submitHandoverAction(
  prevState: HandoverActionState | null,
  formData: FormData
): Promise<HandoverActionState> {
  const session = await getSession();

  if (!session || session.role !== "TALENT") {
    return { ok: false, message: "Hanya Talent yang dapat mensubmit handover." };
  }

  const projectId = String(formData.get("projectId"));
  const productionUrl = String(formData.get("productionUrl"));
  const domainConfigured = formData.get("domainConfigured") === "on";
  const httpsActive = formData.get("httpsActive") === "on";
  const sourceCodeTransferred = formData.get("sourceCodeTransferred") === "on";

  if (!productionUrl.startsWith("http")) {
    return { ok: false, message: "URL Produksi harus valid." };
  }

  try {
    await submitHandover(session.id, projectId, productionUrl, {
      domainConfigured,
      httpsActive,
      sourceCodeTransferred
    });
    
    revalidatePath(`/talent/projects/${projectId}/handover`);
    return { ok: true, message: "Handover berhasil disubmit untuk direview UMKM." };
  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Gagal submit handover." };
  }
}

export async function reviewHandoverAction(
  prevState: HandoverActionState | null,
  formData: FormData
): Promise<HandoverActionState> {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya UMKM yang dapat mereview handover." };
  }

  const projectId = String(formData.get("projectId"));
  const decision = String(formData.get("decision")) as "ACCEPTED" | "DISPUTED";

  try {
    await reviewHandover(session.id, projectId, decision);
    revalidatePath(`/business/projects/${projectId}/handover`);
    return { ok: true, message: `Handover berhasil di-${decision}.` };
  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: error instanceof Error && error.message || "Gagal memproses review." };
  }
}
