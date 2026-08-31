"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/src/adapters/database/prisma";
import { createSession, destroySession } from "@/src/lib/session";
import type { AuthResult, AuthUiAdapter, RegistrationRequest, AuthUser } from "@/src/auth-ui/types";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requestPasswordReset as requestPasswordResetAction } from "./password-reset-actions";
import { registrationConsentRecords } from "@/src/modules/identity/registration-consent";

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
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." } as AuthResult;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email atau kata sandi salah." } as AuthResult;
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
    const existingUser = await prisma.user.findUnique({ where: { email: req.email } });
    if (existingUser) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email sudah terdaftar." } as AuthResult;
    }

    const passwordHash = await bcrypt.hash(req.password, 10);
    
    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: { email: req.email, name: req.fullName, passwordHash, role: req.role }
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

      return createdUser;
    });

    const authUser: AuthUser = {
      id: user.id,
      email: user.email!,
      displayName: user.name || "User",
      role: user.role,
    };

    // Auto login after registration
    await createSession(authUser);
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
