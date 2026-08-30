"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/src/adapters/database/prisma";
import { createSession, destroySession } from "@/src/lib/session";
import type { AuthResult, AuthUiAdapter, RegistrationRequest, AuthUser } from "@/src/auth-ui/types";
import { redirect } from "next/navigation";
import { z } from "zod";

const serverRegistrationSchema = z.object({
  role: z.enum(["TALENT", "BUSINESS"]),
  fullName: z.string().trim().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  termsAccepted: z.literal(true),
  privacyAccepted: z.literal(true),
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
    return { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Terjadi kesalahan sistem." } as AuthResult;
  }
}

export async function loginWithGoogle() {
  return { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Google login belum diimplementasikan." } as AuthResult;
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
      await tx.consentRecord.createMany({
        data: [
          { userId: createdUser.id, purpose: "TERMS_ACCEPTANCE", status: "GRANTED", source: "REGISTRATION" },
          { userId: createdUser.id, purpose: "PRIVACY_PROCESSING", status: "GRANTED", source: "REGISTRATION" },
        ],
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
    return { ok: false, code: "PROVIDER_UNAVAILABLE", message: "Pendaftaran gagal." } as AuthResult;
  }
}

export async function requestPasswordReset(email: string) {
  return { ok: true, message: "Jika email terdaftar, instruksi akan dikirim." } as const;
}

export async function logout() {
  await destroySession();
  return redirect("/login");
}
