"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import {
  executePayoutTransfer,
  executeRefundTransfer,
} from "@/src/modules/payments/payout";
import { z } from "zod";

export type PayoutActionState = {
  ok: boolean;
  message: string;
};

const payoutActionSchema = z.object({
  payoutInstructionId: z.string().min(1, "ID Instruksi Payout wajib diisi."),
  externalReference: z.string().optional(),
});

const refundActionSchema = z.object({
  projectId: z.string().min(1, "ID Proyek wajib diisi."),
  isPlatformFault: z.boolean().default(false),
  externalReference: z.string().optional(),
});

export async function executePayoutTransferAction(
  prevState: PayoutActionState | null,
  formData: FormData
): Promise<PayoutActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Finance/Admin yang memiliki otorisasi eksekusi payout." };
  }

  const rawId = formData.get("payoutInstructionId");
  const rawRef = formData.get("externalReference");

  const validation = payoutActionSchema.safeParse({
    payoutInstructionId: typeof rawId === "string" ? rawId : "",
    externalReference: typeof rawRef === "string" ? rawRef : undefined,
  });

  if (!validation.success) {
    return {
      ok: false,
      message: validation.error.issues[0]?.message || "Data transfer payout tidak valid.",
    };
  }

  const { payoutInstructionId, externalReference } = validation.data;

  try {
    await executePayoutTransfer(
      payoutInstructionId,
      externalReference?.trim() || undefined
    );

    revalidatePath("/admin");
    return { ok: true, message: "Transfer payout berhasil dieksekusi dan dicatat ke ledger!" };
  } catch (error: unknown) {
    console.error("[EXECUTE PAYOUT ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal mengeksekusi payout transfer.",
    };
  }
}

export async function executeRefundTransferAction(
  prevState: PayoutActionState | null,
  formData: FormData
): Promise<PayoutActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Finance/Admin yang memiliki otorisasi eksekusi refund." };
  }

  const rawProjectId = formData.get("projectId");
  const rawFault = formData.get("isPlatformFault");
  const rawRef = formData.get("externalReference");

  const validation = refundActionSchema.safeParse({
    projectId: typeof rawProjectId === "string" ? rawProjectId : "",
    isPlatformFault: rawFault === "true",
    externalReference: typeof rawRef === "string" ? rawRef : undefined,
  });

  if (!validation.success) {
    return {
      ok: false,
      message: validation.error.issues[0]?.message || "Data refund tidak valid.",
    };
  }

  const { projectId, isPlatformFault, externalReference } = validation.data;

  try {
    await executeRefundTransfer(
      projectId,
      isPlatformFault,
      externalReference?.trim() || undefined
    );

    revalidatePath("/admin");
    revalidatePath(`/business/projects/${projectId}`);
    return { ok: true, message: "Refund berhasil diproses ke UMKM dan dicatat ke ledger!" };
  } catch (error: unknown) {
    console.error("[EXECUTE REFUND ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal memproses refund transfer.",
    };
  }
}
