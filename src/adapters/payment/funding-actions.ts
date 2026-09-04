"use server";

import { getSession } from "@/src/lib/session";
import { revalidatePath } from "next/cache";
import {
  submitFundingProof,
  reconcileFundingDeposit,
  simulateInstantFundingSuccess,
} from "@/src/modules/payments/funding";
import { z } from "zod";

export type FundingActionState = {
  ok: boolean;
  message: string;
};

function sanitizeToBigInt(val: unknown): bigint | null {
  if (typeof val !== "string" && typeof val !== "number") return null;
  const clean = String(val).replace(/[^0-9]/g, "");
  if (!clean) return null;
  try {
    return BigInt(clean);
  } catch {
    return null;
  }
}

const submitProofSchema = z.object({
  projectId: z.string().min(1, "ID Proyek wajib diisi."),
  senderBank: z.string().min(1).default("BCA"),
  senderAccount: z.string().trim().min(3, "Nomor rekening pengirim minimal 3 karakter."),
  senderName: z.string().trim().min(2, "Nama pemilik rekening minimal 2 karakter."),
});

export async function submitPaymentProofAction(
  prevState: FundingActionState | null,
  formData: FormData
): Promise<FundingActionState> {
  const session = await getSession();

  if (!session || session.role !== "BUSINESS") {
    return { ok: false, message: "Hanya akun Bisnis/UMKM yang dapat mengirim bukti transfer." };
  }

  const rawProjectId = formData.get("projectId");
  const rawSenderBank = formData.get("senderBank");
  const rawSenderAccount = formData.get("senderAccount");
  const rawSenderName = formData.get("senderName");
  const rawAmount = formData.get("amountTransferred");

  const validation = submitProofSchema.safeParse({
    projectId: rawProjectId,
    senderBank: rawSenderBank || "BCA",
    senderAccount: rawSenderAccount,
    senderName: rawSenderName,
  });

  if (!validation.success) {
    return {
      ok: false,
      message: validation.error.issues[0]?.message || "Data formulir bukti transfer tidak valid.",
    };
  }

  const amountTransferred = sanitizeToBigInt(rawAmount);
  if (!amountTransferred || amountTransferred <= 0n) {
    return { ok: false, message: "Nominal transfer wajib berupa angka positif." };
  }

  const { projectId, senderBank, senderAccount, senderName } = validation.data;

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

  const projectId = String(formData.get("projectId") || "");
  if (!projectId) {
    return { ok: false, message: "ID Proyek tidak valid." };
  }

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

  const projectId = String(formData.get("projectId") || "");
  if (!projectId) {
    return { ok: false, message: "ID Proyek tidak valid." };
  }

  const approved = formData.get("approved") === "true";
  const externalReference = String(formData.get("externalReference") || "");
  const rawAmount = formData.get("amountReceived");
  const amountReceived = rawAmount ? sanitizeToBigInt(rawAmount) ?? undefined : undefined;

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
