"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import {
  executePayoutTransfer,
  executeRefundTransfer,
} from "@/src/modules/payments/payout";

export type PayoutActionState = {
  ok: boolean;
  message: string;
};

export async function executePayoutTransferAction(
  prevState: PayoutActionState | null,
  formData: FormData
): Promise<PayoutActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Finance/Admin yang memiliki otorisasi eksekusi payout." };
  }

  const payoutInstructionId = String(formData.get("payoutInstructionId"));
  const externalReference = String(formData.get("externalReference") || "");

  try {
    await executePayoutTransfer(
      payoutInstructionId,
      externalReference.trim() || undefined
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

  const projectId = String(formData.get("projectId"));
  const isPlatformFault = formData.get("isPlatformFault") === "true";
  const externalReference = String(formData.get("externalReference") || "");

  try {
    await executeRefundTransfer(
      projectId,
      isPlatformFault,
      externalReference.trim() || undefined
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
