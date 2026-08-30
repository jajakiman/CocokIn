"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/src/adapters/database/prisma";
import { createSession, destroySession } from "@/src/lib/session";
import type { AuthResult, AuthUiAdapter, RegistrationRequest, AuthUser } from "@/src/auth-ui/types";
import { redirect } from "next/navigation";

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

export async function register(req: RegistrationRequest) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email: req.email } });
    if (existingUser) {
      return { ok: false, code: "INVALID_CREDENTIALS", message: "Email sudah terdaftar." } as AuthResult;
    }

    const passwordHash = await bcrypt.hash(req.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: req.email,
        name: req.fullName,
        passwordHash,
        role: req.role,
      }
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
