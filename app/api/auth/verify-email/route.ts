import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/src/adapters/database/prisma";
import { createSession } from "@/src/lib/session";
import { hashEmailVerificationToken, isEmailVerificationExpired } from "@/src/modules/identity/email-verification";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/verify-email?error=invalid", url.origin));

  try {
    const hashed = hashEmailVerificationToken(token);
    const user = await prisma.$transaction(async (tx) => {
      const record = await tx.verificationToken.findUnique({ where: { token: hashed } });
      if (!record || !record.identifier.startsWith("EMAIL_VERIFICATION:") || isEmailVerificationExpired(record.expires)) {
        throw new Error("Invalid verification token");
      }
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${record.identifier}))`;
      const consumed = await tx.verificationToken.deleteMany({ where: { token: hashed, expires: { gt: new Date() } } });
      if (consumed.count !== 1) throw new Error("Verification token was already consumed");
      const email = record.identifier.slice("EMAIL_VERIFICATION:".length).toLowerCase();
      const existing = await tx.user.findUnique({ where: { email } });
      if (!existing || existing.emailVerified) throw new Error("Account is already verified or missing");
      const verified = await tx.user.update({
        where: { id: existing.id },
        data: { emailVerified: new Date(), identityStatus: "CONTACT_VERIFIED" },
      });
      await tx.verificationToken.deleteMany({ where: { identifier: record.identifier } });
      return verified;
    }, { isolationLevel: "Serializable" });

    await createSession({ id: user.id, email: user.email!, displayName: user.name ?? "User", role: user.role });
    (await cookies()).delete("pending_verification");
    const destination = user.role === "TALENT" ? "/talent/onboarding" : user.role === "BUSINESS" ? "/business/profile" : "/admin";
    return NextResponse.redirect(new URL(destination, url.origin));
  } catch (error) {
    console.error("[EMAIL VERIFICATION ERROR]", error);
    return NextResponse.redirect(new URL("/verify-email?error=invalid", url.origin));
  }
}
