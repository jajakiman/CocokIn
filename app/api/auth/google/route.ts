import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { buildGoogleAuthorizationUrl } from "@/src/modules/identity/oauth";

export function GET(request: Request) {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const appUrl = process.env.APP_URL;
  if (!clientId || !appUrl) return NextResponse.json({ message: "Google login belum dikonfigurasi." }, { status: 503 });

  const url = new URL(request.url);
  const roleParam = url.searchParams.get("role")?.toUpperCase();
  const targetRole = roleParam === "BUSINESS" ? "BUSINESS" : "TALENT";

  const state = randomBytes(24).toString("base64url");
  const origin = new URL(appUrl).origin;
  const response = NextResponse.redirect(buildGoogleAuthorizationUrl({ clientId, origin, state }));
  
  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  response.cookies.set("oauth_role", targetRole, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60,
    path: "/",
  });

  return response;
}
