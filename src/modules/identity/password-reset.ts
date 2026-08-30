import { createHash } from "node:crypto";

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function isResetTokenExpired(expires: Date, now = new Date()) {
  return expires.getTime() <= now.getTime();
}
