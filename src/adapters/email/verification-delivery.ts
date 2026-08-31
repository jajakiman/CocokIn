import { after } from "next/server";

import { sendEmailVerificationEmail } from "./smtp";

export function scheduleVerificationEmail(email: string, rawToken: string) {
  after(async () => {
    try {
      const appUrl = process.env.APP_URL;
      if (!appUrl) throw new Error("APP_URL is required for email verification");
      const verificationUrl = new URL("/api/auth/verify-email", appUrl);
      verificationUrl.searchParams.set("token", rawToken);
      await sendEmailVerificationEmail({ email, verificationUrl: verificationUrl.toString() });
    } catch (error) {
      console.error("[EMAIL VERIFICATION DELIVERY ERROR]", error);
    }
  });
}
