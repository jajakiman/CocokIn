"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export type ModerationActionState = { ok: boolean; message: string };

const userIdSchema = z.string().min(1, "ID pengguna tidak valid.");
const suspendSchema = z.object({
  userId: userIdSchema,
  reason: z.string().trim().min(10, "Alasan penangguhan minimal 10 karakter.").max(500),
  confirmed: z.literal("true", { message: "Konfirmasi dampak penangguhan wajib diberikan." }),
});
const restoreSchema = z.object({
  userId: userIdSchema,
  reason: z.string().trim().min(10, "Alasan pemulihan minimal 10 karakter.").max(500),
});
const reportSchema = z.object({
  reportId: z.string().min(1, "ID laporan tidak valid."),
  resolution: z.enum(["DISMISSED", "ACTIONED"]),
  notes: z.string().trim().min(10, "Catatan penyelesaian minimal 10 karakter.").max(1000),
});

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "ADMIN" ? session : null;
}

export async function suspendUserAction(
  _previous: ModerationActionState | null,
  formData: FormData,
): Promise<ModerationActionState> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, message: "Hanya Admin yang dapat menangguhkan akun." };

  const parsed = suspendSchema.safeParse({
    userId: formData.get("userId"),
    reason: formData.get("reason"),
    confirmed: formData.get("confirmed"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };

  const result = await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, role: true, isSuspended: true },
    });
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    if (target.role === "ADMIN") return { ok: false, message: "Akun Admin tidak dapat ditangguhkan dari konsol ini." };

    const suspendedAt = new Date();
    const updated = await tx.user.updateMany({
      where: { id: target.id, role: { not: "ADMIN" }, isSuspended: false },
      data: { isSuspended: true, suspendedAt, suspensionReason: parsed.data.reason },
    });
    if (updated.count !== 1) return { ok: false, message: "Status akun berubah. Muat ulang dan coba lagi." };
    await tx.auditEvent.create({
      data: {
        action: "USER_SUSPENDED",
        actorId: admin.id,
        payload: { targetUserId: target.id, reason: parsed.data.reason, suspendedAt: suspendedAt.toISOString() },
      },
    });
    return { ok: true, message: "Akun berhasil ditangguhkan." };
  });

  if (result.ok) revalidatePath("/admin");
  return result;
}

export async function restoreUserAction(
  _previous: ModerationActionState | null,
  formData: FormData,
): Promise<ModerationActionState> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, message: "Hanya Admin yang dapat memulihkan akun." };

  const parsed = restoreSchema.safeParse({ userId: formData.get("userId"), reason: formData.get("reason") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };

  const result = await prisma.$transaction(async (tx) => {
    const target = await tx.user.findUnique({
      where: { id: parsed.data.userId },
      select: { id: true, role: true, isSuspended: true },
    });
    if (!target) return { ok: false, message: "Pengguna tidak ditemukan." };
    if (target.role === "ADMIN") return { ok: false, message: "Akun Admin tidak dapat diubah dari konsol ini." };

    const updated = await tx.user.updateMany({
      where: { id: target.id, role: { not: "ADMIN" }, isSuspended: true },
      data: { isSuspended: false, suspendedAt: null, suspensionReason: null },
    });
    if (updated.count !== 1) return { ok: false, message: "Status akun berubah. Muat ulang dan coba lagi." };
    await tx.auditEvent.create({
      data: { action: "USER_RESTORED", actorId: admin.id, payload: { targetUserId: target.id, reason: parsed.data.reason } },
    });
    return { ok: true, message: "Akun berhasil dipulihkan." };
  });

  if (result.ok) revalidatePath("/admin");
  return result;
}

export async function resolveMessageReportAction(
  _previous: ModerationActionState | null,
  formData: FormData,
): Promise<ModerationActionState> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, message: "Hanya Admin yang dapat menyelesaikan laporan." };

  const parsed = reportSchema.safeParse({
    reportId: formData.get("reportId"),
    resolution: formData.get("resolution"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };

  const result = await prisma.$transaction(async (tx) => {
    const report = await tx.messageReport.findUnique({
      where: { id: parsed.data.reportId },
      select: { id: true, status: true },
    });
    if (!report) return { ok: false, message: "Laporan tidak ditemukan." };
    if (report.status !== "PENDING") return { ok: false, message: "Laporan ini sudah diselesaikan." };

    const resolvedAt = new Date();
    const updated = await tx.messageReport.updateMany({
      where: { id: report.id, status: "PENDING" },
      data: {
        status: parsed.data.resolution,
        resolutionNotes: parsed.data.notes,
        resolvedAt,
        resolvedById: admin.id,
      },
    });
    if (updated.count !== 1) return { ok: false, message: "Laporan sudah diproses Admin lain." };
    await tx.auditEvent.create({
      data: {
        action: "MESSAGE_REPORT_RESOLVED",
        actorId: admin.id,
        payload: { reportId: report.id, resolution: parsed.data.resolution, notes: parsed.data.notes },
      },
    });
    return { ok: true, message: "Laporan berhasil diselesaikan tanpa menghapus riwayat." };
  });

  if (result.ok) revalidatePath("/admin");
  return result;
}
