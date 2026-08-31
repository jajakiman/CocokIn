"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { prisma } from "@/src/adapters/database/prisma";
import { createSession, destroySession } from "@/src/lib/session";
import type { AuthResult, AuthUiAdapter, RegistrationRequest, AuthUser } from "@/src/auth-ui/types";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requestPasswordReset as requestPasswordResetAction } from "./password-reset-actions";
import { registrationConsentRecords } from "@/src/modules/identity/registration-consent";
import { hashEmailVerificationToken, verificationIdentifier } from "@/src/modules/identity/email-verification";
import { scheduleVerificationEmail } from "@/src/adapters/email/verification-delivery";
import { cookies } from "next/headers";

const serverRegistrationSchema = z.object({
  role: z.enum(["TALENT", "BUSINESS"]),
  fullName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  termsAccepted: z.literal(true),
});

export async function parseRegistrationRequest(input: unknown) {
  return serverRegistrationSchema.parse(input);
}

export async function loginWithCredentials({ email, password }: Parameters<AuthUiAdapter['loginWithCredentials']>[0]) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." } as AuthResult;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." } as AuthResult;
    }
    if (!user.emailVerified) {
      (await cookies()).set("pending_verification", user.email!, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 24 * 60 * 60, path: "/" });
      return redirect("/verify-email");
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      displayName: user.name || "User",
      role: user.role,
    };

    await createSession(authUser);
    return { ok: true, user: authUser } as AuthResult;
  } catch (e) {
    console.error("[AUTH LOGIN ERROR]:", e);
    const errorMessage = e instanceof Error ? e.message : "Terjadi kesalahan sistem.";
    return { ok: false, code: "PROVIDER_UNAVAILABLE", message: `Terjadi kesalahan sistem: ${errorMessage}` } as AuthResult;
  }
}

export async function loginWithGoogle() {
  return redirect("/api/auth/google");
}

export async function register(input: RegistrationRequest) {
  try {
    const req = await parseRegistrationRequest(input);
    const normalizedEmail = req.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email sudah terdaftar." } as AuthResult;
    }

    const passwordHash = await bcrypt.hash(req.password, 10);
    
    const rawVerificationToken = randomBytes(32).toString("base64url");
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { email: normalizedEmail, name: req.fullName, passwordHash, role: req.role }
      });

      // Buat profile default otomatis agar siap digunakan dashboard
      if (req.role === "TALENT") {
        await tx.talentProfile.create({
          data: { userId: createdUser.id }
        });
      } else if (req.role === "BUSINESS") {
        await tx.businessProfile.create({
          data: { userId: createdUser.id, businessName: req.fullName }
        });
      }

      await tx.consentRecord.createMany({
        data: registrationConsentRecords(createdUser.id),
      });
      await tx.verificationToken.create({
        data: {
          identifier: verificationIdentifier(createdUser.email!),
          token: hashEmailVerificationToken(rawVerificationToken),
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return createdUser;
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      displayName: user.name || "User",
      role: user.role,
    };

    (await cookies()).set("pending_verification", user.email!, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 24 * 60 * 60, path: "/" });
    scheduleVerificationEmail(user.email!, rawVerificationToken);
    return { ok: true, user: authUser } as AuthResult;
  } catch (e) {
    console.error("[AUTH REGISTER ERROR]:", e);
    const errorMessage = e instanceof Error ? e.message : "Pendaftaran gagal.";
    return { ok: false, code: "PROVIDER_UNAVAILABLE", message: `Pendaftaran gagal: ${errorMessage}` } as AuthResult;
  }
}

export async function requestPasswordReset(email: string) {
  return requestPasswordResetAction(email);
}

export async function logout() {
  await destroySession();
  return redirect("/login");
}
