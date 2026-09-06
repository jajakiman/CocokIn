import { createHash } from "node:crypto";

export function hashEmailVerificationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isEmailVerificationExpired(expires: Date, now = new Date()) {
  return expires.getTime() <= now.getTime();
}

export function verificationIdentifier(email: string) {
  return `EMAIL_VERIFICATION:${email.toLowerCase()}`;
}
