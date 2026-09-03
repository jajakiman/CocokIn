"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import {
  submitFundingProof,
  reconcileFundingDeposit,
  simulateInstantFundingSuccess,
} from "@/src/modules/payments/funding";

export type FundingActionState = {
  ok: boolean;
  message: string;
};

export async function submitPaymentProofAction(
  prevState: FundingActionState | null,
  formData: FormData
): Promise<FundingActionState> {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya akun Bisnis/UMKM yang dapat mengirim bukti transfer." };
  }

  const projectId = String(formData.get("projectId"));
  const senderBank = String(formData.get("senderBank") || "BCA");
  const senderAccount = String(formData.get("senderAccount") || "");
  const senderName = String(formData.get("senderName") || "");
  const amountTransferred = BigInt(String(formData.get("amountTransferred") || "0"));

  if (!senderAccount.trim()) {
    return { ok: false, message: "Nomor rekening pengirim wajib diisi." };
  }
  if (!senderName.trim()) {
    return { ok: false, message: "Nama pemilik rekening pengirim wajib diisi." };
  }
  if (amountTransferred <= 0n) {
    return { ok: false, message: "Nominal transfer tidak valid." };
  }

  try {
    await submitFundingProof(session.id, projectId, {
      senderBank,
      senderAccount,
      senderName,
      amountTransferred,
    });

    revalidatePath(`/business/projects/${projectId}/funding`);
    revalidatePath(`/business/projects/${projectId}`);
    revalidatePath("/business");

    return {
      ok: true,
      message: "Bukti transfer berhasil dikirim! Menunggu verifikasi rekonsiliasi oleh Finance.",
    };
  } catch (error: unknown) {
    console.error("[SUBMIT PAYMENT PROOF ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal mengirim bukti pembayaran.",
    };
  }
}

export async function simulateInstantPaymentAction(
  prevState: FundingActionState | null,
  formData: FormData
): Promise<FundingActionState> {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya akun Bisnis/UMKM yang dapat melakukan simulasi pembayaran." };
  }

  const projectId = String(formData.get("projectId"));

  try {
    await simulateInstantFundingSuccess(session.id, projectId);

    revalidatePath(`/business/projects/${projectId}/funding`);
    revalidatePath(`/business/projects/${projectId}`);
    revalidatePath("/business");

    return {
      ok: true,
      message: "Simulasi pembayaran berhasil! Dana masuk ke escrow dan proyek kini aktif IN_PROGRESS.",
    };
  } catch (error: unknown) {
    console.error("[SIMULATE PAYMENT ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Simulasi pembayaran gagal.",
    };
  }
}

export async function reconcilePaymentAction(
  prevState: FundingActionState | null,
  formData: FormData
): Promise<FundingActionState> {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { ok: false, message: "Hanya tim Finance/Admin yang memiliki akses rekonsiliasi." };
  }

  const projectId = String(formData.get("projectId"));
  const approved = formData.get("approved") === "true";
  const externalReference = String(formData.get("externalReference") || "");
  const rawAmount = formData.get("amountReceived");
  const amountReceived = rawAmount ? BigInt(String(rawAmount)) : undefined;

  try {
    await reconcileFundingDeposit(projectId, {
      approved,
      amountReceived,
      externalReference: externalReference.trim() || undefined,
    });

    revalidatePath(`/business/projects/${projectId}/funding`);
    revalidatePath("/admin");

    return {
      ok: true,
      message: approved ? "Rekonsiliasi disetujui! Proyek berhasil diaktifkan." : "Rekonsiliasi ditolak.",
    };
  } catch (error: unknown) {
    console.error("[RECONCILE PAYMENT ERROR]:", error);
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Gagal melakukan rekonsiliasi.",
    };
  }
}
