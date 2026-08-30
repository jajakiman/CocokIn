"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/src/adapters/database/prisma";
import { sendPasswordResetEmail } from "@/src/adapters/email/resend";
import { hashResetToken, isResetTokenExpired } from "@/src/modules/identity/password-reset";

const resetSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, { path: ["confirmPassword"], message: "Konfirmasi kata sandi tidak cocok." });

export async function requestPasswordReset(email: string) {
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { ok: false, message: "Masukkan alamat email yang valid." };

  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data } });
    if (user) {
      const rawToken = randomBytes(32).toString("base64url");
      const token = hashResetToken(rawToken);
      await prisma.$transaction([
        prisma.verificationToken.deleteMany({ where: { identifier: parsed.data } }),
        prisma.verificationToken.create({
          data: { identifier: parsed.data, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
        }),
      ]);
      let appUrl = process.env.APP_URL;
      if (!appUrl) {
        appUrl = "https://cocok-in-git-dev-zakyryan0-4528s-projects.vercel.app";
      }
      if (!appUrl.startsWith("http://") && !appUrl.startsWith("https://")) {
        appUrl = `https://${appUrl}`;
      }
      const resetUrl = new URL("/reset-password", appUrl);
      resetUrl.searchParams.set("token", rawToken);
      try {
        await sendPasswordResetEmail({ email: parsed.data, resetUrl: resetUrl.toString() });
      } catch (error) {
        console.error("[PASSWORD RESET DELIVERY ERROR]:", error);
      }
    }
    return { ok: true, message: "Jika email terdaftar, instruksi reset telah dikirim." };
  } catch (error) {
    console.error("[PASSWORD RESET REQUEST ERROR]", error);
    return { ok: true, message: "Jika email terdaftar, instruksi reset telah dikirim." };
  }
}

export async function resetPassword(input: { token: string; password: string; confirmPassword: string }) {
  const parsed = resetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };

  try {
    const tokenHash = hashResetToken(parsed.data.token);
    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    await prisma.$transaction(async (tx) => {
      const record = await tx.verificationToken.findUnique({ where: { token: tokenHash } });
      if (!record || isResetTokenExpired(record.expires)) throw new Error("Invalid or expired reset token");
      const consumed = await tx.verificationToken.deleteMany({
        where: { token: tokenHash, expires: { gt: new Date() } },
      });
      if (consumed.count !== 1) throw new Error("Reset token was already consumed");
      await tx.user.update({ where: { email: record.identifier }, data: { passwordHash } });
      await tx.verificationToken.deleteMany({ where: { identifier: record.identifier } });
    }, { isolationLevel: "Serializable" });
    return { ok: true, message: "Kata sandi berhasil diperbarui. Silakan masuk kembali." };
  } catch (error) {
    console.error("[PASSWORD RESET ERROR]", error);
    return { ok: false, message: "Kata sandi tidak dapat diperbarui." };
  }
}
