import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/src/adapters/database/prisma";
import { createSession } from "@/src/lib/session";
import { validateOAuthState } from "@/src/modules/identity/oauth";

type GoogleProfile = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const appUrl = process.env.APP_URL;
  const origin = appUrl ? new URL(appUrl).origin : "";
  const code = url.searchParams.get("code");

  try {
    validateOAuthState((await cookies()).get("oauth_state")?.value, url.searchParams.get("state"));
    if (!code) throw new Error("Authorization code is missing");

    if (!origin) throw new Error("APP_URL is not configured");
    const clientId = process.env.AUTH_GOOGLE_ID;
    const clientSecret = process.env.AUTH_GOOGLE_SECRET;
    if (!clientId || !clientSecret) throw new Error("Google login is not configured");

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/callback/google`,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) throw new Error("Google access token is missing");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { authorization: `Bearer ${token.access_token}` },
    });
    if (!profileResponse.ok) throw new Error("Google profile request failed");
    const profile = await profileResponse.json() as GoogleProfile;
    if (!profile.email || !profile.email_verified || !profile.sub) throw new Error("Google email is not verified");

    const user = await prisma.$transaction(async (tx) => {
      const linkedAccount = await tx.account.findUnique({
        where: { provider_providerAccountId: { provider: "google", providerAccountId: profile.sub } },
        include: { user: true },
      });
      if (linkedAccount) return linkedAccount.user;

      const emailCollision = await tx.user.findUnique({ where: { email: profile.email } });
      if (emailCollision) throw new Error("Google account must be linked from account settings");

      const saved = await tx.user.create({
            data: {
              email: profile.email,
              emailVerified: new Date(),
              image: profile.picture,
              name: profile.name ?? profile.email.split("@")[0],
              role: "TALENT",
              identityStatus: "CONTACT_VERIFIED",
            },
          });

      await tx.account.create({
        data: { userId: saved.id, type: "oauth", provider: "google", providerAccountId: profile.sub },
      });
      if (saved.role === "TALENT") {
        await tx.talentProfile.upsert({ where: { userId: saved.id }, update: {}, create: { userId: saved.id } });
      }
      return saved;
    });

    await createSession({
      id: user.id,
      email: user.email!,
      displayName: user.name ?? "User",
      role: user.role,
    });
    (await cookies()).delete("oauth_state");
    return NextResponse.redirect(new URL(user.role === "BUSINESS" ? "/business" : user.role === "ADMIN" ? "/admin" : "/talent", origin));
  } catch (error) {
    console.error("[GOOGLE OAUTH ERROR]", error);
    (await cookies()).delete("oauth_state");
    return NextResponse.redirect(new URL("/login?error=google", origin));
  }
}
