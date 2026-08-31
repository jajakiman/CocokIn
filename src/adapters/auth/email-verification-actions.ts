"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";

import { prisma } from "@/src/adapters/database/prisma";
import { scheduleVerificationEmail } from "@/src/adapters/email/verification-delivery";
import { hashEmailVerificationToken, verificationIdentifier } from "@/src/modules/identity/email-verification";

async function createEmailVerification(email: string) {
  const rawToken = randomBytes(32).toString("base64url");
  const identifier = verificationIdentifier(email);
  await prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${identifier}))`;
    await transaction.verificationToken.deleteMany({ where: { identifier } });
    await transaction.verificationToken.create({
      data: { identifier, token: hashEmailVerificationToken(rawToken), expires: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    });
  });
  return rawToken;
}

export async function resendVerificationEmail() {
  const email = (await cookies()).get("pending_verification")?.value;
  const parsed = z.string().email().safeParse(email);
  if (!parsed.success) return { ok: false, message: "Email verifikasi tidak ditemukan." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data } });
  if (!user || user.emailVerified) return { ok: true, message: "Jika akun belum terverifikasi, email baru akan dikirim." };
  const rawToken = await createEmailVerification(parsed.data);
  scheduleVerificationEmail(parsed.data, rawToken);
  return { ok: true, message: "Jika akun belum terverifikasi, email baru akan dikirim." };
}
