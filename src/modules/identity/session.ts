import { createHash, randomBytes } from "node:crypto";

const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const VERIFICATION_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function createOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashIdentityToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sessionExpiry(now: Date): Date {
  return new Date(now.getTime() + SESSION_LIFETIME_MS);
}

export function verificationExpiry(now: Date): Date {
  return new Date(now.getTime() + VERIFICATION_LIFETIME_MS);
}
