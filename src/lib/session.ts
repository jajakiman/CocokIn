import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import type { AuthUser } from "@/src/auth-ui/types";
import { createHash } from "node:crypto";
import { prisma } from "@/src/adapters/database/prisma";

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET is required in production");
  }
  return new TextEncoder().encode(secret ?? "default_development_secret_key");
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(sessionKey());
}

export async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, sessionKey(), {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function createSession(user: AuthUser) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const persisted = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true, isSuspended: true },
  });
  if (!persisted || persisted.isSuspended) {
    throw new Error("Akun tidak ditemukan atau sedang ditangguhkan.");
  }
  const credentialFingerprint = createHash("sha256").update(persisted?.passwordHash ?? `oauth:${user.id}`).digest("hex");
  const session = await encrypt({ user, expires, credentialFingerprint });
  
  (await cookies()).set("session", session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<AuthUser | null> {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const parsed = await decrypt(sessionCookie);
    const user = parsed.user as AuthUser;
    const persisted = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true, isSuspended: true },
    });
    if (!persisted || persisted.isSuspended) return null;
    const expected = createHash("sha256").update(persisted.passwordHash ?? `oauth:${user.id}`).digest("hex");
    return parsed.credentialFingerprint === expected ? user : null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).set("session", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  });
}
