import { NextResponse } from "next/server";

import { PrismaIdentityStore } from "@/src/adapters/identity/prisma-identity-store";
import { isDatabaseAuthConfigured, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "@/src/auth-contract";
import { getPrisma } from "@/src/lib/db/prisma";
import type { StoredIdentityUser } from "@/src/modules/identity";

export function authNotConfigured() {
  return NextResponse.json(
    { ok: false, code: "AUTH_NOT_CONFIGURED", message: "Autentikasi belum dikonfigurasi." },
    { status: 503 },
  );
}

export function getIdentityStore() {
  return isDatabaseAuthConfigured() ? new PrismaIdentityStore(getPrisma()) : null;
}

export function publicUser(user: StoredIdentityUser) {
  return {
    id: user.id,
    displayName: user.name ?? user.email,
    email: user.email,
    role: user.role,
  };
}

export function withSessionCookie(body: object, sessionToken: string, expires: Date) {
  const response = NextResponse.json(body);
  response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
    ...SESSION_COOKIE_OPTIONS,
    expires,
  });
  return response;
}

export function invalidRequest(message = "Permintaan autentikasi tidak valid.") {
  return NextResponse.json(
    { ok: false, code: "INVALID_CREDENTIALS", message },
    { status: 400 },
  );
}
